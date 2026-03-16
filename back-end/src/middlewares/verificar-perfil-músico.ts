import { Perfil } from '../entidades/usuário';

export default function verificarPerfilMúsico(request, response, next) {
    if (request.perfil === Perfil.MUSICO) return next();
    else return response.status(401).json({ erro: "Acesso não autorizado." });
};