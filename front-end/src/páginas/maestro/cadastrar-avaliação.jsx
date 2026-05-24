import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoMaestro from "../../contextos/contexto-maestro";
import { serviçoCadastrarAvaliacao, serviçoRemoverAvaliacao } from "../../serviços/serviços-maestro";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios } from "../../utilitários/validações";
import { estilizarBotão, estilizarBotãoRetornar, estilizarBotãoRemover, estilizarCard,
    estilizarCheckbox, estilizarDivCampo, estilizarDivider, estilizarFlex, estilizarInlineFlex,
    estilizarInputText, estilizarInputTextarea, estilizarLabel } from "../../utilitários/estilos";

export default function CadastrarAvaliacao() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { avaliacaoConsultada, audicaoSelecionada, setAudicaoConsultada, setAudicaoAvaliacao } = useContext(ContextoMaestro);
    const [dados, setDados] = useState({ 
        id_audicao: audicaoSelecionada?.id || "",
        aprovado: avaliacaoConsultada?.aprovado || false,
        parecer_tecnico: avaliacaoConsultada?.parecer_tecnico || "" 
    });
    const [erros, setErros] = useState({});
    const navegar = useNavigate();

    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        let valor = event.target.value ?? event.checked;
        setDados({ ...dados, [chave]: valor });
    }

    function validarCampos() {
        const { parecer_tecnico } = dados;
        let errosCamposObrigatórios = validarCamposObrigatórios({ parecer_tecnico });
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    }

    function audicaoLabel() {
        if (avaliacaoConsultada?.audição?.título || audicaoSelecionada) return "Audição Selecionada*:";
        else return "Selecione uma Audição*:";
    }

    function pesquisarAudicoes() { navegar("../pesquisar-audições"); }

    function retornarAdministrarAvaliacoes() { navegar("../administrar-avaliações"); }

    function consultarAudicaoAvaliacao() {
        setAudicaoConsultada(null);
        setAudicaoAvaliacao(avaliacaoConsultada?.audição);
        navegar("../consultar-audição");
    };

    async function cadastrarAvaliacao() {
        if (validarCampos()) {
            try {
                await serviçoCadastrarAvaliacao({ ...dados, cpf: usuárioLogado.cpf });
                mostrarToast(referênciaToast, "Avaliação cadastrada com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
        }
    }

    async function removerAvaliacao() {
        try {
            await serviçoRemoverAvaliacao(avaliacaoConsultada.id);
            mostrarToast(referênciaToast, "Avaliação removida com sucesso!", "sucesso");
        } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
    }

    function BotõesAções() {
        if (avaliacaoConsultada) {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={retornarAdministrarAvaliacoes} />
                    <Button className={estilizarBotãoRemover()} label="Remover" onClick={removerAvaliacao} />
                    <Button className={estilizarBotão()} label="Audição" onClick={consultarAudicaoAvaliacao}/>
                </div>
            );
        } else {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={retornarAdministrarAvaliacoes} />
                    <Button className={estilizarBotão()} label="Cadastrar" onClick={cadastrarAvaliacao} />
                </div>
            );
        }
    }

    function tituloFormulario() {
        if (avaliacaoConsultada) return "Remover Avaliação";
        else return "Cadastrar Avaliação";
    }

    function AudicaoInputText() {
        if (audicaoSelecionada?.título)
            return <InputText name="titulo_audicao" className={estilizarInputText(erros.titulo_audicao, 400, usuárioLogado.cor_tema)}
                value={audicaoSelecionada?.título} disabled />;
        else if (avaliacaoConsultada?.audição?.título)
            return <InputText name="titulo_audicao" className={estilizarInputText(erros.titulo_audicao, 400, usuárioLogado.cor_tema)}
                value={avaliacaoConsultada?.audição?.título} disabled />;
        else return null;
    }

    function BotãoSelecionar() {
        if (!audicaoSelecionada && !avaliacaoConsultada)
            return <Button className={estilizarBotão()} label="Selecionar" onClick={pesquisarAudicoes} />;
        else if (audicaoSelecionada)
            return <Button className={estilizarBotão()} label="Substituir" onClick={pesquisarAudicoes} />;
        else return null;
    }

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} onHide={retornarAdministrarAvaliacoes} position="bottom-center" />
            <Card title={tituloFormulario()} className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>{audicaoLabel()}</label>
                    <BotãoSelecionar />
                    <AudicaoInputText />
                    <MostrarMensagemErro mensagem={erros.id_audicao} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Aprovado*:</label>
                    <Checkbox name="aprovado" checked={dados.aprovado}
                        className={estilizarCheckbox()} onChange={alterarEstado} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Parecer Técnico*:</label>
                    <InputTextarea name="parecer_tecnico" value={dados.parecer_tecnico}
                        className={estilizarInputTextarea(erros.parecer_tecnico, usuárioLogado.cor_tema)}
                        onChange={alterarEstado} autoResize cols={40} />
                    <MostrarMensagemErro mensagem={erros.parecer_tecnico} />
                </div>
                <Divider className={estilizarDivider()} />
                <BotõesAções />
            </Card>
        </div>
    );
}
