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
import AdministrarAudicoes from "../páginas/maestro/administrar-audições";
import CadastrarAudicao from "../páginas/maestro/cadastrar-audição";

import CadastrarMúsico from "../páginas/músico/cadastrar-músico";
import AdministrarAvaliacoes from "../páginas/músico/administrar-avaliações";
import CadastrarAvaliacao from "../páginas/músico/cadastrar-avaliação";
import PesquisarAudicoes from "../páginas/músico/pesquisar-audições";
import ConsultarAudicao from "../páginas/músico/consultar-audição";

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
            <Route element={<AdministrarAudicoes/>} path="administrar-audições"/>
            <Route element={<CadastrarAudicao/>} path="cadastrar-audição"/>
          </Route>

          <Route element={<ProvedorMúsico><RotasMúsico/></ProvedorMúsico>}>
            <Route element={<CadastrarMúsico/>} path="cadastrar-musico"/>
            <Route element={<AdministrarAvaliacoes/>} path="administrar-avaliações"/>
            <Route element={<CadastrarAvaliacao/>} path="cadastrar-avaliação"/>
            <Route element={<PesquisarAudicoes/>} path="pesquisar-audições"/>
            <Route element={<ConsultarAudicao/>} path="consultar-audição"/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}