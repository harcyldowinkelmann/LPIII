import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilMúsico from "../middlewares/verificar-perfil-músico";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";
import ServiçosMúsico from "../serviços/serviços-músico";

const RotasMúsico = Router();
export default RotasMúsico;

RotasMúsico.post("/", ServiçosMúsico.cadastrarMúsico);
RotasMúsico.patch("/", verificarToken, verificarPerfilMúsico, ServiçosMúsico.atualizarMúsico);
RotasMúsico.get("/:cpf", verificarToken, verificarPerfilMúsico, ServiçosMúsico.buscarMúsico);

RotasMúsico.post("/avaliacoes", verificarToken, verificarPerfilMúsico, ServiçosMúsico.cadastrarAvaliacao);
RotasMúsico.delete("/avaliacoes/:id", verificarToken, verificarPerfilMúsico, ServiçosMúsico.removerAvaliacao);
RotasMúsico.get("/avaliacoes/musico/:cpf", verificarToken, verificarPerfilMúsico, verificarErroConteúdoToken, ServiçosMúsico.buscarAvaliacoesMusico);
RotasMúsico.get("/avaliacoes/audicoes", verificarToken, verificarPerfilMúsico, ServiçosMúsico.buscarAudicoes);