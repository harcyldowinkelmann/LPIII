import servidor from "./servidor";

export const serviçoCadastrarMusico = (dados) => servidor.post("/musicos", dados);
export const serviçoBuscarMusico = (cpf) => servidor.get(`/musicos/${cpf}`);