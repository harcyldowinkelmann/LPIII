import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilMaestro from "../middlewares/verificar-perfil-maestro";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";
import ServiçosMaestro from "../serviços/serviços-maestro";

const RotasMaestro = Router();
export default RotasMaestro;

RotasMaestro.post("/", ServiçosMaestro.cadastrarMaestro);
RotasMaestro.get("/:cpf", verificarToken, verificarPerfilMaestro, ServiçosMaestro.buscarMaestro);
RotasMaestro.patch("/", verificarToken, verificarPerfilMaestro, ServiçosMaestro.atualizarMaestro);

RotasMaestro.post("/audicoes", verificarToken, verificarPerfilMaestro, ServiçosMaestro.cadastrarAudicao);
RotasMaestro.patch("/audicoes", verificarToken, verificarPerfilMaestro, ServiçosMaestro.alterarAudicao);
RotasMaestro.delete("/audicoes/:id", verificarToken, verificarPerfilMaestro, ServiçosMaestro.removerAudicao);
RotasMaestro.get("/audicoes/maestro/:cpf", verificarToken, verificarPerfilMaestro, verificarErroConteúdoToken, ServiçosMaestro.buscarAudicoesMaestro);
RotasMaestro.get("/audicoes/naipes", verificarToken, verificarPerfilMaestro, ServiçosMaestro.buscarNaipesAudicoes);