import {useEffect, useState} from 'react';
import firebase from '../../../firebaseConnection'
import './lista_servico.css'

export default function ListaServico()
{
    const [listas, setListas] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [status, setStatus] = useState(0);


    useEffect(() => {
    if(tipoFiltro === 'diaSem')
    {
        setStatus(0);
        if(filtro === "")
        {
            firebase.firestore().collection('servicos')
            .onSnapshot((doc) => {
                let listaServicos =[];
                doc.forEach((item) =>
                {
                    if(item.data().status === "Em Aberto")
                        listaServicos.push({
                            id: item.id,
                            email: item.data().email,
                            valor: item.data().valor,
                            data: item.data().data,
                            sem: item.data().diaSem
                        })
                });
                setListas(listaServicos);
            });
        }
        else
        {
            firebase.firestore().collection('servicos')
            .onSnapshot((doc) => {
                let listaServicos =[];
                doc.forEach((item) =>
                {
                    if(item.data().status === "Em Aberto" && item.data().diaSem === filtro)
                        listaServicos.push({
                            id: item.id,
                            email: item.data().email,
                            valor: item.data().valor,
                            data: item.data().data,
                            sem: item.data().diaSem
                        })
                });
                setListas(listaServicos);
                return;
            });
        }
    }
    else
    {
        setStatus(1);
        if(filtro === '')
        {
        firebase.firestore().collection('servicos')
            .onSnapshot((doc) => {
                let listaServicos =[];
                doc.forEach((item) =>
                {
                    if(item.data().status === "Em Aberto")
                        listaServicos.push({
                            id: item.id,
                            email: item.data().email,
                            valor: item.data().valor,
                            data: item.data().data,
                            sem: item.data().diaSem
                        })
                });
                setListas(listaServicos);
            });
        }
        else
        {
            firebase.firestore().collection('servicos')
            .onSnapshot((doc) => {
                let listaServicos =[];
                doc.forEach((item) =>
                {
                    if(item.data().status === "Em Aberto" && item.data().data === filtro)
                        listaServicos.push({
                            id: item.id,
                            email: item.data().email,
                            valor: item.data().valor,
                            data: item.data().data,
                            sem: item.data().diaSem
                        })
                });
                setListas(listaServicos);
                return;
            });
        }
    } 
        return() => {
        }
        
    },[listas, filtro, tipoFiltro])

    return(
        <div className="lista">
            <div className="lista_servico">
                <div className='filtro'>
                    <div className='tipo_filtro' value={tipoFiltro} onChange={(e) =>{setTipoFiltro(e.target.value)}}>
                        <input type='radio' value='diaSem' name='tipoFiltro'/>Dia da Semana
                        <input type='radio' value='diaMes' name='tipoFiltro'/>Dia do Mês
                    </div>
                    {status !== 1 ?
                    <div>
                    <label>Filtro por dias da semana:</label>
                    <select value={filtro} onChange={(e) => {setFiltro(e.target.value)}}>
                            <option value="">Escolha um filtro...</option>
                            <option value="Domingo">Domingo</option>
                            <option value="Segunda">Segunda</option>
                            <option value="Terça">Terça</option>
                            <option value="Quarta">Quarta</option>
                            <option value="Quinta">Quinta</option>
                            <option value="Sexta">Sexta</option>
                            <option value="Sábado">Sabado</option>
                    </select>
                    </div>
                    :
                    <div>
                        <label>Filtro por dia do mes: </label>
                        <input type='date' value={filtro} onChange={(e)=>{setFiltro(e.target.value)}}/>
                    </div>
                    }
                </div>
            {listas.length !== 0 ?    
            <table border='1'>
                <thead>
                    <tr>
                        <th>Valor</th>
                        <th>Email:</th>
                        <th>Dia da Semana:</th>
                        <th>Data:</th>
                        <th>Mais Detalhes</th>
                    </tr>
                </thead> 
                {listas.map((lista) => {
                    return(
                        <tbody key={lista.id}>
                            <tr>
                                <td>R$: {lista.valor}</td>
                                <td>{lista.email}</td>
                                <td>{lista.sem}</td>
                                <td>{lista.data}</td> 
                                <td><a href={`/servico/${lista.id}`}>Acessar</a></td>
                            </tr>
                        </tbody>
                        
                    )
                })}
            </table>
            :
            <div>
                <h2>Não há resultados para a pesquisa</h2>
            </div>
            }
            </div>
        </div>
    )
}