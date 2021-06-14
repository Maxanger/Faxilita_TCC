import {useEffect, useState} from 'react';
import firebase from '../../../firebaseConnection';
import {toast} from 'react-toastify'
import "./cadastro.css";
import { cpfMask, telMask, alfanumMask, numContaMask, agenciaMask } from '../../js_mask/mask';

export default function CadastroU()
{
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [endereco, setEndereco] = useState('');
    const [nascimento, setNasc] = useState('');
    const [genero, setGenero] = useState('');
    const [banco, setBanco] = useState('');
    const [numConta, setNumConta] = useState('');
    const [agencia, setAgencia] = useState('');
    const [pix, setPix] = useState('');
    const [status1, setStatus1] = useState(0);
    

    useEffect(()=>{
        if(tipoUsuario === '')
        {
            setStatus1(0);
        }
        else if (tipoUsuario === 'Trabalhador')
        {
            setStatus1(1);
        }
        else{
            setStatus1(0);
        }
    },[status1, tipoUsuario])

    function enviaEmail (variables) {
        let status = false;
        window.emailjs.send(
          'service_q78t2j6', 'template_s6thqzj',
          variables
          ).then(() => {
            toast.success('Email successfully sent!');

            status=true;

            if(status)
            {
                setEmail('');
                setSenha('');
                setNome('');
                setSobrenome('');
                setTelefone('');
                setCpf('');
                setEndereco('');
                setNasc('');
                firebase.auth().signOut();
                window.location.href = './';
            }
          })
          .catch(
              err => console.error('Oh well, you failed. Here some thoughts on the error that occured:', err
            ))
    }

    function handleChangeBanco(e)
    {
        setBanco(alfanumMask(e.target.value));
    }

    function handleChangeAgencia(e)
    {
        setAgencia(agenciaMask(e.target.value));
    }

    function handlChangeNumConta(e)
    {
        setNumConta(numContaMask(e.target.value));
    }

    function handleChangeCPF(e)
    {
        setCpf(cpfMask(e.target.value));
    }
    
    function handleChangeTel(e)
    {
        setTelefone(telMask(e.target.value));
    }

    function handleChangeNome(e)
    {
        setNome(alfanumMask(e.target.value));
    }

    function handleChangeSobrenome(e)
    {
        setSobrenome(alfanumMask(e.target.value));
    }

    async function cadastraUsuario()
    {
        let dtAtual = new Date();
        let dtFornec = new Date(nascimento);
        let diff = dtAtual.getFullYear() - dtFornec.getFullYear();
        let criou = false;
        if(email.length === 0 || senha.length === 0 || nome.length === 0 || sobrenome.length === 0 || tipoUsuario.length === 0 || telefone.length === 0 || cpf.length === 0 || endereco.length === 0 || nascimento.length === 0 || genero.length === 0 )
        {
            toast.warning("Por favor preencha todos os campos para continuar.")
        }
        else if (cpf === '000.000.000-00' || cpf === '111.111.111-11'|| cpf === '222.222.222-22'|| cpf === '333.333.333-33' || cpf === '444.444.444-44'|| cpf === '555.555.555-55'|| cpf === '666.666.666-66'|| cpf === '777.777.777-77'|| cpf === '888.888.888-88'|| cpf === '999.999.999-99')
        {
            toast.warning('Digite um CPF valido para continuar.')
        }
        else if(diff < 18 && diff>99)
        {
            toast.warning('Cadastro disponivel apenas para maiores de 18 anos.')
            toast.warning('Digite uma data válida!')
        }
        else if(senha !== confirmSenha)
        {
            toast.warning('As senhas nao coincidem!')
        }
        else{
            await firebase.auth().createUserWithEmailAndPassword(email, senha)
            .then(() => {
                toast.success('Cadastro de usuario!!');
                criou = true;
            })
            .catch((error) => {
                if(error.code === "auth/weak-password")
                {toast.error('senha fraca')}
                else if(error.code === "auth/email-already-in-use")
                {toast.error("email ja cadastrado")}
                else if(error.code === "auth/invalid-email")
                {toast.error('endereço de email invalido')}
            })

            if (criou === true)
            {
                await firebase.firestore().collection('usuarios')
                .doc(email)
                .set(
                    {
                        nome: nome,
                        sobrenome: sobrenome,
                        cpf: cpf,
                        endereco: endereco,
                        telefone: telefone,
                        dt_nascimento: nascimento,
                        genero: genero,
                        tp_usuario: tipoUsuario 
                    }
                )   
                .then(() => {
                    toast.success('cadastro informações');                
                    enviaEmail({message: `Seja muito bem-vindo ao Faxilita, agora voce pode usufruir de nosso sistema de anuncio e busca de serviços domésticos.`, from_name: 'Equipe Faxilita',to_name: nome, to_email: email, reply_to: 'ovoo465@gmail.com'});
                })
                .catch((e) =>{
                    toast.warning('Erro'+e)
                })

                if(tipoUsuario === 'Trabalhador')
                {
                await firebase.firestore().collection('conta_bancaria')
                .doc(numConta)
                .set(
                    {
                        email: email,
                        nome: nome+' '+sobrenome,
                        cpf: cpf,
                        agencia: agencia,
                        pix: pix
                    }
                )
                }

            }
            else{
                toast.warning("Informações nao salvas");
            }
        }
    }

    

    return(
        <div className="form_cadastro">           
            <label>Email:</label>
            <input type='text' value={email} required={true} id="email" onChange={(e) => {setEmail(e.target.value)}}/>
            <br/>

            <label>Senha:</label>
            <input type='password' value={senha} onChange={(e) => {setSenha(e.target.value)}}/>
            <br/>

            <label>Confirmar Senha:</label>
            <input type='password' value={confirmSenha} onChange={(e) => {setConfirmSenha(e.target.value)}}/>
            <br/>

            <label>Nome:</label>
            <input type='text' value={nome} onChange={(e) => {handleChangeNome(e)}}/>
            <br/>

            <label>Sobrenome:</label>
            <input type='text' value={sobrenome} onChange={(e) => {handleChangeSobrenome(e)}}/>
            <br/>

            <label>Telefone Celular:</label>
            <input type='text' value={telefone} onChange={(e) => {handleChangeTel(e)}}/>
            <br/>

            <label>Endereco:</label>
            <input type='text' value={endereco} onChange={(e) => {setEndereco(e.target.value)}}/>
            <br/>

            <label>CPF:</label>
            <input type='text' value={cpf} onChange={(e) => {handleChangeCPF(e)}}/>
            <br/>

            <label>Genero: </label>
            <div value={genero} onChange={(e) => {setGenero(e.target.value)}}>
                <input type="radio" value="Masculino" name='genero'/>Masculino
                <input type="radio" value="Feminino" name='genero'/>Feminino
                <input type="radio" value="Outro" name='genero'/>Outro
            </div>
            <br/>

            <label>Tipo de Conta: </label>
            <div value={tipoUsuario} onChange={(e) => {setTipoUsuario(e.target.value)}}>
                <input type="radio" value="Trabalhador" name='tipoUsuario'/>Trabalhador
                <input type="radio" value="Contratante" name='tipoUsuario'/>Contratante
            </div>
            <br/>

            <label>Data de Nascimento:</label>
            <input type="date" value={nascimento} onChange={(e) => {setNasc(e.target.value)}}/>
            <br/>
           

            {status1 === 1 ? 

            <fieldset>
                <legend>Dados Bancarios (Necessario apenas para transferencias bancárias)</legend>
                <label>Banco:</label>
                <input type="text" value={banco} onChange={(e)=>{handleChangeBanco(e)}}/>
                <br/>
                <label>Conta:</label>
                <input type="text" value={numConta} onChange={(e)=>{handlChangeNumConta(e)}}/>
                <br/>
                <label>Agencia:</label>
                <input type="text" value={agencia} onChange={(e)=>{handleChangeAgencia(e)}}/>
                <br/>
                <label>Chave PIX:</label>
                <input type='text' value={pix} onChange={(e)=>{setPix(e.target.value)}}/>
            </fieldset>
            
            :
            <div></div>
            }
            <button onClick={cadastraUsuario}>Cadastrar</button>
        </div>
    )
}