import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilMusico from "../middlewares/verificar-perfil-músico";
import ServiçosMúsico from "../serviços/serviços-músico";

const RotasMúsico = Router();
export default RotasMúsico;

RotasMúsico.post("/", ServiçosMúsico.cadastrarMúsico);
RotasMúsico.get("/:cpf", verificarToken, verificarPerfilMusico, ServiçosMúsico.buscarMúsico);