import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import './header.css';
import firebase from '../../firebaseConnection';
import {toast} from 'react-toastify';


export default function Header()
{
    const [user, setUser] = useState(false);

    useEffect(() => {
        async function checaLogin()
        {
            await firebase.auth().onAuthStateChanged((user) => {
                if(user)
                {
                    setUser(true);
                }
                else
                {
                    toast.warning("usuario nao logado")
                    setUser(false);
                }
            });
        }

        checaLogin();
    },[])
    async function logOut()
    {
        await firebase.auth().signOut();
        localStorage.removeItem('meuEmail');
        localStorage.removeItem('tipo');
        localStorage.removeItem('EmailSolicitante');
        localStorage.removeItem('emailUserServ');
        localStorage.removeItem('emailServ');
    }

    return(
        <div>
            {!user ?
            <header>
                <Link className='logo' to='/'>Faxilita</Link>
                <Link className='login' to='/login'>Entrar</Link>
                <Link className='cadastro' to='/cadastro_usuario'>Cadastro</Link>
            </header>
            :
            <div>
                {localStorage.getItem('tipo') === 'Trabalhador' ?
                    <header>
                        <Link className='logo' to='/'>Faxilita</Link>
                        <Link className='conta' to='/minha_conta'>Minha Conta</Link>
                        <Link className='conta' to='/meus_servicos'>Meus Serviços</Link>
                        <a className='sair' href='./' onClick={logOut}>Sair</a>
                    </header>
                    :
                    <header>
                        <Link className='logo' to='/'>Faxilita</Link>
                        <Link className='conta' to='/minha_conta'>Minha Conta</Link>
                        <Link className='conta' to='/meus_servicosS'>Servicos Solicitados</Link>
                        <a className='sair' href='./' onClick={logOut}>Sair</a>
                    </header>
                }
            </div>
            }
        </div>
    )
}