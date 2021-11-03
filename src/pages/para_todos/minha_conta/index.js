import {useEffect, useState} from 'react';
import firebase from '../../../firebaseConnection';
import './minha_conta.css';

export default function MinhaConta()
{
    const [user, setUser] = useState(false);
    const [info, setInfo] = useState([]);
    const [nasc, setNasc] = useState('');

    useEffect(() => {
        async function checaLogin()
        {
            await firebase.auth().onAuthStateChanged((user) =>{
                if(user)
                {
                    setUser(true);
                }
                else{
                    setUser(false);
                }
            });
        }
        checaLogin();
        return(() => {})
    }, [])

    useEffect(()=> {
        async function loadInfo()
        {
            await firebase.firestore().collection("usuarios")
            .onSnapshot((doc) => {
                let infoConta =[];

                doc.forEach((item) => {
                    if(item.id === localStorage.getItem('meuEmail'))
                    {
                    infoConta.push({
                        id: item.id,
                        email: item.data().email,
                        nome: item.data().nome,
                        sobrenome: item.data().sobrenome,
                        cpf: item.data().cpf,
                        endereco: item.data().endereco,
                        nascimento: item.data().dt_nascimento
                    })
                    }
                });
                setInfo(infoConta);
            })
        }
        loadInfo();
        return(() => {})
    }, [])
    return(
        <div >
            {!user ?
                <div>
                    <h1>Carregando...</h1>
                </div>
            :
                <div className="conta">
                
                    return(
                        <fieldset className='fieldset_conta'>
                            
                            <article className='article_conta'>
                                <h3>Informações da Conta:</h3>
                                <label>Nome: </label>
                                <span>{`${info.nome} ${info.sobrenome}`}</span>
                                <br/><br/>
                                <label>Endereço: </label>
                                <span>{info.endereco}</span>
                                <br/><br/>
                                <label>CPF: </label>
                                <span>{info.cpf}</span>
                                <br/><br/>
                                <label>Data de Nascimento: </label>
                                <input type='date' value={info.nascimento} disabled='' onChange={(e)=>{setNasc(e.target.value)}}/>
                                <br/><br/>
                                <label>Email: </label>
                                <span>{info.id}</span>
                            </article>
                            <br/><br/>
                        </fieldset>       
                    )
                
                </div>
            } 
        </div>
    )
}
