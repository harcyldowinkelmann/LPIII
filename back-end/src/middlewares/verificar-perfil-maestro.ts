import { Perfil } from "../entidades/usuário";

export default function verificarPerfilMaestro(request, response, next) {
    if (request.perfil === Perfil.MAESTRO) return next();
    else return response.status(401).json({ erro: "Acesso não autorizado." });
};