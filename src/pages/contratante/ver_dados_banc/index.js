import {useEffect, useState} from 'react'
import firebase from '../../../firebaseConnection';
import './ver_dados_banc.css'

export default function DadosBanc()
{
    const [listas, setListas] = useState([]);
    const [status, setStatus] = useState(0);
    useEffect(()=>{

        firebase.firestore().collection('conta_bancaria')
        .onSnapshot((doc) =>{
            let dadosBanc = [];
            let emailServ = localStorage.getItem('emailServ')
            doc.forEach((item)=>{
                if(item.data().email === emailServ)
                {
                    dadosBanc.push({
                        numConta: item.id,
                        banco: item.data().banco,
                        agencia: item.data().agencia,
                        pix: item.data().pix
                    })
                    setListas(dadosBanc);
                    setStatus(1);
                }
            })
        })
    })

    return(
        <div className='dados_banc'>
            {status === 0?
            <div>
                <h2>Carregando</h2>
            </div>
            :
            <fieldset>
                <h3>Informações da conta bancaria:</h3>
                <article>
                    <label>Numero da Conta:</label>
                    <span>{listas[0].numConta}</span>
                    <br/>
                    <label>Agencia:</label>
                    <span>{listas[0].agencia}</span>
                    <br/>
                    <label>Banco:</label>
                    <span>{listas[0].banco}</span>
                    <br/>
                    <label>Chave PIX (se tiver):</label>
                    <span>{listas[0].pix}</span>
                    <br/>
                </article>
            </fieldset>}
        </div>
    )
}