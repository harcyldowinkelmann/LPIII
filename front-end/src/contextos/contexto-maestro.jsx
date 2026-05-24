import { createContext, useState } from "react";

const ContextoMaestro = createContext();
export default ContextoMaestro;

export function ProvedorMaestro({ children }) {
    const [avaliacaoConsultada, setAvaliacaoConsultada] = useState(null);
    const [audicaoConsultada, setAudicaoConsultada] = useState(null);
    const [audicaoSelecionada, setAudicaoSelecionada] = useState(null);
    const [audicaoAvaliacao, setAudicaoAvaliacao] = useState(null);

    return (
        <ContextoMaestro.Provider value={{
            avaliacaoConsultada, setAvaliacaoConsultada,
            audicaoConsultada, setAudicaoConsultada,
            audicaoSelecionada, setAudicaoSelecionada,
            audicaoAvaliacao, setAudicaoAvaliacao
        }}>
            {children}
        </ContextoMaestro.Provider>
    );
}