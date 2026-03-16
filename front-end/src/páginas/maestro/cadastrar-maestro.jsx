import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import mostrarToast from "../../utilitários/mostrar-toast";
import { serviçoBuscarMaestro, serviçoCadastrarMaestro, serviçoAtualizarMaestro } from "../../serviços/serviços-maestro";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios } from "../../utilitários/validações";
import { estilizarBotão, estilizarCard, estilizarDivCampo, estilizarFlex, estilizarInputText, estilizarLabel } from "../../utilitários/estilos";

export default function CadastrarMaestro() {
    const referênciaToast = useRef(null);
    const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
    const [dados, setDados] = useState({ formação: "", link_lattes: "", instituição: "" });
    const [erros, setErros] = useState({});

    useEffect(() => {
        async function buscarMaestro() {
            try {
                const response = await serviçoBuscarMaestro(usuárioLogado.cpf);
                setDados(response.data);
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
        }
        if (usuárioLogado?.cadastrado) buscarMaestro();
    }, [usuárioLogado]);

    function alterarEstado(event) {
        const chave = event.target.name;
        const valor = event.target.value;
        setDados({ ...dados, [chave]: valor });
    }

    function validarCampos() {
        const { formação, link_lattes, instituição } = dados;
        let errosCamposObrigatórios = validarCamposObrigatórios({ formação, link_lattes, instituição });
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    }

    async function cadastrarMaestro() {
        if (validarCampos()) {
            try {
                const response = await serviçoCadastrarMaestro({ ...dados, cpf: usuárioLogado.cpf });
                if (response) {
                    setUsuárioLogado({ ...usuárioLogado, cadastrado: true, status: response.data.status, token: response.data.token });
                    mostrarToast(referênciaToast, "Maestro cadastrado com sucesso!", "sucesso");
                }
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
        }
    }

    async function atualizarMaestro() {
        if (validarCampos()) {
            try {
                const response = await serviçoAtualizarMaestro({ ...dados, cpf: usuárioLogado.cpf });
                if (response) mostrarToast(referênciaToast, "Maestro atualizado com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
        }
    };

    function títuloFormulário() {
        if (usuárioLogado?.cadastrado) return "Alterar Maestro";
        else return "Cadastrar Maestro";
    }

    function labelBotãoSalvar() {
        if (usuárioLogado?.cadastrado) return "Alterar";
        else return "Salvar";
    }

    function açãoBotãoSalvar() {
        if (usuárioLogado?.cadastrado) atualizarMaestro();
        else cadastrarMaestro();
    };

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} position="bottom-center" />
            <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Formação Acadêmica*:</label>
                    <InputText name="formação" className={estilizarInputText(erros.formação, 400, usuárioLogado.cor_tema)} value={dados.formação} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.formação} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Link do Lattes*:</label>
                    <InputText name="link_lattes" className={estilizarInputText(erros.link_lattes, 400, usuárioLogado.cor_tema)} value={dados.link_lattes} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.link_lattes} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Instituição de Atuação*:</label>
                    <InputText name="instituição" className={estilizarInputText(erros.instituição, 400, usuárioLogado.cor_tema)} value={dados.instituição} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.instituição} />
                </div>
                <Button className={estilizarBotão(usuárioLogado.cor_tema)} label={labelBotãoSalvar()} onClick={açãoBotãoSalvar} />
            </Card>
        </div>
    );
}