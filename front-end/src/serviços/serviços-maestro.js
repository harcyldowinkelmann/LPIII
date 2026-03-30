import servidor from "./servidor";

export function serviçoCadastrarMaestro(maestro) { 
  return servidor.post("/maestros", maestro); 
};

export function serviçoBuscarMaestro(cpf) { 
  return servidor.get(`/maestros/${cpf}`); 
};

export function serviçoAtualizarMaestro(maestro) { 
  return servidor.patch("/maestros", maestro); 
};