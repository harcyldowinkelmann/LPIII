import { createContext, useState } from "react";

const ContextoMúsico = createContext();
export default ContextoMúsico;

export function ProvedorMúsico({ children }) {
    const [audicaoConsultada, setAudicaoConsultada] = useState(null);
    const [avaliacaoConsultada, setAvaliacaoConsultada] = useState(null);
    const [maestroAvaliador, setMaestroAvaliador] = useState(null);

    return (
        <ContextoMúsico.Provider value={{ 
            audicaoConsultada, setAudicaoConsultada,
            avaliacaoConsultada, setAvaliacaoConsultada,
            maestroAvaliador, setMaestroAvaliador
        }}>
            {children}
        </ContextoMúsico.Provider>
    );
}