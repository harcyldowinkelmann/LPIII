import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilMúsico from "../middlewares/verificar-perfil-músico";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";
import ServiçosMúsico from "../serviços/serviços-músico";

const RotasMúsico = Router();
export default RotasMúsico;

RotasMúsico.post("/", ServiçosMúsico.cadastrarMúsico);
RotasMúsico.patch("/", verificarToken, verificarPerfilMúsico, ServiçosMúsico.atualizarMúsico);

RotasMúsico.post("/audicoes", verificarToken, verificarPerfilMúsico, ServiçosMúsico.cadastrarAudicao);
RotasMúsico.patch("/audicoes", verificarToken, verificarPerfilMúsico, ServiçosMúsico.alterarAudicao);
RotasMúsico.delete("/audicoes/:id", verificarToken, verificarPerfilMúsico, ServiçosMúsico.removerAudicao);
RotasMúsico.get("/audicoes/musico/:cpf", verificarToken, verificarPerfilMúsico, verificarErroConteúdoToken, ServiçosMúsico.buscarAudicoesMusico);
RotasMúsico.get("/audicoes/naipes", verificarToken, verificarPerfilMúsico, ServiçosMúsico.buscarNaipesAudicoes);

RotasMúsico.get("/:cpf", verificarToken, verificarPerfilMúsico, ServiçosMúsico.buscarMúsico);
RotasMúsico.get("/avaliacoes/:id_audicao", verificarToken, verificarPerfilMúsico, ServiçosMúsico.buscarAvaliacoesAudicao);