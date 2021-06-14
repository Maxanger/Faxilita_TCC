import {useState} from 'react';
import firebase from '../../../firebaseConnection'
import {toast} from 'react-toastify';
import "./login.css"
import {Link} from 'react-router-dom';


export default function Login()
{
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    async function logIn()
    {
        let status = false;
 
        async function pegaTipo()
        {
            firebase.firestore().collection('usuarios')
            .onSnapshot((doc) => {
                let tipoUsuario;
                let email = localStorage.getItem('meuEmail')    
                doc.forEach((item) => {
                    if(item.id === email)
                    {
                        tipoUsuario = item.data().tp_usuario;
                        localStorage.setItem('tipo', `${tipoUsuario}`);
                        console.log(localStorage.getItem('tipo'));
                        status = true;
                        if(status === true)
                        {window.location.href="./"}   
                    }
                });                
            })
        }

        async function loga()
        {
            await firebase.auth().signInWithEmailAndPassword(email, senha)
            .then(() =>
            {
                localStorage.setItem('meuEmail', `${email}`);
                pegaTipo();
                console.log(status);
                toast.success("Login Bem Sucedido");
                
            })
            .catch(()=>{
                toast.error("Login Mal Sucedido, tente novamente")
            })  
        }

        loga();
        
    }

    async function logOut()
    {
        await firebase.auth().signOut();
        localStorage.setItem('tipo', '')
    }

    return(
        <div className="form_login">
            <label>Email:</label>
            <input type="text" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
            <label>Senha:</label>
            <input type="password" value={senha} onChange={(e) => {setSenha(e.target.value)}}/>
            <button className="log1" onClick={logIn}>Login</button>
            <button className="log2" onClick={logOut}>Sair</button>
            <Link to={'/recupera_senha'}>Recuperar Senha</Link>  
        </div>
    )
}
