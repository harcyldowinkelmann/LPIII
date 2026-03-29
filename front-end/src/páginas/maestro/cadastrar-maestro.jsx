import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import mostrarToast from "../../utilitários/mostrar-toast";
import { serviçoBuscarMaestro, serviçoCadastrarMaestro, serviçoAtualizarMaestro } from "../../serviços/serviços-maestro";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios } from "../../utilitários/validações";
import { estilizarBotão, estilizarCard, estilizarDivCampo, estilizarFlex, estilizarInputText, estilizarDropdown, estilizarLabel } from "../../utilitários/estilos";

export default function CadastrarMaestro() {
    const referênciaToast = useRef(null);
    const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
    const [dados, setDados] = useState({ anosExperiência: "", estiloRegência: "" });
    const [erros, setErros] = useState({});

    const opçõesEstiloRegência = [
        { label: "Clássico", value: "clássico" },
        { label: "Sinfônico", value: "sinfônico" },
        { label: "Popular", value: "popular" },
        { label: "Contemporâneo", value: "contemporâneo" }
    ];

    useEffect(() => {
        async function buscarMaestro() {
            try {
                const response = await serviçoBuscarMaestro(usuárioLogado.cpf);
                setDados(response.data);
            } catch (error) { mostrarToast(referênciaToast, error.response?.data?.erro || "Erro na busca", "erro"); }
        }
        if (usuárioLogado?.cadastrado) buscarMaestro();
    }, [usuárioLogado]);

    function alterarEstado(event) {
        const chave = event.target.name;
        const valor = event.target.value;
        setDados({ ...dados, [chave]: valor });
    }

    function validarCampos() {
        const { anosExperiência, estiloRegência } = dados;
        let errosCamposObrigatórios = validarCamposObrigatórios({ anosExperiência, estiloRegência });
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    }

    async function cadastrarMaestro() {
        if (validarCampos()) {
            try {
                const payload = {
                    usuário_info: {
                        cpf: usuárioLogado.cpf,
                        nome: usuárioLogado.nome,
                        perfil: usuárioLogado.perfil,
                        email: usuárioLogado.email,
                        senha: usuárioLogado.senha,
                        questão: usuárioLogado.questão,
                        resposta: usuárioLogado.resposta,
                        cor_tema: usuárioLogado.cor_tema
                    },
                    anosExperiência: Number(dados.anosExperiência),
                    estiloRegência: dados.estiloRegência
                };

                const response = await serviçoCadastrarMaestro(payload);
                if (response) {
                    setUsuárioLogado({ ...usuárioLogado, cadastrado: true, status: response.data.status, token: response.data.token });
                    mostrarToast(referênciaToast, "Maestro cadastrado com sucesso!", "sucesso");
                }
            } catch (error) { mostrarToast(referênciaToast, error.response?.data?.erro || "Erro no cadastro", "erro"); }
        }
    }

    async function atualizarMaestro() {
        if (validarCampos()) {
            try {
                const response = await serviçoAtualizarMaestro({ 
                    cpf: usuárioLogado.cpf, 
                    anosExperiência: Number(dados.anosExperiência), 
                    estiloRegência: dados.estiloRegência 
                });
                if (response) mostrarToast(referênciaToast, "Maestro atualizado com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response?.data?.erro || "Erro na atualização", "erro"); }
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
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Anos de Experiência*:</label>
                    <InputText name="anosExperiência" className={estilizarInputText(erros.anosExperiência, 400, usuárioLogado.cor_tema)} value={dados.anosExperiência} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.anosExperiência} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Estilo de Regência*:</label>
                    <Dropdown name="estiloRegência" className={estilizarDropdown(erros.estiloRegência, usuárioLogado.cor_tema)} value={dados.estiloRegência} options={opçõesEstiloRegência} onChange={alterarEstado} placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.estiloRegência} />
                </div>
                <Button className={estilizarBotão(usuárioLogado.cor_tema)} label={labelBotãoSalvar()} onClick={açãoBotãoSalvar} />
            </Card>
        </div>
    );
}