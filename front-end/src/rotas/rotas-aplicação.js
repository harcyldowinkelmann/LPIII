import { Route, BrowserRouter, Routes } from "react-router-dom";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import PáginaInicial from "../páginas/usuário/página-inicial";
import { ProvedorMaestro } from "../contextos/contexto-maestro";
import { ProvedorMúsico } from "../contextos/contexto-músico";
import RotasMaestro from "./rotas-maestro";
import RotasMúsico from "./rotas-músico";
import CadastrarMaestro from "../páginas/maestro/cadastrar-maestro";
import AdministrarAvaliacoes from "../páginas/maestro/administrar-avaliações";
import CadastrarAvaliacao from "../páginas/maestro/cadastrar-avaliação";
import PesquisarAudicoes from "../páginas/maestro/pesquisar-audições";
import ConsultarAudicao from "../páginas/maestro/consultar-audição";
import CadastrarMúsico from "../páginas/músico/cadastrar-músico";
import AdministrarAudicoes from "../páginas/músico/administrar-audições";
import CadastrarAudicao from "../páginas/músico/cadastrar-audição";
import ConsultarMusico from "../páginas/maestro/consultar-músico";
import PesquisarAvaliacoes from "../páginas/músico/pesquisar-avaliações";
import ConsultarAvaliacao from "../páginas/músico/consultar-avaliação";
import ConsultarMaestro from "../páginas/músico/consultar-maestro";

export default function RotasAplicação() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LogarUsuário/>} path="/"/>
        <Route element={<CadastrarUsuário/>} path="criar-usuario"/>
        <Route element={<RecuperarAcesso/>} path="recuperar-acesso"/>
        
        <Route element={<RotasUsuárioLogado/>}>
          <Route element={<PáginaInicial/>} path="pagina-inicial"/>
          <Route element={<CadastrarUsuário/>} path="atualizar-usuario"/>
          
          <Route element={<ProvedorMaestro><RotasMaestro/></ProvedorMaestro>}>
            <Route element={<CadastrarMaestro/>} path="cadastrar-maestro"/>
            <Route element={<AdministrarAvaliacoes/>} path="administrar-avaliações"/>
            <Route element={<CadastrarAvaliacao/>} path="cadastrar-avaliação"/>
            <Route element={<PesquisarAudicoes/>} path="pesquisar-audições"/>
            <Route element={<ConsultarAudicao/>} path="consultar-audição"/>
            <Route element={<ConsultarMusico/>} path="consultar-músico"/>
          </Route>

          <Route element={<ProvedorMúsico><RotasMúsico/></ProvedorMúsico>}>
            <Route element={<CadastrarMúsico/>} path="cadastrar-musico"/>
            <Route element={<AdministrarAudicoes/>} path="administrar-audições"/>
            <Route element={<CadastrarAudicao/>} path="cadastrar-audição"/>
            <Route element={<PesquisarAvaliacoes/>} path="pesquisar-avaliações"/>
            <Route element={<ConsultarAvaliacao/>} path="consultar-avaliação"/>
            <Route element={<ConsultarMaestro/>} path="consultar-maestro"/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}