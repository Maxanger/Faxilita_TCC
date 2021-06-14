import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import firebase from '../../../firebaseConnection';
import './home.css';

export default function Home()
{
    const [user, setUser] = useState();
    useEffect(() => {
            firebase.auth().onAuthStateChanged((user) => {
                if(user)
                {
                    setUser(true);
                }
                else
                {
                    setUser(false);
                }
            });
        return () =>{
        }
    }, []);

    useEffect(()=>{
        
    },[])

    return(
        <div>
            {!user ?
                <div className="home">
                <h2>Seja bem-vindo ao Faxilita</h2>
                <h1>Use nosso serviço de anuncio e solicitação de serviços domésticos totalmente gratuito!!!</h1>
                    {/* <Link to="/sobre">Sobre Nós</Link> */}
                </div>
            :
                
                <div>
                    {localStorage.getItem('tipo') === 'Trabalhador' ?
                    <div className="home">
                        <Link className="cadastro_servico" to="/cadastro_servico">Cadastrar Serviços</Link>
                        <Link to="/atualiza_cadastro">Atualizar Informações</Link>
                    </div>
                    :
                    <div className="home">
                        <Link to="/lista_servico">Lista de Serviços</Link>
                        <Link to="/atualiza_cadastro">Atualizar Informações</Link>
                    </div>
                    }
                </div>
            }   
        </div>
    )
}