import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoCadastrarMúsico, serviçoAtualizarMúsico, serviçoBuscarMúsico } from "../../serviços/serviços-músico";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios } from "../../utilitários/validações";
import { estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider, estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputText, estilizarLabel } from "../../utilitários/estilos";

export default function CadastrarMúsico() {
  const referênciaToast = useRef(null);
  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({ instrumentoPrincipal: "", nívelExperiência: "" });
  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);
  const navegar = useNavigate();

  const opçõesNível = [
    { label: "Iniciante", value: "iniciante" },
    { label: "Intermediário", value: "intermediário" },
    { label: "Avançado", value: "avançado" },
    { label: "Profissional", value: "profissional" }
  ];

  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    const valor = event.target.value;
    setDados({ ...dados, [chave]: valor });
  };

  function validarCampos() {
    let errosCamposObrigatórios = validarCamposObrigatórios(dados);
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  };

  function títuloFormulário() {
    if (usuárioLogado?.cadastrado) return "Alterar Músico";
    else return "Cadastrar Músico";
  };

  async function cadastrarMúsico() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarMúsico({ ...dados, usuário_info: usuárioLogado,
          instrumentoPrincipal: dados.instrumentoPrincipal, nívelExperiência: dados.nívelExperiência });
        if (response.data)
          setUsuárioLogado(usuário => ({ ...usuário, status: response.data.status, token: response.data.token }));
        mostrarToast(referênciaToast, "Músico cadastrado com sucesso!", "sucesso");
      } catch (error) {
        setCpfExistente(true);
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  };

  async function atualizarMúsico() {
    if (validarCampos()) {
      try {
        const response = await serviçoAtualizarMúsico({ ...dados, cpf: usuárioLogado.cpf });
        if (response) mostrarToast(referênciaToast, "Músico atualizado com sucesso!", "sucesso");
      } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
    }
  };

  function labelBotãoSalvar() {
    if (usuárioLogado?.cadastrado) return "Alterar";
    else return "Cadastrar";
  };

  function açãoBotãoSalvar() {
    if (usuárioLogado?.cadastrado) atualizarMúsico();
    else cadastrarMúsico();
  };

  function redirecionar() {
    if (cpfExistente) {
      setUsuárioLogado(null);
      navegar("/criar-usuario");
    } else {
      setUsuárioLogado(usuárioLogado => ({ ...usuárioLogado, cadastrado: true }));
      navegar("/pagina-inicial");
    }
  };

  useEffect(() => {
    let desmontado = false;
    async function buscarDadosMúsico() {
      try {
        const response = await serviçoBuscarMúsico(usuárioLogado.cpf);
        if (!desmontado && response.data) {
          setDados(dados => ({ ...dados, instrumentoPrincipal: response.data.instrumentoPrincipal,
            nívelExperiência: response.data.nívelExperiência }));
        }
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "erro");
      }
    }
    if (usuárioLogado?.cadastrado) buscarDadosMúsico();
    return () => { desmontado = true; };
  }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} onHide={redirecionar} position="bottom-center" />
      <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Instrumento Principal*:</label>
          <InputText name="instrumentoPrincipal" value={dados.instrumentoPrincipal} onChange={alterarEstado} className={estilizarInputText(erros.instrumentoPrincipal, 400, usuárioLogado.cor_tema)} />
          <MostrarMensagemErro mensagem={erros.instrumentoPrincipal} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Nível de Experiência*:</label>
          <Dropdown name="nívelExperiência" className={estilizarDropdown(erros.nívelExperiência, usuárioLogado.cor_tema)} value={dados.nívelExperiência} options={opçõesNível} onChange={alterarEstado} placeholder="-- Selecione --" />
          <MostrarMensagemErro mensagem={erros.nívelExperiência} />
        </div>
        <Divider className={estilizarDivider(dados.cor_tema)} />
        <div className={estilizarInlineFlex()}>
          <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={redirecionar} />
          <Button className={estilizarBotão()} label={labelBotãoSalvar()} onClick={açãoBotãoSalvar} />
        </div>
      </Card>
    </div>
  );
};