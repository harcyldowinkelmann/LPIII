import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoMúsico from "../../contextos/contexto-músico";
import { estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarCheckbox, 
 estilizarDivCampo, estilizarDivider, estilizarFlex, estilizarInlineFlex, estilizarInputText, 
 estilizarLabel } from "../../utilitários/estilos";

export default function ConsultarAvaliacao() {
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { avaliacaoConsultada, setMaestroAvaliador } = useContext(ContextoMúsico);
    const dados = { nome_maestro: avaliacaoConsultada?.maestro?.usuário?.nome,
        aprovado: avaliacaoConsultada?.aprovado,
        parecer_tecnico: avaliacaoConsultada?.parecer_tecnico,
        título_audicao: avaliacaoConsultada?.audição?.título };
    const navegar = useNavigate();

    function retornarPesquisarAvaliacoes() { navegar("../pesquisar-avaliações"); };

    function consultarMaestroAvaliador() {
        setMaestroAvaliador(avaliacaoConsultada?.maestro);
        navegar("../consultar-maestro");
    };

    return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Avaliação" className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Maestro*:</label>
                    <InputText name="nome_maestro"
                        className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                        value={dados.nome_maestro} disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Aprovado*:</label>
                    <Checkbox name="aprovado" checked={dados.aprovado}
                        className={estilizarCheckbox()} autoResize disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Parecer Técnico*:</label>
                    <InputTextarea name="parecer_tecnico"
                        className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                        value={dados.parecer_tecnico} disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Audição*</label>
                    <InputText name="título_audicao"
                        className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                        value={dados.título_audicao} disabled/>
                </div>
                <Divider className={estilizarDivider()}/>
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarPesquisarAvaliacoes}/>
                    <Button className={estilizarBotão()} label="Maestro" onClick={consultarMaestroAvaliador}/>
                </div>
            </Card>
        </div>
    );
}
