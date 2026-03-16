import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilMaestro from "../middlewares/verificar-perfil-maestro";
import ServiçosMaestro from "../serviços/serviços-maestro";

const RotasMaestro = Router();
export default RotasMaestro;

RotasMaestro.post("/", ServiçosMaestro.cadastrarMaestro);
RotasMaestro.get("/:cpf", verificarToken, verificarPerfilMaestro, ServiçosMaestro.buscarMaestro);
RotasMaestro.patch("/", verificarToken, verificarPerfilMaestro, ServiçosMaestro.atualizarMaestro);