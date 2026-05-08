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

export function serviçoCadastrarAvaliacao(avaliacao) { return servidor.post("/musicos/avaliacoes", avaliacao); }
export function serviçoRemoverAvaliacao(id) { return servidor.delete(`/musicos/avaliacoes/${id}`); }
export function serviçoBuscarAvaliacoesMusico(cpf) { return servidor.get(`/musicos/avaliacoes/musico/${cpf}`); }
export function serviçoBuscarAudicoes() { return servidor.get("/musicos/avaliacoes/audicoes"); }