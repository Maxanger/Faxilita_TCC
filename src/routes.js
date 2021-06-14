import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Header from './components/header';
import Home from './pages/para_todos/home';
import Login from './pages/para_todos/login';
import CadastroU from './pages/para_todos/cadastro_usuario';
import CadastroS from './pages/trabalhador/cadastro_servico';
import ListaServico from './pages/contratante/lista_servico';
import MinhaConta from './pages/para_todos/minha_conta';
import AtualizaCadastro from './pages/para_todos/atualiza_cadastro';
import Servico from './pages/contratante/servico';
import RecuperaSenha from './pages/para_todos/recupera_senha';
import MeusServicosTrab from './pages/trabalhador/meus_servicos_trab';
import MeusServicosSolic from './pages/contratante/meus_servicos_solic'
import InfoMeuServ from './pages/trabalhador/meus_servicos_info_naosolic';
import InfoMeuServConfirm from './pages/contratante/meus_servicos_info_confirm';
import ConfirmServico from './pages/trabalhador/confirm_servico';
import DadosBanc from './pages/contratante/ver_dados_banc';
const Routes = () =>
{
    return(
        <BrowserRouter>
            <Header/>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/cadastro_usuario' component={CadastroU}/>
                <Route exact path="/cadastro_servico" component={CadastroS}/>
                <Route exact path='/lista_servico' component={ListaServico}/>
                <Route exact path='/minha_conta' component={MinhaConta}/>
                <Route exact path='/atualiza_cadastro' component={AtualizaCadastro}/>
                <Route exact path='/servico/:id' component={Servico}/>
                <Route exact path='/recupera_senha' component={RecuperaSenha}/>
                <Route exact path='/meus_servicos' component={MeusServicosTrab}/>
                <Route exact path='/meus_servicosS' component={MeusServicosSolic}/>
                <Route exact path='/meus_servicos_info_naosolic/:id' component={InfoMeuServ}/>
                <Route exact path='/meus_servicos_info_confirm/:id' component={InfoMeuServConfirm}/>
                <Route exact path='/confirm_servico/:id' component={ConfirmServico}/>
                <Route exact path='/dados_banc/:id' component={DadosBanc}/>
            </Switch>
        </BrowserRouter>
    )
}

export default Routes;