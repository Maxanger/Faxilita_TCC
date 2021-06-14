import {useState} from 'react';
import {toast} from 'react-toastify'
import firebase from '../../../firebaseConnection';
import './recuper.css'

export default function RecuperaSenha()
{
    const [email, setEmail] = useState('');

    async function recuperaSenha()
        {
            await firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                toast.success('Email de recuperação de senha enviado!')
            })
            .catch((error) => {
                toast.error(`Algo deu errado: ${error}`);
            })
        }
    return(
        <div className='recupera_senha'>
            <label>Digite o seu email para recuperar a sua senha: </label>
            <input name='email' value={email} onChange={(e) =>{setEmail(e.target.value)}}/>
            <button name='reseta' onClick={recuperaSenha}>Recuperar</button>
        </div>
    )
}