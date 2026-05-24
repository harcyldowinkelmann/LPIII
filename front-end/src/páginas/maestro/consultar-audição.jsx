import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoMaestro from "../../contextos/contexto-maestro";
import { estilizarBotãoRetornar, estilizarCard, estilizarCheckbox, estilizarDivCampo,
    estilizarDivider, estilizarFlex, estilizarInlineFlex, estilizarInputText, estilizarLabel }
from "../../utilitários/estilos";

export default function ConsultarAudicao() {
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { audicaoConsultada, audicaoAvaliacao } = useContext(ContextoMaestro);
    const dados = {
        nome_músico: audicaoConsultada?.músico?.usuário?.nome || audicaoAvaliacao?.músico?.usuário?.nome,
        título: audicaoConsultada?.título || audicaoAvaliacao?.título,
        tipo: audicaoConsultada?.tipo || audicaoAvaliacao?.tipo,
        naipe: audicaoConsultada?.naipe || audicaoAvaliacao?.naipe,
        data_audicao: audicaoConsultada?.data_audicao || audicaoAvaliacao?.data_audicao,
        descrição: audicaoConsultada?.descrição || audicaoAvaliacao?.descrição,
        remunerada: audicaoConsultada?.remunerada || audicaoAvaliacao?.remunerada,
        status: audicaoConsultada?.status || audicaoAvaliacao?.status
    };
    const navegar = useNavigate();

    function retornar() {
        if (audicaoConsultada) navegar("../pesquisar-audições");
        else if (audicaoAvaliacao) navegar("../cadastrar-avaliação");
    }

    return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Audição" className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Músico*:</label>
                    <InputText name="nome_músico" className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                        value={dados.nome_músico} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Título*:</label>
                    <InputText name="título" className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                        value={dados.título} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Tipo:</label>
                    <InputText name="tipo" className={estilizarInputText(null, 200, usuárioLogado.cor_tema)}
                        value={dados.tipo} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Naipe*:</label>
                    <InputText name="naipe" className={estilizarInputText(null, 350, usuárioLogado.cor_tema)}
                        value={dados.naipe} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Data da Audição*:</label>
                    <InputText name="data_audicao" type="date" value={dados.data_audicao}
                        className={estilizarInputText(null, "", usuárioLogado.cor_tema)} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Descrição*:</label>
                    <InputTextarea name="descrição" value={dados.descrição}
                        className={estilizarInputText(null, 400, usuárioLogado.cor_tema)} autoResize disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Remunerada*:</label>
                    <Checkbox name="remunerada" checked={dados.remunerada}
                        className={estilizarCheckbox(null)} autoResize disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Status*:</label>
                    <InputText name="status" className={estilizarInputText(null, 100, usuárioLogado.cor_tema)}
                        value={dados.status} autoResize disabled />
                </div>
                <Divider className={estilizarDivider()} />
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={retornar} />
                </div>
            </Card>
        </div>
    );
}
