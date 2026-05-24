import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoMúsico from "../../contextos/contexto-músico";
import { estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider, 
 estilizarFlex, estilizarInlineFlex, estilizarInputText, estilizarLabel }
 from "../../utilitários/estilos";

export default function ConsultarMaestro() {
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { maestroAvaliador } = useContext(ContextoMúsico);
    const dados = { nome: maestroAvaliador?.usuário?.nome, registroOrdem: maestroAvaliador?.registroOrdem,
        anos_experiencia: maestroAvaliador?.anosExperiencia };
    const navegar = useNavigate();

    function retornarConsultarAvaliacao() { navegar("../consultar-avaliação"); };

    return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Maestro" className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Nome*:</label>
                    <InputText name="nome" className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                        value={dados.nome} disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Registro de Ordem*:</label>
                    <InputText name="registroOrdem" className={estilizarInputText(null, 300, usuárioLogado.cor_tema)}
                        value={dados.registroOrdem} disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Anos de Experiência*:</label>
                    <InputText name="anos_experiencia" value={dados.anos_experiencia}
                        className={estilizarInputText(null, 150, usuárioLogado.cor_tema)} disabled/>
                </div>
                <Divider className={estilizarDivider()}/>
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarConsultarAvaliacao}/>
                </div>
            </Card>
        </div>
    );
};
