import {useState, useEffect} from 'react';
import firebase from '../../../firebaseConnection';
import {toast} from 'react-toastify';
import './atualiza.css';


export default function AtualizaCadastro()
{
    const [log, setLog] = useState(false);
    const [senha, setSenha] = useState('');
    const [info, setInfo] = useState([]);
    const [nome, setNome] = useState('');
    const [id, setId] = useState('');
    const [cpf, setCpf] = useState('');
    const [endereco, setEndereco] = useState('');
    const [nasc, setNasc] = useState('');

    useEffect(() => {
            firebase.firestore().collection("usuarios")
            .onSnapshot((doc) => {
                let infoConta =[];

                doc.forEach((item) => {
                    if(item.id === localStorage.getItem('meuEmail'))
                    {
                        infoConta.push
                        ({
                            nome: item.data().nome,
                            cpf: item.data().cpf,
                            endereco: item.data().endereco,
                            nascimento: item.data().dt_nascimento
                        })
                    }
                });
                setInfo(infoConta);

            return(()=>{})    
            })
    }, [])


    async function verificaSenha()
    {
        await firebase.auth().signInWithEmailAndPassword(localStorage.getItem('meuEmail'), senha)
        .then(() =>{
            toast.success("Verificação de senha concluida.");
            setLog(true);
            setId(info[0].id);
            setNome(info[0].nome);
            setCpf(info[0].cpf);
            setEndereco(info[0].endereco);
            setNasc(info[0].nascimento);
            console.log(nome);
        })
        .catch(() => {
            toast.error("Senha incorreta, verifique se a senha foi digitada corretamente e tente novamente.")
        })
        
    }

    async function deletaConta()
    {
        await firebase.firestore().collection('servicos')
        .onSnapshot((doc)=>{
            let email = localStorage.getItem('meuEmail')
            doc.forEach((item)=>{
                if(item.data().email === email)
                {
                    firebase.firestore().collection('servicos').doc(`${item.id}`).delete().then().catch();
                }
            })
            
            firebase.firestore().collection('conta_bancaria')
            .onSnapshot((doc)=>{
                let email = localStorage.getItem('meuEmail');
                doc.forEach((item)=>{
                    if(item.data().email === email)
                    {
                        firebase.firestore().collection('conta_bancaria').doc(`${item.id}`).delete().then().catch();
                    }
                })
            })


            firebase.firestore().collection('usuarios')
            .doc(localStorage.getItem('meuEmail'))
            .delete()
            .then(()=>{
                let user =  firebase.auth().currentUser;
                user.delete()
                .then(()=>{
                    toast.success('Apagou Tudo');
                    firebase.auth().signOut();
                    window.location.href = './';
                })
                .catch((erro)=>{console.log(erro)})            
            })
        })

        
            
    }
    

    async function atualizaCadastro()
    {
        //fazer filtragem para ver se o email ja ta cadastrado em outra pagina
        await firebase.firestore().collection('usuarios')
        .doc(localStorage.getItem('meuEmail'))
        .update({
            id: id,
            nome: nome,
            cpf: cpf,
            endereco: endereco,
            dt_nascimento: nasc
        })
        .then(() => {
            toast.success("Dados Atualizados com sucesso.");
        })
        .catch(() => {
            toast.error("Erro ao atualizar dados")
        })
    }

    return(
        <div>
                {!log ?
                <div className="form_atualiza">
                    <label>Digite sua senha para proseguir:</label>
                    <input type='password' value={senha} onChange={(e) => {setSenha(e.target.value)}}/>
                    <button onClick={verificaSenha}>Verificar</button>
                </div>
                :
                <div className="form_atualiza">
                    <fieldset className='fieldset_atualiza'>
                    <article>
                        <h2>Atualize os campos que deseja:</h2>
                        <label>Nome: </label>
                        <input type='text' value={nome} onChange={(e) => {setNome(e.target.value)}}/>
                        <br/><br/>
                        <label>CPF: </label>
                        <input type='text' value={cpf}  onChange={(e) => {setCpf(e.target.value)}}/>
                        <br/><br/>
                        <label>Endereco: </label>
                        <input type='text' value={endereco}  onChange={(e) => {setEndereco(e.target.value)}}/>
                        <br/><br/>
                        <label>Data de Nascimento: </label>
                        <input type='date' value={nasc} onChange={(e) => {setNasc(e.target.value)}}/>
                        <br/><br/>
                        <button onClick={atualizaCadastro}>Atualizar</button>
                        <button onClick={deletaConta}>Deletar Conta</button>
                    </article>
                    </fieldset>
                </div>
                }
        </div>
    )
}