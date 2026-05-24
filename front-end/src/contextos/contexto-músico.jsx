import { createContext, useState } from "react";

const ContextoMúsico = createContext();
export default ContextoMúsico;

export function ProvedorMúsico({ children }) {
    const [audicaoConsultada, setAudicaoConsultada] = useState(null);

    return (
        <ContextoMúsico.Provider value={{ audicaoConsultada, setAudicaoConsultada }}>
            {children}
        </ContextoMúsico.Provider>
    );
}