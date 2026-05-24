import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilMaestro from "../middlewares/verificar-perfil-maestro";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";
import ServiçosMaestro from "../serviços/serviços-maestro";

const RotasMaestro = Router();
export default RotasMaestro;

RotasMaestro.post("/", ServiçosMaestro.cadastrarMaestro);
RotasMaestro.patch("/", verificarToken, verificarPerfilMaestro, ServiçosMaestro.atualizarMaestro);

RotasMaestro.post("/avaliacoes", verificarToken, verificarPerfilMaestro, ServiçosMaestro.cadastrarAvaliacao);
RotasMaestro.delete("/avaliacoes/:id", verificarToken, verificarPerfilMaestro, ServiçosMaestro.removerAvaliacao);
RotasMaestro.get("/avaliacoes/maestro/:cpf", verificarToken, verificarPerfilMaestro, verificarErroConteúdoToken, ServiçosMaestro.buscarAvaliacoesMaestro);

RotasMaestro.get("/audicoes/naipes", verificarToken, verificarPerfilMaestro, ServiçosMaestro.buscarNaipesAudicoes);
RotasMaestro.get("/audicoes", verificarToken, verificarPerfilMaestro, ServiçosMaestro.buscarAudicoes);

RotasMaestro.get("/:cpf", verificarToken, verificarPerfilMaestro, ServiçosMaestro.buscarMaestro);