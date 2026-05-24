import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoMúsico from "../../contextos/contexto-músico";
import mostrarToast from "../../utilitários/mostrar-toast";
import { serviçoBuscarAvaliacoesAudicao } from "../../serviços/serviços-músico";
import { TAMANHOS, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard, 
 estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator, 
 estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox }
 from "../../utilitários/estilos";

export default function PesquisarAvaliacoes() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { avaliacaoConsultada, setAvaliacaoConsultada,
     audicaoConsultada } = useContext(ContextoMúsico);
    const [listaAvaliacoes, setListaAvaliacoes] = useState([]);
    const navegar = useNavigate();

    function retornarCadastrarAudicao() {
        setAvaliacaoConsultada(null);
        navegar("../cadastrar-audição");
    };

    function ConsultarTemplate(avaliacao) {
        return (
            <Button icon="pi pi-search"
                className={estilizarBotãoTabela(usuárioLogado.cor_tema, avaliacaoConsultada?.id === avaliacao.id)}
                tooltip="Consultar Avaliação" tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    setAvaliacaoConsultada(avaliacao);
                    navegar("../consultar-avaliação");
                }}/>
        );
    };

    function BooleanBodyTemplate(avaliacao) {
        if (avaliacao.aprovado) return "Sim";
        else return "Não";
    };

    function BooleanFilterTemplate(opções) {
        function alterarFiltroTriState(event) { return opções.filterCallback(event.value); };
        return (
            <div>
                <label>Aprovado:</label>
                <TriStateCheckbox
                    className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)} value={opções.value}
                    onChange={alterarFiltroTriState}/>
            </div>
        );
    }; 

    useEffect(() => {
        let desmontado = false;
        async function buscarAvaliacoesAudicao() {
            try {
                const response = await serviçoBuscarAvaliacoesAudicao(audicaoConsultada?.id);
                if (!desmontado && response.data) setListaAvaliacoes(response.data);
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        };
        buscarAvaliacoesAudicao();
        return () => desmontado = true;
    }, [audicaoConsultada?.id]);

    return ( 
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} position="bottom-center"/>
            <Card title="Avaliações Cadastradas" className={estilizarCard(usuárioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhuma avaliação encontrada." value={listaAvaliacoes}
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>
                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}/>
                    <Column field="maestro.usuário.nome" header="Maestro" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
                    <Column field="audição.título" header="Audição" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
                    <Column field="aprovado" header="Aprovado" dataType="boolean" filter
                        showFilterOperator={false} body={BooleanBodyTemplate}
                        filterElement={BooleanFilterTemplate} filterMatchMode="equals"
                        showClearButton={false} showAddButton={false}
                        filterMenuClassName={estilizarFilterMenu()}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
                </DataTable>
                <Divider className={estilizarDivider()}/>
                <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarCadastrarAudicao}/>
            </Card>
        </div>
    );
}
