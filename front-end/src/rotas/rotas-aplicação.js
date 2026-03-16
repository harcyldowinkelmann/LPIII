import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import PáginaInicial from "../páginas/usuário/página-inicial";
import CadastrarMaestro from "../páginas/maestro/cadastrar-maestro";
import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
import CadastrarMúsico from "../páginas/músico/cadastrar-músico";

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
          <Route element={<CadastrarMaestro/>} path="cadastrar-maestro"/>
          <Route element={<CadastrarMúsico/>} path="cadastrar-músico"/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};