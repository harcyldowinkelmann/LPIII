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
import { serviçoBuscarAudicoes } from "../../serviços/serviços-músico";
import mostrarToast from "../../utilitários/mostrar-toast";
import { TAMANHOS, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
    estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox }
from "../../utilitários/estilos";

export default function PesquisarAudicoes() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { audicaoConsultada, setAudicaoConsultada, setAudicaoSelecionada } = useContext(ContextoMúsico);
    const [listaAudicoes, setListaAudicoes] = useState([]);
    const navegar = useNavigate();

    const opçõesTipo = [
        { label: "Orquestra", value: "orquestra" },
        { label: "Câmara", value: "câmara" },
        { label: "Banda", value: "banda" },
        { label: "Solo", value: "solo" }
    ];

    function retornarCadastrarAvaliacao() {
        setAudicaoSelecionada(audicaoConsultada);
        setAudicaoConsultada(null);
        navegar("../cadastrar-avaliação");
    }

    function ConsultarTemplate(audicao) {
        return (
            <Button icon="pi pi-search"
                className={estilizarBotãoTabela(usuárioLogado.cor_tema, audicaoConsultada?.id === audicao.id)}
                tooltip="Consultar Audição" tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    setAudicaoConsultada(audicao);
                    navegar("../consultar-audição");
                }} />
        );
    }

    function DropdownTipoTemplate(opções) {
        function alterarFiltroDropdown(event) {
            return opções.filterCallback(event.value, opções.index);
        }
        return <Dropdown value={opções.value} options={opçõesTipo} placeholder="Selecione"
            onChange={alterarFiltroDropdown} showClear />;
    }

    function BooleanBodyTemplate(audicao) {
        if (audicao.remunerada) return "Sim";
        else return "Não";
    }

    function BooleanFilterTemplate(opções) {
        function alterarFiltroTriState(event) { return opções.filterCallback(event.value); }
        return (
            <div>
                <label>Remunerada:</label>
                <TriStateCheckbox
                    className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)} value={opções.value}
                    onChange={alterarFiltroTriState} />
            </div>
        );
    }

    useEffect(() => {
        let desmontado = false;
        async function buscarAudicoes() {
            try {
                const response = await serviçoBuscarAudicoes();
                if (!desmontado && response.data) setListaAudicoes(response.data);
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        }
        buscarAudicoes();
        return () => desmontado = true;
    }, []);

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} position="bottom-center" />
            <Card title="Pesquisar Audições" className={estilizarCard(usuárioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhuma audição encontrada." value={listaAudicoes}
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>
                    
                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} />
                    <Column field="maestro.usuário.nome" header="Nome do Maestro" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                    <Column field="título" header="Título" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                    <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
                        field="tipo" header="Tipo" filter filterMatchMode="equals"
                        filterElement={DropdownTipoTemplate} showClearButton={false}
                        showFilterOperator={false} showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
                    <Column field="naipe" header="Naipe" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                    <Column field="remunerada" header="Remunerada" dataType="boolean" filter
                        showFilterOperator={false} body={BooleanBodyTemplate}
                        filterElement={BooleanFilterTemplate} filterMatchMode="equals" showClearButton={false}
                        showAddButton={false} filterMenuClassName={estilizarFilterMenu()}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                </DataTable>
                <Divider className={estilizarDivider()} />
                <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={retornarCadastrarAvaliacao} />
            </Card>
        </div>
    );
}