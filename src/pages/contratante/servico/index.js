import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import firebase from '../../../firebaseConnection';
import UserServInfo from './user_servico';
import './servico.css'
import { toast } from 'react-toastify';

export default function Servico()
{
    const {id} = useParams();
    const [status, setStatus] = useState(false)
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [nomeTrab, setNomeTrab] = useState('');
    const [sobrenomeTrab, setSobrenomeTrab] = useState('');
    const [listas, setListas] = useState([]);
    const [data, setData] = useState('');
    const [status1, setStatus1] = useState(0);
    const [status2, setStatus2] = useState(0);
    const [userInfo, setUserInfo] = useState([]);

    useEffect(() => {
         firebase.firestore().collection('servicos')
            .onSnapshot((doc) => {
                let servico =[];

                doc.forEach((item) =>
                {
                    if(id === item.id)
                    {  
                        servico.push({
                            id: item.id,
                            email: item.data().email,
                            valor: item.data().valor,
                            passagem: item.data().passagem_inclusa,
                            data: item.data().data,
                            rua: item.data().rua,
                            cidade: item.data().cidade,
                            bairro: item.data().bairro,
                            numero: item.data().numero,
                            complemento: item.data().complemento,
                        })
                    localStorage.setItem('emailUserServ',servico[0].email)
                    setListas(servico);
                    setStatus1(1);
                    }
                });
            })
        if(status1 === 1)    
        {
            firebase.firestore().collection('usuarios')
            .onSnapshot((doc) => {
                let usuario =[];
                let userEmail = localStorage.getItem('emailUserServ')
                doc.forEach((item) => {
                    if(userEmail === item.id)
                    {
                        usuario.push({
                            id: item.id,
                            nome: item.data().nome,
                            sobrenome: item.data().sobrenome,
                            telefone: item.data().telefone
                        })
                    }
                    setUserInfo(usuario);
                    setStatus2(1)
                });
            })
        }

        
    }, [id, userInfo, status2, status1])

    async function pegaInfo()
    {
        firebase.firestore().collection('usuarios')
        .onSnapshot((doc) =>{
            let userNome = '';
            let userSobrenome = '';
            let meuEmail = localStorage.getItem('meuEmail');

            doc.forEach((item) =>{
                if(meuEmail === item.id)
                {
                    userNome  = item.data().nome;
                    userSobrenome = item.data().sobrenome;
                }
                setNome(userNome);
                setSobrenome(userSobrenome);
                setStatus(true)                
            })
            
        })
        if(status)
        {
            firebase.firestore().collection('usuarios')
            .onSnapshot((doc) =>{
                let nomeTrab = '';
                let sobrenomeTrab = '';
                doc.forEach((item) =>{
                    if(listas[0].email === item.id)
                    {
                        nomeTrab = item.data().nome;
                        sobrenomeTrab = item.data().sobrenome;
                    }
                    setNomeTrab(nomeTrab);
                    setSobrenomeTrab(sobrenomeTrab);
                })
            })

        }
        enviaDados();
    }

    function enviaDados()
    {
        let emailTrab = listas[0].email;
        solicitaServico({subject: 'Serviço Solicitado!', message: `Um de seus serviços acaba de ser solicitado por ${nome} ${sobrenome}. Volte ao site para confirmar se quer realizar este serviço ou nao.`, from_name: 'Equipe Faxilita',to_name:`${nomeTrab} ${sobrenomeTrab}`, to_email: emailTrab, reply_to: 'ovoo465@gmail.com'});
        
        let meuEmail = localStorage.getItem('meuEmail')
        
        firebase.firestore().collection('servicos')
        .doc(id)
        .update({
            status: 'Aguardando Confirmação',
            solicitante: meuEmail
        })
    }

    function solicitaServico(variables)
    {
        window.emailjs.send(
          'service_q78t2j6', 'template_hvfdfua',
          variables
          ).then(res => {
              toast.success('Email enviado para o anunciante do serviço.')
              window.location.href = '/lista_servico'
          })
          .catch(
              err => console.error('Algo aconteceu:', err)
              )
    }

    return(
              
         <div className='servico'>
             {status2 === 1 ?
            <fieldset className='fieldset_servico'>
                    <div className=''>
                        <article className='article_servico'>
                            <h2>Informações do Serviço:</h2>
                            <label>Valor:</label>
                            <span>{listas[0].valor}</span><br/>
                            <label>Passagem Inclusa no valor: </label>
                            <span>{listas[0].passagem}</span><br/>
                            <label>Data do servico:</label>
                            <input type='date' value={listas[0].data} onChange={(e)=>{setData(e.target.value)}}/>
                        </article>
                        <h2>Informações do anunciante do serviço:</h2>
                        <UserServInfo/>
                        <button className='solicita' onClick={pegaInfo}>Solicitar Servico</button>
                    </div>
            </fieldset>
            :
            <div><h1>Carregando...</h1></div>
            }
        </div>
           
    )
}

