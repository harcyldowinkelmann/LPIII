import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { TriStateCheckbox } from "primereact/tristatecheckbox";

import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoMúsico from "../../contextos/contexto-músico";
import mostrarToast from "../../utilitários/mostrar-toast";
import { serviçoBuscarAvaliacoesMusico } from "../../serviços/serviços-músico";
import { TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
    estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox }
from "../../utilitários/estilos";

export default function AdministrarAvaliacoes() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { avaliacaoConsultada, setAvaliacaoConsultada, setAudicaoSelecionada } = useContext(ContextoMúsico);
    const [listaAvaliacoes, setListaAvaliacoes] = useState([]);
    const navegar = useNavigate();

    const opçõesTipo = [
        { label: "Orquestra", value: "orquestra" },
        { label: "Câmara", value: "câmara" },
        { label: "Banda", value: "banda" },
        { label: "Solo", value: "solo" }
    ];

    function retornarPáginaInicial() { navegar("/pagina-inicial"); }

    function adicionarAvaliacao() {
        setAvaliacaoConsultada(null);
        setAudicaoSelecionada(null);
        navegar("../cadastrar-avaliação");
    }

    function ConsultarTemplate(avaliacao) {
        function consultar() {
            setAvaliacaoConsultada(avaliacao);
            setAudicaoSelecionada(null);
            navegar("../cadastrar-avaliação");
        }
        return (
            <Button icon="pi pi-search"
                className={estilizarBotãoTabela(usuárioLogado.cor_tema, avaliacaoConsultada?.id === avaliacao.id)}
                tooltip="Consultar avaliação" tooltipOptions={{ position: 'top' }} onClick={consultar} />
        );
    }

    function DropdownTipoTemplate(opções) {
        function alterarFiltroDropdown(event) {
            return opções.filterCallback(event.value, opções.index);
        }
        return <Dropdown value={opções.value} options={opçõesTipo} placeholder="Selecione"
            onChange={alterarFiltroDropdown} showClear />;
    }

    function BooleanBodyTemplate(avaliacao) {
        if (avaliacao.aprovado) return "Sim";
        else return "Não";
    }

    function BooleanFilterTemplate(opções) {
        function alterarFiltroTriState(event) { return opções.filterCallback(event.value); }
        return (
            <div>
                <label>Aprovado:</label>
                <TriStateCheckbox
                    className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)} value={opções.value}
                    onChange={alterarFiltroTriState} />
            </div>
        );
    }

    useEffect(() => {
        let desmontado = false;
        async function buscarAvaliacoesMusico() {
            try {
                const response = await serviçoBuscarAvaliacoesMusico(usuárioLogado.cpf);
                if (!desmontado && response.data) setListaAvaliacoes(response.data);
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        }
        buscarAvaliacoesMusico();
        return () => desmontado = true;
    }, [usuárioLogado.cpf]);

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} position="bottom-center" />
            <Card title="Administrar Avaliações" className={estilizarCard(usuárioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhuma avaliação encontrada." value={listaAvaliacoes}
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>
                    
                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} />
                    <Column field="audição.maestro.usuário.nome" header="Maestro" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                    <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
                        field="audição.tipo" header="Tipo" filter filterMatchMode="equals"
                        filterElement={DropdownTipoTemplate} showClearButton={false}
                        showFilterOperator={false} showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
                    <Column field="audição.título" header="Audição" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                    <Column field="aprovado" header="Aprovado" dataType="boolean" filter
                        showFilterOperator={false} body={BooleanBodyTemplate}
                        filterElement={BooleanFilterTemplate} filterMatchMode="equals" showClearButton={false}
                        showAddButton={false} filterMenuClassName={estilizarFilterMenu()}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                </DataTable>
                <Divider className={estilizarDivider()} />
                <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={retornarPáginaInicial} />
                <Button className={estilizarBotão()} label="Adicionar" onClick={adicionarAvaliacao} />
            </Card>
        </div>
    );
}