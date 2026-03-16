import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilMúsico from "../middlewares/verificar-perfil-músico";
import ServiçosMúsico from "../serviços/serviços-músico";

const RotasMúsico = Router();
export default RotasMúsico;

RotasMúsico.post("/", ServiçosMúsico.cadastrarMúsico);
RotasMúsico.patch("/", verificarToken, verificarPerfilMúsico, ServiçosMúsico.atualizarMúsico);
RotasMúsico.get("/:cpf", verificarToken, verificarPerfilMúsico, ServiçosMúsico.buscarMúsico);