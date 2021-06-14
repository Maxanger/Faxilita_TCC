import {useEffect, useState} from 'react';
import firebase from '../../../firebaseConnection';
import {toast} from 'react-toastify';
import './cadastro_servico.css'


export default function CadastroS()
{   
    const [valor, setValor] = useState('');
    const [passagem, setPassagem] = useState('');
    const [data, setData] = useState('');;
    const [sem, setSem] = useState('');

    useEffect(()=>{
        let dayName = new Array("Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado");
        let semana = new Date(data);
        if(semana.getDay() === 6)
        {
                setSem(dayName[semana.getDay()-6]);
        }
        else
        {
                
                setSem(dayName[semana.getDay()+1]);
        }

    }, [data])

    async function cadastraServico()
    {
        let dtFornec = new Date(data);
        let dtAtual = new Date();
        if(valor.length === 0 || passagem.length === 0)
        {
            toast.warning('Há campos em branco')
        }
        else
        {
            if(dtAtual.getFullYear() === dtFornec.getFullYear())
            {
                if(dtAtual.getMonth()+1 === dtFornec.getMonth()+1)
                {
                    if(dtAtual.getDate() < dtFornec.getDate()+1)
                    {
                    await firebase.firestore().collection('servicos')
                    .doc()
                    .set(
                        {
                            data: data,
                            diaSem: sem,
                            email: localStorage.getItem('meuEmail'),
                            passagem_inclusa: passagem,
                            valor: valor,
                            rua: '',
                            cidade: '',
                            bairro: '',
                            numero: '',
                            complemento: '',
                            status: 'Em Aberto',
                            solicitante: '',
                            horario: ''
                        }
                        )
                        .then(()=>{
                            toast.success("Concluido");
                            setData('');
                            setValor('');
                            setPassagem('');
                            setSem('');
                            setPassagem('');
                        })
                        .catch((error) => {
                            toast.error(`Erro: ${error}`);
                        })
                    }else{toast.warning('Digite uma data válida para o serviço.')}
                }
                else if(dtAtual.getMonth() < dtFornec.getMonth())
                {
                    await firebase.firestore().collection('servicos')
                    .doc()
                    .set(
                        {
                            data: data,
                            diaSem: sem,
                            email: localStorage.getItem('meuEmail'),
                            passagem_inclusa: passagem,
                            valor: valor,
                            rua: '',
                            cidade: '',
                            bairro: '',
                            numero: '',
                            complemento: '',
                            status: 'Em Aberto',
                            solicitante: '',
                            horario: ''
                        }
                        )
                        .then(()=>{
                            toast.success("Concluido");
                            setData('');
                            setValor('');
                            setPassagem('');
                            setSem('');
                            setPassagem('');        
                        })
                        .catch((error) => {
                            toast.error(`Erro: ${error}`);
                        })
                }
                else{toast.warning('Digite uma data válida para o serviço.')}
            }
            else if(dtAtual.getFullYear() < dtFornec.getFullYear())
            {
                await firebase.firestore().collection('servicos')
                    .doc()
                    .set(
                        {
                            data: data,
                            diaSem: sem,
                            email: localStorage.getItem('meuEmail'),
                            passagem_inclusa: passagem,
                            valor: valor,
                            rua: '',
                            cidade: '',
                            bairro: '',
                            numero: '',
                            complemento: '',
                            status: 'Em Aberto',
                            solicitante: '',
                            horario: ''
                        }
                        )
                        .then(()=>{
                            toast.success("Concluido");
                            setData('');
                            setValor('');
                            setPassagem('');
                            setSem('');
                            setPassagem('');
                        })
                        .catch((error) => {
                            toast.error(`Erro: ${error}`);
                        })
            }
            else{
                toast.warning('Digite uma data válida para o serviço.');
            }
        }
    
    }

    return(
            <div className="form_servico">
            <fieldset className='fieldset_servico'>
                <h2>Cadastro de Servico:</h2>
                <label>Valor:</label>
                <input type='number' value={valor} onChange={(e) => {setValor(e.target.value)}}/>
                <br/>
                <label>Passagem Inclusa:</label>
                <div value={passagem} onChange={(e) => {setPassagem(e.target.value)}}>
                    <input type="radio" value="Sim" name='passagem'/>Sim
                    <input type="radio" value="Não" name='passagem'/>Nao
                </div>
                <br/>
                <label>Data:</label>
                <input type="date" value={data} onChange={(e) => {setData(e.target.value)}}/>
                <br/>
                <label>Dia da Semana: </label> <p>{sem}</p>
                <br/>
                <button onClick={cadastraServico}>Cadastrar</button>
            </fieldset>
            </div>   
    )
}