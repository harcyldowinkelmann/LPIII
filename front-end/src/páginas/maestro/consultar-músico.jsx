import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoMaestro from "../../contextos/contexto-maestro";
import { estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider, estilizarFlex,
 estilizarInlineFlex, estilizarInputText, estilizarLabel } from "../../utilitários/estilos";

export default function ConsultarMusico() {
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { musicoProponente } = useContext(ContextoMaestro);
    const dados = { nome_músico: musicoProponente?.usuário?.nome,
        instrumentoPrincipal: musicoProponente?.instrumentoPrincipal,
        nívelExperiência: musicoProponente?.nívelExperiência };
    const navegar = useNavigate();
    
    function retornarConsultarAudicao() { navegar("../consultar-audição"); };
    
    return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Músico" className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Músico*:</label>
                    <InputText name="nome_músico"
                        className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                        value={dados.nome_músico} disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Instrumento Principal*:</label>
                    <InputText name="instrumentoPrincipal"
                        className={estilizarInputText(null, 150, usuárioLogado.cor_tema)}
                        value={dados.instrumentoPrincipal} autoResize disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Nível de Experiência*:</label>
                    <InputText name="nívelExperiência"
                        value={dados.nívelExperiência}
                        className={estilizarInputText(null, 150, usuárioLogado.cor_tema)} disabled/>
                </div>
                <Divider className={estilizarDivider()}/>
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarConsultarAudicao}/>
                </div>
            </Card>
        </div>
    );
}
