import servidor from "./servidor";

export const serviçoVerificarCpfExistente = (cpf) => servidor.post(`/usuarios/verificar-cpf/${cpf}`);
export const serviçoLogarUsuário = (dados) => servidor.post("/usuarios/login", dados);