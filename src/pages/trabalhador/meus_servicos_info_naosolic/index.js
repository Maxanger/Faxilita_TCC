import {useEffect, useState} from 'react';
import { useParams} from 'react-router-dom';
import { toast } from 'react-toastify';
import firebase from '../../../firebaseConnection';
import './info_naosolic.css'


export default function InfoMeuServ()
{
    const {id} = useParams();
    const [listas, setListas] = useState([]);
    const [status, setStatus] = useState(0);
    const [status1, setStatus1] = useState(0)
    const [nasc, setNasc] = useState('');


    useEffect(()=>{
        if(listas.length === 0)
        {
            firebase.firestore().collection('servicos')
            .onSnapshot((doc) => {
                let servico =[];

                doc.forEach((item) =>
                {
                    if(id === item.id && item.data().status !== 'Aguardando Confirmação')
                    {
                            servico.push({
                                valor: item.data().valor,
                                passagem: item.data().passagem_inclusa,
                                data: item.data().data,
                                rua: item.data().rua,
                                cidade: item.data().cidade,
                                bairro: item.data().bairro,
                                numero: item.data().numero,
                                complemento: item.data().complemento,
                                solicitante: item.data().solicitante,
                                status: item.data().status
                            })
                        setListas(servico);
                        setStatus(1);
                        }
                    else if (id === item.id && item.data().status === 'Aguardando Confirmação')
                    {
                            localStorage.setItem('EmailSolicitante', item.data().solicitante); 
                            setListas(servico);
                            window.location.href =`/confirm_servico/${id}`;
                    }
                    
                });
            })
        }
    },[id, listas])

    useEffect(()=>{
        
        if(listas.length !== 0)
        {
            if(listas[0].status === 'Em Andamento')
            {
                let now = new Date();
                let dataFornec = new Date(listas[0].data);
                let fullNow = `${now.getDate()} ${now.getMonth()+1} ${now.getFullYear()}`;
                let fulldataFornec = `${dataFornec.getDate()+1} ${dataFornec.getMonth()+1} ${dataFornec.getFullYear()}`;
                if(fullNow === fulldataFornec)
                {
                    setStatus1(1);
                }
            }
        }
        
    },[listas])

    function finalizaEmail(variables)
    {
        window.emailjs.send(
          'service_q78t2j6', 'template_hvfdfua',
          variables
          ).then(res => {
              toast.success('Email de finalização enviado para o solicitante serviço.');
              window.location.href ='./' ;
          })
          .catch(
              err => console.error('Algo aconteceu:', err)
              )
    }

    function FinalizaServ()
    {
        firebase.firestore().collection('servicos')
        .doc(id)
        .update({
            status: 'Finalizado'
        })

        finalizaEmail({subject: 'Serviço Finalizado!' ,message: 'O serviço foi finalizado!! Muito Obrigado por usar os serviços do Faxilita', from_name: 'Equipe Faxilita',to_name: '', to_email: listas[0].solicitante, reply_to: 'ovoo465@gmail.com'})
    }

    function EnviaEmail(variables)
    {
        window.emailjs.send(
          'service_q78t2j6', 'template_hvfdfua',
          variables
          ).then(res => {
              toast.success('Email de confirmação enviado para o solicitante serviço.');
              window.location.href ='./' ;
          })
          .catch(
              err => console.error('Algo aconteceu:', err)
              )
    }


    function CancelaServ()
    {
        firebase.firestore().collection('servicos')
        .doc(id)
        .delete()
        .then(()=>{
            toast.success('O serviço foi cancelado corretamente. Voltando à pagina inicial');
            EnviaEmail({subject: 'Serviço Cancelado!',message: 'O serviço foi cancelado pelo anunciante. Volte para o site para poder solicitar um novo serviço.', from_name: 'Equipe Faxilita',to_name:` `, to_email: listas[0].solicitante, reply_to: 'ovoo465@gmail.com'})
        })

    }
    return(
        <div className='confirm'>
            {status !== 1 ?
            <div>
                <p>Aguardando</p>
            </div>
            :
                <fieldset className='fieldset_infonaosolic'>
                    <h2>Informações do Serviço:</h2>
                    <br/>
                    <br/>
                    <br/>

                    <article>
                        <label>Valor:</label>
                        <span>{listas[0].valor}</span>
                        <br/>
                        <br/> 
                        <label>Passagem:</label>
                        <span>{listas[0].passagem}</span>
                        <br/>
                        <br/> 
                        <label>Telefone:</label>
                        <span>{listas[0].telefone}</span>
                        <br/>
                        <br/> 
                        <label>Data:</label>
                        <input type='date' value={listas[0].data} disabled="" onChange={(e)=>{setNasc(e.target.value)}}/>
                        <br/>
                        <br/>
                        <label>Endereço: </label>
                        <span>{listas[0].rua}, {listas[0].numero}, {listas[0].complemento}, {listas[0].bairro}, {listas[0].cidade}</span> 
                        <br/>
                        <br/> 
                    </article>
                        
                        {status1 === 1 ?
                        
                        <button onClick={FinalizaServ}>Finalizar Serviço</button>
                        :
                        <div>
                            {listas[0].status !== 'Finalizado' ?
                            <div>
                                <button onClick={CancelaServ}>Cancelar Serviço</button>
                                <a target="blank" href={`https://www.google.com.br/maps/place/${listas[0].rua} ${listas[0].numero} ${listas[0].complemento}, ${listas[0].bairro}, ${listas[0].cidade}`}>Ver no Mapa</a>
                            </div>:
                            <div></div>}
                        </div>}
                                          
                </fieldset>  
            }
        </div>
    )
}