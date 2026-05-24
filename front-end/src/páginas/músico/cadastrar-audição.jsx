import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoMúsico from "../../contextos/contexto-músico";
import { serviçoAlterarAudicao, serviçoCadastrarAudicao, serviçoRemoverAudicao, serviçoBuscarNaipesAudicoes } from "../../serviços/serviços-músico";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios } from "../../utilitários/validações";
import { estilizarBotão, estilizarBotãoRemover, estilizarBotãoRetornar, estilizarCard, estilizarCheckbox, estilizarDivCampo, estilizarDivider, estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputText, estilizarInputTextarea, estilizarLabel } from "../../utilitários/estilos";

export default function CadastrarAudicao() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { audicaoConsultada } = useContext(ContextoMúsico);
    const [dados, setDados] = useState({ 
        título: audicaoConsultada?.título || "",
        tipo: audicaoConsultada?.tipo || "",
        naipe: audicaoConsultada?.naipe || "",
        data_audicao: audicaoConsultada?.data_audicao || "",
        descrição: audicaoConsultada?.descrição || "",
        remunerada: audicaoConsultada?.remunerada || false,
        status: audicaoConsultada?.status || "" 
    });
    const [listaNaipes, setListaNaipes] = useState([]);
    const [erros, setErros] = useState({});
    const navegar = useNavigate();

    const opçõesTipo = [
        { label: "Orquestra", value: "orquestra" },
        { label: "Câmara", value: "câmara" },
        { label: "Banda", value: "banda" },
        { label: "Solo", value: "solo" }
    ];

    const opçõesStatus = [
        { label: "Aberta", value: "aberta" },
        { label: "Em andamento", value: "em andamento" },
        { label: "Finalizada", value: "finalizada" }
    ];

    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        let valor = event.target.value ?? event.checked;
        setDados({ ...dados, [chave]: valor });
    }

    function validarCampos() {
        const { título, tipo, naipe, data_audicao, descrição } = dados;
        let errosCamposObrigatórios = validarCamposObrigatórios({ título, tipo, naipe, data_audicao, descrição });
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    }

    function retornarAdministrarAudicoes() { navegar("../administrar-audições"); }

    async function cadastrarAudicao() {
        if (validarCampos()) {
            try {
                await serviçoCadastrarAudicao({ ...dados, cpf: usuárioLogado.cpf });
                mostrarToast(referênciaToast, "Audição cadastrada com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        }
    }

    async function alterarAudicao() {
        if (validarCampos()) {
            try {
                await serviçoAlterarAudicao({ ...dados, id: audicaoConsultada.id });
                mostrarToast(referênciaToast, "Audição alterada com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        }
    }

    async function removerAudicao() {
        try {
            await serviçoRemoverAudicao(audicaoConsultada.id);
            mostrarToast(referênciaToast, "Audição excluída com sucesso!", "sucesso");
        } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
    }

    function BotõesAções() {
        if (audicaoConsultada) {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={retornarAdministrarAudicoes} />
                    <Button className={estilizarBotãoRemover()} label="Remover" onClick={removerAudicao} />
                    <Button className={estilizarBotão()} label="Alterar" onClick={alterarAudicao} />
                </div>
            );
        } else {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={retornarAdministrarAudicoes} />
                    <Button className={estilizarBotão()} label="Cadastrar" onClick={cadastrarAudicao} />
                </div>
            );
        }
    }

    function tituloFormulario() {
        if (audicaoConsultada) return "Alterar Audição";
        else return "Cadastrar Audição";
    }

    useEffect(() => {
        async function buscarNaipesAudicoes() {
            try {
                const response = await serviçoBuscarNaipesAudicoes();
                if (response.data) setListaNaipes(response.data);
            } catch (error) {
                const erro = error.response.data.erro;
                if (erro) mostrarToast(referênciaToast, erro, "error");
            }
        }
        buscarNaipesAudicoes();
    }, []);

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} onHide={retornarAdministrarAudicoes} position="bottom-center" />
            <Card title={tituloFormulario()} className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Título*:</label>
                    <InputText name="título" className={estilizarInputText(erros.título, 400, usuárioLogado.cor_tema)}
                        value={dados.título} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.título} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Tipo:</label>
                    <Dropdown name="tipo" className={estilizarDropdown(erros.tipo, usuárioLogado.cor_tema)}
                        value={dados.tipo} options={opçõesTipo} onChange={alterarEstado} placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.tipo} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Naipes Cadastrados:</label>
                    <Dropdown name="naipe" placeholder="-- Selecione --" showClear
                        className={estilizarDropdown(erros.naipe, usuárioLogado.cor_tema)} filter
                        options={listaNaipes} onChange={alterarEstado} emptyMessage="Nenhum naipe cadastrado." />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Naipe*:</label>
                    <InputText name="naipe" className={estilizarInputText(erros.naipe, 200, usuárioLogado.cor_tema)}
                        value={dados.naipe} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.naipe} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Data da Audição*: </label>
                    <InputText name="data_audicao" type="date" value={dados.data_audicao}
                        className={estilizarInputText(erros.data_audicao, "", usuárioLogado.cor_tema)} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.data_audicao} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Descrição*:</label>
                    <InputTextarea name="descrição" value={dados.descrição}
                        className={estilizarInputTextarea(erros.descrição, usuárioLogado.cor_tema)}
                        onChange={alterarEstado} autoResize cols={40} />
                    <MostrarMensagemErro mensagem={erros.descrição} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Remunerada*: </label>
                    <Checkbox name="remunerada" checked={dados.remunerada}
                        className={estilizarCheckbox()} onChange={alterarEstado} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Status*:</label>
                    <Dropdown name="status" className={estilizarDropdown(erros.status, usuárioLogado.cor_tema)}
                        value={dados.status} options={opçõesStatus} onChange={alterarEstado} placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.status} />
                </div>
                <Divider className={estilizarDivider()} />
                <BotõesAções />
            </Card>
        </div>
    );
}
