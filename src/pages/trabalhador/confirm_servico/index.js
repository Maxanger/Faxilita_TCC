import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import firebase from '../../../firebaseConnection';
import {toast} from 'react-toastify';
import './confirm_servico.css'

export default function ConfirmServico()
{
    const {id} = useParams();
    const [data, setData] = useState('');
    const [status, setStatus] = useState(0)
    const [infoSolic, setInfoSolic] = useState([]);

    useEffect(() =>{
        if(infoSolic.length === 0 )
        {firebase.firestore().collection('usuarios')
        .onSnapshot((doc)=>{
            let emailSolicitante = localStorage.getItem('EmailSolicitante')
            let userCont =[];
            doc.forEach((item) =>{
                if(emailSolicitante === item.id)
                {
                    userCont.push({
                        email: item.id,
                        nome: item.data().nome,
                        sobrenome: item.data().sobrenome,
                        dt_nasc: item.data().dt_nascimento,
                        telefone: item.data().telefone
                    })
                }
            })
            setInfoSolic(userCont);
            setStatus(1);
        })
        }
        
        
       
        return() =>
        {
            
        }

    }, [infoSolic])

    function confirmaEmail(variables)
    {
        window.emailjs.send(
          'service_q78t2j6', 'template_hvfdfua',
          variables
          ).then(res => {
              toast.success('Email de confirmação enviado para o solicitante serviço.');
              window.location.href ='/meus_servicos' ;
          })
          .catch(
              err => console.error('Algo aconteceu:', err)
              )
    }

    function confirmaSolic(resp)
    {
        let email = localStorage.getItem('EmailSolicitante')
        let resposta = resp;
        if(resposta === 's')
        {
            firebase.firestore().collection('servicos')
            .doc(id)
            .update({
                status: 'Confirmado'
            })
            confirmaEmail({subject: 'Serviço Confirmado!' ,message: 'A solicitação de serviço foi confirmada pelo anunciante, volte ao site para confirmar os detalhes do serviço.', from_name: 'Equipe Faxilita',to_name:`${infoSolic[0].nome} ${infoSolic[0].sobrenome}`, to_email: email, reply_to: 'ovoo465@gmail.com'});

        }
        else
        {
            firebase.firestore().collection('servicos')
            .doc(id)
            .update({
                status: 'Em Aberto',
                solicitante: ''
            })
            confirmaEmail({subject: 'Serviço Recusado!',message: 'A solicitação de serviço foi rescusada pelo anunciante, volte ao site para solicitar outro serviço.', from_name: 'Equipe Faxilita',to_name:`${infoSolic[0].nome} ${infoSolic[0].sobrenome}`, to_email: email, reply_to: 'ovoo465@gmail.com'});

        }
    }
    return(
        <div>
            {status === 1 ?
            <div className='confirm'>
            <h2>Seu serviço foi solicitado!</h2>
            
                <fieldset className='fieldset_confirm'>
                <h3>Informações do solicitante:</h3>
                    <article>
                        <label>Nome:</label>
                        <span>{`${infoSolic[0].nome} ${infoSolic[0].sobrenome}`}</span>
                        <br/>
                        <br/>
                        <label>Email:</label>
                        <span>{infoSolic[0].email}</span>
                        <br/>
                        <br/>
                        <label>Telefone:</label>
                        <span>{infoSolic[0].telefone}</span>
                        <br/>
                        <br/>
                        <label>Data de Nascimento:</label>
                        <input type='date' value={infoSolic[0].dt_nasc} disabled="" onChange={(e)=>{setData(e.target.value)}}/>
                    </article>
                    <br/>
                    <br/>
                    <br/>
                    <p>Responda à solicitação abaixo se quiser continuar com esse serviço:</p>
                    <button onClick={() => {confirmaSolic('s')}}>Confirmar</button>
                    <button onClick={() => {confirmaSolic('n')}}>Recusar</button>     
                </fieldset>
                   
        </div>
            :
            <h2>Carregando</h2>
            
            }
        </div>
    )
}