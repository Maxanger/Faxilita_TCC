import {useEffect, useState} from 'react';
import firebase from '../../../firebaseConnection';
import './meu_servico.css'

export default function MeusServicosSolic()
{
    const [statusServ, setStatusServ] = useState('');
    const [listas, setListas] = useState([]);

    useEffect(() => {  
        if(statusServ === '')
        {
            firebase.firestore().collection('servicos')
            .onSnapshot((doc) => {
                let listaServicos =[];
                let meuEmail = localStorage.getItem('meuEmail');

                //percorrendo a lista do banco e preenchendo o array
                doc.forEach((item) =>
                {
                    if(item.data().solicitante === meuEmail)
                        listaServicos.push({
                            id: item.id,
                            email: item.data().email,
                            valor: item.data().valor,
                            rua: item.data().rua,
                            cidade: item.data().cidade,
                            status: item.data().status
                        })
                    
                });
                setListas(listaServicos);
                return;
            })
        }
        else
        {
            firebase.firestore().collection('servicos')
            .onSnapshot((doc) => {
                let listaServicos =[];
                let meuEmail = localStorage.getItem('meuEmail');

                //percorrendo a lista do banco e preenchendo o array
                doc.forEach((item) =>
                {
                    if(item.data().solicitante === meuEmail && item.data().status === statusServ)
                        listaServicos.push({
                            id: item.id,
                            email: item.data().email,
                            valor: item.data().valor,
                            rua: item.data().rua,
                            cidade: item.data().cidade,
                            status: item.data().status
                        })
                    
                });
                setListas(listaServicos);
                return;
            })
        }
        return() => {
        }
        
    }, [statusServ])

    return(
        <div className='lista'>
            <div className='filtro'>
                <label>Filtro de status:</label>
                <select value={statusServ} onChange={(e) => {setStatusServ(e.target.value)}}>
                        <option value="">Escolha um filtro...</option>
                        <option value="Em Aberto">Em Aberto</option>
                        <option value="Confirmado">Confirmado</option>
                        <option value="Aguardando Confirmação"> Aguardando Confirmção</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Finalizado">Finalizado</option>
                </select>
            </div>
            {listas.length !== 0 ?
            <div>
            <table border = '1'>
                <thead>
                    <tr>
                        <th>Valor</th>
                        <th>Rua</th>
                        <th>Cidade</th>
                        <th>Status</th>
                        <th>Acessar</th>
                    </tr>
                </thead>
                   
                {listas.map((lista) => {
                        return(
                                <tbody key={lista.id}>
                                    <tr>
                                        <td>R$: {lista.valor}</td>
                                        <td>{lista.rua}</td>
                                        <td>{lista.cidade}</td>
                                        <td>{lista.status}</td> 
                                        <td><a href={`/meus_servicos_info_confirm/${lista.id}`}>Acessar</a></td>
                                    </tr>
                                </tbody>  
                        )
                })}  
                </table>
                </div>
                :
                <div>
                    <h2>Não há resultados para essa pesquisa!</h2>
                </div>
                }
        </div>
    )
}