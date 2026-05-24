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

export function serviçoCadastrarAvaliacao(avaliacao) { return servidor.post("/maestros/avaliacoes", avaliacao); }
export function serviçoRemoverAvaliacao(id) { return servidor.delete(`/maestros/avaliacoes/${id}`); }
export function serviçoBuscarAvaliacoesMaestro(cpf) { return servidor.get(`/maestros/avaliacoes/maestro/${cpf}`); }
export function serviçoBuscarNaipesAudicoes() { return servidor.get("/maestros/audicoes/naipes"); }
export function serviçoBuscarAudicoes() { return servidor.get("/maestros/audicoes"); }