import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import ContextoUsuário from "../contextos/contexto-usuário";

export default function RotasMúsico() {
    const { usuárioLogado } = useContext(ContextoUsuário);
    if (usuárioLogado.perfil === "musico") return <Outlet/>;
    else return <Navigate to="/"/>;
}