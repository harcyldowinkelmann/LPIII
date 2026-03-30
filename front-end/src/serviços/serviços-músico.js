import servidor from "./servidor";

export function serviçoCadastrarMúsico(músico) { 
  return servidor.post("/musicos", músico); 
};

export function serviçoAtualizarMúsico(músico) { 
  return servidor.patch("/musicos", músico); 
};

export function serviçoBuscarMúsico(cpf) { 
  return servidor.get(`/musicos/${cpf}`); 
};