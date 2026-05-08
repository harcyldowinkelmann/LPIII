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

export function serviçoCadastrarAudicao(audicao) { return servidor.post("/maestros/audicoes", audicao); }
export function serviçoAlterarAudicao(audicao) { return servidor.patch("/maestros/audicoes", audicao); }
export function serviçoRemoverAudicao(id) { return servidor.delete(`/maestros/audicoes/${id}`); }
export function serviçoBuscarAudicoesMaestro(cpf) { return servidor.get(`/maestros/audicoes/maestro/${cpf}`); }
export function serviçoBuscarNaipesAudicoes() { return servidor.get("/maestros/audicoes/naipes"); }