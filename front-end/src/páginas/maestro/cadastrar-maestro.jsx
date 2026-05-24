import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoCadastrarMaestro, serviçoAtualizarMaestro, serviçoBuscarMaestro } from "../../serviços/serviços-maestro";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios } from "../../utilitários/validações";
import { estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider, 
  estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputNumber, estilizarLabel } from "../../utilitários/estilos";

export default function CadastrarMaestro() {

  const referênciaToast = useRef(null);
  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({ estiloRegência: "", anosExperiência: "" });
  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);
  const navegar = useNavigate();

  const opçõesEstiloRegência = [
    { label: "Clássico", value: "clássico" },
    { label: "Sinfônico", value: "sinfônico" },
    { label: "Popular", value: "popular" },
    { label: "Contemporâneo", value: "contemporâneo" }
  ];

  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    const valor = event.target.value;
    setDados({ ...dados, [chave]: valor });
  };

  function validarCampos() {
    let errosCamposObrigatórios;
    errosCamposObrigatórios = validarCamposObrigatórios(dados);
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  };

  function títuloFormulário() {
    if (usuárioLogado?.cadastrado) return "Alterar Maestro";
    else return "Cadastrar Maestro";
  };

  async function cadastrarMaestro() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarMaestro({ ...dados, usuário_info: usuárioLogado,
          estiloRegência: dados.estiloRegência,
          anosExperiência: dados.anosExperiência });
        if (response.data)
          setUsuárioLogado(usuário => ({ ...usuário, status: response.data.status,
            token: response.data.token }));
        mostrarToast(referênciaToast, "Maestro cadastrado com sucesso!", "sucesso");
      } catch (error) {
        setCpfExistente(true);
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  };

  async function atualizarMaestro() {
    if (validarCampos()) {
      try {
        const response = await serviçoAtualizarMaestro({ ...dados, cpf: usuárioLogado.cpf });
        if (response) mostrarToast(referênciaToast, "Maestro atualizado com sucesso!", "sucesso");
      } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
    }
  };

  function labelBotãoSalvar() {
    if (usuárioLogado?.cadastrado) return "Alterar";
    else return "Cadastrar";
  };

  function açãoBotãoSalvar() {
    if (usuárioLogado?.cadastrado) atualizarMaestro();
    else cadastrarMaestro();
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
    async function buscarDadosMaestro() {
      try {
        const response = await serviçoBuscarMaestro(usuárioLogado.cpf);
        if (!desmontado && response.data) {
          setDados(dados => ({ ...dados, estiloRegência: response.data.estiloRegência,
            anosExperiência: response.data.anosExperiência }));
        }
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "erro");
      }
    }
    if (usuárioLogado?.cadastrado) buscarDadosMaestro();
    return () => desmontado = true;
  }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} onHide={redirecionar} position="bottom-center" />
      <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Estilo de Regência*:</label>
          <Dropdown name="estiloRegência"
            className={estilizarDropdown(erros.estiloRegência, usuárioLogado.cor_tema)}
            value={dados.estiloRegência} options={opçõesEstiloRegência} onChange={alterarEstado}
            placeholder="-- Selecione --" />
          <MostrarMensagemErro mensagem={erros.estiloRegência} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Anos de Experiência*: </label>
          <InputNumber name="anosExperiência" size={5}
            value={dados.anosExperiência}
            onValueChange={alterarEstado} mode="decimal"
            inputClassName={estilizarInputNumber(erros.anosExperiência,
              usuárioLogado.cor_tema)} />
          <MostrarMensagemErro mensagem={erros.anosExperiência} />
        </div>
        <Divider className={estilizarDivider(usuárioLogado.cor_tema)} />
        <div className={estilizarInlineFlex()}>
          <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={redirecionar} />
          <Button className={estilizarBotão()} label={labelBotãoSalvar()} onClick={açãoBotãoSalvar} />
        </div>
      </Card>
    </div>
  );
};