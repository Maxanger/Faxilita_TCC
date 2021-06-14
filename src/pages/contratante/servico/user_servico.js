import {useEffect, useState} from 'react'
import firebase from '../../../firebaseConnection'

export default function UserServInfo()
{
    const [userInfo, setUserInfo] = useState([]);

    useEffect(() => {
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
                });
            })
    }, [])
    return(
        <div>
            {userInfo.map((lista) =>{
                return(
                    <div>
                        <article key={lista.id}>
                        <span>{lista.nome} {lista.sobrenome}</span><br/>
                        <span>{lista.telefone}</span><br/>
                        <span>{lista.id}</span>
                        </article>
                    </div>
                )
            })}
            
        </div> 
    )
}