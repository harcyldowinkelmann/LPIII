import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import ContextoMúsico from "../../contextos/contexto-músico";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoBuscarAudicoesMusico } from "../../serviços/serviços-músico";
import mostrarToast from "../../utilitários/mostrar-toast";
import { TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
    estilizarColunaConsultar, estilizarColumnHeader, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox }
from "../../utilitários/estilos";

export default function AdministrarAudicoes() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { audicaoConsultada, setAudicaoConsultada } = useContext(ContextoMúsico);
    const [listaAudicoes, setListaAudicoes] = useState([]);
    const navegar = useNavigate();

    const opçõesTipo = [
        { label: "Orquestra", value: "orquestra" },
        { label: "Câmara", value: "câmara" },
        { label: "Banda", value: "banda" },
        { label: "Solo", value: "solo" }
    ];

    function retornarPáginaInicial() { navegar("/pagina-inicial"); }

    function adicionarAudicao() {
        setAudicaoConsultada(null);
        navegar("../cadastrar-audição");
    }

    function ConsultarTemplate(audicao) {
        function consultar() {
            setAudicaoConsultada(audicao);
            navegar("../cadastrar-audição");
        }
        return (
            <Button icon="pi pi-search"
                className={estilizarBotãoTabela(usuárioLogado.cor_tema, audicaoConsultada?.id === audicao.id)}
                tooltip="Consultar Audição" tooltipOptions={{ position: 'top' }} onClick={consultar} />
        );
    }

    function DropdownNaipeTemplate(opções) {
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
        async function buscarAudicoesMusico() {
            try {
                const response = await serviçoBuscarAudicoesMusico(usuárioLogado.cpf);
                if (!desmontado && response.data) { setListaAudicoes(response.data); }
            } catch (error) {
                const erro = error.response.data.erro;
                if (erro) mostrarToast(referênciaToast, erro, "error");
            }
        }
        buscarAudicoesMusico();
        return () => desmontado = true;
    }, [usuárioLogado.cpf]);

    return (
        <div className={estilizarFlex()}>
            <Card title="Administrar Audições" className={estilizarCard(usuárioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhuma audição encontrada." value={listaAudicoes}
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>
                    
                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} />
                    <Column field="título" header="Título" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                    <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
                        field="tipo" header="Tipo" filter filterMatchMode="equals"
                        filterElement={DropdownNaipeTemplate} showClearButton={false}
                        showFilterOperator={false} showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
                    <Column field="naipe" header="Naipe" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable />
                    <Column field="remunerada" header="Remunerada" filter
                        showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable
                        filterMatchMode="equals" filterElement={BooleanFilterTemplate}
                        body={BooleanBodyTemplate} showClearButton={false} showAddButton={false}
                        filterMenuClassName={estilizarFilterMenu()} dataType="boolean" />
                </DataTable>
                <Divider className={estilizarDivider()} />
                <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={retornarPáginaInicial} />
                <Button className={estilizarBotão()} label="Adicionar" onClick={adicionarAudicao} />
            </Card>
        </div>
    );
}
