import { createContext, useState } from "react";

const ContextoMaestro = createContext();
export default ContextoMaestro;

export function ProvedorMaestro({ children }) {
    const [audicaoConsultada, setAudicaoConsultada] = useState(null);
    return (
        <ContextoMaestro.Provider value={{ audicaoConsultada, setAudicaoConsultada }}>
            {children}
        </ContextoMaestro.Provider>
    );
}