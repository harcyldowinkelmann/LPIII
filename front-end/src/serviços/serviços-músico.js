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

export function serviçoCadastrarAudicao(audicao) { return servidor.post("/musicos/audicoes", audicao); }
export function serviçoAlterarAudicao(audicao) { return servidor.patch("/musicos/audicoes", audicao); }
export function serviçoRemoverAudicao(id) { return servidor.delete(`/musicos/audicoes/${id}`); }
export function serviçoBuscarAudicoesMusico(cpf) { return servidor.get(`/musicos/audicoes/musico/${cpf}`); }
export function serviçoBuscarNaipesAudicoes() { return servidor.get("/musicos/audicoes/naipes"); }
export function serviçoBuscarAvaliacoesAudicao(id_audicao) { return servidor.get(`/musicos/avaliacoes/${id_audicao}`); }