import { createContext, useState } from "react";

const ContextoMúsico = createContext();
export default ContextoMúsico;

export function ProvedorMúsico({ children }) {
    const [avaliacaoConsultada, setAvaliacaoConsultada] = useState(null);
    const [audicaoConsultada, setAudicaoConsultada] = useState(null);
    const [audicaoSelecionada, setAudicaoSelecionada] = useState(null);
    const [audicaoAvaliacao, setAudicaoAvaliacao] = useState(null);

    return (
        <ContextoMúsico.Provider value={{
            avaliacaoConsultada, setAvaliacaoConsultada,
            audicaoConsultada, setAudicaoConsultada,
            audicaoSelecionada, setAudicaoSelecionada,
            audicaoAvaliacao, setAudicaoAvaliacao
        }}>
            {children}
        </ContextoMúsico.Provider>
    );
}