import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import firebase from '../../../firebaseConnection';
import './meu_servico_info.css'
import { toast } from 'react-toastify';
import { horarioMask } from '../../js_mask/mask'



export default function InfoMeuServConfirm()
{
    const {id} = useParams();
    const [listas, setListas] = useState([]);
    const [status, setStatus] = useState(0);
    const [status2, setStatus2] = useState(0);
    const [nasc, setNasc] = useState('');

    //DADOS ATUALIZAÇÃO
    const [rua, setRua] = useState(''); 
    const [numero, setNumero] = useState('');
    const [complem, setComplem] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [horario, setHorario] = useState('');
    const [metPag, setMetPag] = useState('');

    useEffect(()=>{
            firebase.firestore().collection('servicos')
            .onSnapshot((doc) => {
                let servico =[];

                doc.forEach((item) =>
                {
                    if(id === item.id && item.data().status !== 'Confirmado')
                    {
                            servico.push({
                                email: item.data().email,
                                valor: item.data().valor,
                                passagem: item.data().passagem_inclusa,
                                data: item.data().data,
                                rua: item.data().rua,
                                cidade: item.data().cidade,
                                bairro: item.data().bairro,
                                numero: item.data().numero,
                                complemento: item.data().complemento,
                                metodoPag: item.data().metodoPag
                            })
                        
                        setListas(servico);
                        setStatus(1);
                        setStatus2(0)
                    }
                    else if (id === item.id && item.data().status === 'Confirmado')
                    {
                        servico.push({
                            email: item.data().email
                        })
                            setListas(servico)
                            setStatus2(1);
                            setStatus(1);
                            return;
                    }
                    
                });
            })
        
    },[id, listas])

    function EnviaEmail(variables)
    {
        window.emailjs.send(
          'service_q78t2j6', 'template_hvfdfua',
          variables
          ).then(res => {
              toast.success('Email de confirmação enviado para o solicitante serviço.');
              window.location.reload();
          })
          .catch(
              err => console.error('Algo aconteceu:', err)
              )
    }

    function EnviaDados()
    {
        firebase.firestore().collection('servicos')
        .doc(id)
        .update({
            rua: rua,
            numero: numero,
            complemento: complem,
            bairro: bairro,
            cidade: cidade,
            horario: horario,
            status: 'Em Andamento',
            metodoPag: metPag
        })
        .then(()=>{
            EnviaEmail({subject: 'Informações do serviço atualizadas!',
            message: `Os dados do serviço foram atualizados! Será no endereço ${rua} ${numero} ${complem}, ${bairro}, ${cidade}. Às ${horario}!`, 
            from_name: 'Equipe Faxilita',to_name:` `, to_email: listas[0].email, reply_to: 'ovoo465@gmail.com'});
        })
        
    }

    function CancelaSolic()
    {
        firebase.firestore().collection('servicos')
        .doc(id)
        .update({
            rua:'',
            numero:'',
            complemento:'',
            bairro:'',
            cidade:'',
            horario:'',
            status:'Em Aberto',
            solicitante:'',
            metodoPag: ''
        })
        EnviaEmail({subject: 'Serviço Cancelado!',
        message: 'O serviço foi cancelado pelo solicitante. O serviço voltará ao status em aberto e outras pessoas poderão aceitá-lo.', 
        from_name: 'Equipe Faxilita',to_name:` `, to_email: listas[0].email, reply_to: 'faxilita@gmail.com'});
    }

    function DadosBanc()
    {
        localStorage.setItem('emailServ', listas[0].email);
        window.location.href = `/dados_banc/${id}`;
    }

    function handleChangeHorario(e)
    {
        setHorario(horarioMask(e.target.value));
    }

    return(
        <div>
            {status !== 1 ?
            <div className="lista">
                <p>Aguardando</p>
                <p>{nasc}</p>
            </div>
            :
            <div>
                {status2 === 1  ?
                <div className='lista_ace'>
                    <fieldset className='fieldset_confirm'>
                        <article>
                            <h2>Insira as informações para completar a solicitação:</h2>
                            <label>Rua: </label>
                            <input type='text' value={rua} onChange={(e)=>{setRua(e.target.value)}}/>
                            <br/>
                            <br/>
                            <label>Numero: </label>
                            <input type='text' value={numero} onChange={(e)=>{setNumero(e.target.value)}}/>
                            <br/>
                            <br/>
                            <label>Complemento: </label>
                            <input type='text' value={complem} onChange={(e)=>{setComplem(e.target.value)}}/>
                            <br/>
                            <br/>
                            <label>Bairro: </label>
                            <input type='text' value={bairro} onChange={(e)=>{setBairro(e.target.value)}}/>
                            <br/>
                            <br/>
                            <label>Cidade: </label>
                            <input type='text' value={cidade} onChange={(e)=>{setCidade(e.target.value)}}/>
                            <br/>
                            <br/>
                            <label>Horario Desejado: </label>
                            <input type='text' value={horario} onChange={(e)=>{handleChangeHorario(e)}}/>
                            <br/>
                            <br/>
                            <label>Método de Pagamento: </label>
                            <div value={metPag} onChange={(e)=>{setMetPag(e.target.value)}}>
                                <input type='radio' value='Dinheiro' name='metPag'/>Dinheiro
                                <input type='radio' value='Transferencia' name='metPag'/>Transferencia
                            </div>
                            <button onClick={EnviaDados}>Enviar Informações</button>
                        </article>
                    </fieldset>
                </div>
                :
                <div className='lista_ace'>
                <fieldset className='fieldset_infoconfirm'>
                    <article>
                        <h3>Informações do Serviço:</h3>
                        <label>Valor: </label>
                        <span>{listas[0].valor}</span>
                        <br/>
                        <label>Passagem: </label>
                        <span>{listas[0].passagem}</span>
                        <br/>
                        <label>Data: </label>
                        <input type='date' value={listas[0].data} disabled="" onChange={(e)=>{setNasc(e.target.value)}}/>
                        <br/>
                        <label>Endereço: </label>
                        <span>{listas[0].rua}, {listas[0].numero}, {listas[0].complemento}, {listas[0].bairro}, {listas[0].cidade}</span> 
                        <br/>
                        <label>Metodo de Pagamento: </label>
                        <span>{listas[0].metodoPag}</span>

                        <h3>Contato do Contratante:</h3>
                        <label>Email: </label>
                        <span>{listas[0].email}</span>
                        <br/>
                        <br/>
                        <br/>
                        <a target="blank" href={`https://www.google.com.br/maps/place/${listas[0].rua} ${listas[0].numero} ${listas[0].complemento}, ${listas[0].bairro}, ${listas[0].cidade}`}>Ver no Mapa</a>
                        <br/>
                        <button onClick={CancelaSolic}>Cancelar Solicitação</button>
                        <button onClick={DadosBanc}>Ver Dados Bancários</button>
                    </article>
                </fieldset>
                </div>
                }  
            </div>  
            }
        </div>
    )
}