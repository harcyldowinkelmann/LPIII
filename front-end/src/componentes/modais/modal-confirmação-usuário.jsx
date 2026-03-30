import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import ContextoUsuário from "../../contextos/contexto-usuário";
import { estilizarBotão, estilizarBotãoRemover, estilizarDivCampo, estilizarInlineFlex, 
  estilizarLabel, estilizarModal } from "../../utilitários/estilos";
import { serviçoAlterarUsuário, serviçoRemoverUsuário } from "../../serviços/serviços-usuário";
import mostrarToast from "../../utilitários/mostrar-toast";

export default function ModalConfirmaçãoUsuário() {
  const referênciaToast = useRef(null);
  const { usuárioLogado, setUsuárioLogado, confirmaçãoUsuário, setConfirmaçãoUsuário, setMostrarModalConfirmação } = useContext(ContextoUsuário);
  
  const dados = { 
    cpf: confirmaçãoUsuário?.cpf, 
    perfil: confirmaçãoUsuário?.perfil,
    nome: confirmaçãoUsuário?.nome, 
    senha: confirmaçãoUsuário?.senha,
    email: confirmaçãoUsuário?.email, 
    questão: confirmaçãoUsuário?.questão,
    resposta: confirmaçãoUsuário?.resposta, 
    cor_tema: confirmaçãoUsuário?.cor_tema 
  };
  
  const [redirecionar, setRedirecionar] = useState(false);
  const navegar = useNavigate();

  function labelOperação() {
    switch (confirmaçãoUsuário?.operação) {
      case "salvar": return "Salvar";
      case "alterar": return "Alterar";
      case "remover": return "Remover";
      default: return;
    }
  };

  function exibirPerfilFormatado() {
    switch (dados.perfil) {
      case "maestro": return "Maestro";
      case "musico": return "Músico";
      default: return "";
    }
  };

  function fecharToast() {
    if (redirecionar) {
      setMostrarModalConfirmação(false);
      setConfirmaçãoUsuário({});
      
      if (confirmaçãoUsuário.operação === "remover") {
        setUsuárioLogado({});
        navegar("/");
      } else if (confirmaçãoUsuário.operação === "alterar") {
        navegar("/pagina-inicial");
      }
    }
  };

  function finalizarCadastro() {
    if (dados.perfil === "maestro") {
      setUsuárioLogado({ ...dados, cadastrado: false });
      setMostrarModalConfirmação(false);
      navegar("/cadastrar-maestro");
    } else if (dados.perfil === "musico") {
      setUsuárioLogado({ ...dados, cadastrado: false });
      setMostrarModalConfirmação(false);
      navegar("/cadastrar-musico");
    }
  };

  async function alterarUsuário(dadosAlterados) {
    try {
      const response = await serviçoAlterarUsuário({ ...dadosAlterados, cpf: usuárioLogado.cpf });
      setUsuárioLogado({...usuárioLogado, ...response.data });
      setRedirecionar(true);
      mostrarToast(referênciaToast, "Alterado com sucesso! Redirecionando à Página Inicial...", 
         "sucesso");
    } catch (error) { 
      mostrarToast(referênciaToast, error.response.data.erro, "erro"); 
    }
  };

  async function removerUsuário() {
    try {
      await serviçoRemoverUsuário(usuárioLogado.cpf);
      setRedirecionar(true);
      mostrarToast(referênciaToast, "Removido com sucesso! Redirecionando ao Login.", "sucesso");
    } catch (error) { 
      mostrarToast(referênciaToast, error.response.data.erro, "erro"); 
    }
  };

  function executarOperação() {
    switch (confirmaçãoUsuário.operação) {
      case "salvar":
        finalizarCadastro();
        break;
      case "alterar":
        alterarUsuário({ email: dados.email, senha: dados.senha, questão: dados.questão,
          resposta: dados.resposta, cor_tema: dados.cor_tema });
        break;
      case "remover":
        removerUsuário();
        break;
      default: break;
    }
  };

  function ocultar() {
    if (!redirecionar) {
      setConfirmaçãoUsuário({});
      setMostrarModalConfirmação(false);
    }
  };

  return (
    <>
      <div className={estilizarModal()}>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel()}>Tipo de Perfil:</label>
          {exibirPerfilFormatado()}
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel()}>CPF -- nome de usuário:</label>
          {dados.cpf}
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel()}>Nome Completo:</label>
          {dados.nome}
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel()}>Email:</label>
          {dados.email}
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel()}>Questão de Segurança:</label>
          {dados.questão}
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel()}>Resposta:</label>
          {dados.resposta}
        </div>
        <div className={estilizarInlineFlex()}>
          <Button label={labelOperação()} onClick={executarOperação} className={confirmaçãoUsuário.operação === 'remover' ? estilizarBotãoRemover(dados.cor_tema) : estilizarBotão(dados.cor_tema)} />
          <Button label="Cancelar" onClick={ocultar} className={estilizarBotão(dados.cor_tema)} />
        </div>
      </div>
      <Toast ref={referênciaToast} onHide={fecharToast} />
    </>
  );
};