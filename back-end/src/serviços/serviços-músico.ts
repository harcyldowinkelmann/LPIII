import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Músico from '../entidades/músico';
import Audição from "../entidades/audição";
import Avaliação from "../entidades/avaliação";
import ServiçosUsuário from "./serviços-usuário";

export default class ServiçosMúsico { 
  constructor() {}

  static async cadastrarMúsico(request, response) {
    try {
      const { usuário_info, instrumentoPrincipal, nívelExperiência } = request.body;
      const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuário);
        const músico = Músico.create({ usuário, instrumentoPrincipal, nívelExperiência });
        await transactionManager.save(músico);
        await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });
        return response.json({ status: Status.ATIVO, token });
      });
    } catch (error) { return response.status(500).json({ erro: error }); }
  }

  static async atualizarMúsico(request, response) {
    try {
      const { cpf, instrumentoPrincipal, nívelExperiência } = request.body;
      const cpf_encriptado = md5(cpf);
      await Músico.update({ usuário: { cpf: cpf_encriptado } }, { instrumentoPrincipal, nívelExperiência });
      return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD : atualizarMúsico" }); }
  }

  static async buscarMúsico(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const músico = await Músico.findOne({ where: { usuário: cpf_encriptado }, relations: ["usuário"] });
      if (!músico) return response.status(404).json({ erro: "Músico não encontrado." });
      return response.json({ 
        nome: músico.usuário.nome, 
        email: músico.usuário.email,
        instrumentoPrincipal: músico.instrumentoPrincipal,  
        nívelExperiência: músico.nívelExperiência
      });
    } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarMúsico" }); }
  }

  static async cadastrarAudicao(request, response) {
    try {
      const { título, tipo, naipe, data_audicao, descrição, remunerada, status, cpf } = request.body;
      const cpf_encriptado = md5(cpf);
      const músico = await Músico.findOne({ where: { usuário: cpf_encriptado }, relations: ["usuário"] });
      await Audição.create({ título, tipo, naipe, data_audicao, descrição, remunerada, status, músico }).save();
      return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD: cadastrarAudicao" }); }
  }

  static async alterarAudicao(request, response) {
    try {
      const { id, título, tipo, naipe, data_audicao, descrição, remunerada, status } = request.body;
      await Audição.update(id, { título, tipo, naipe, data_audicao, descrição, remunerada, status });
      return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD: alterarAudicao" }); }
  }

  static async removerAudicao(request, response) {
    try {
      const id_audicao = request.params.id;
      const audicao = await Audição.findOne(id_audicao);
      await Audição.remove(audicao);
      return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD: removerAudicao" }); }
  }

  static async buscarAudicoesMusico(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const audicoes = await Audição.find({
        where: { músico: { usuário: cpf_encriptado } },
        relations: ["músico", "músico.usuário"]
      });
      return response.json(audicoes);
    } catch (error) { return response.status(500).json({ erro: "Erro BD: buscarAudicoesMusico" }); }
  }

  static filtrarNaipesEliminandoRepetição(audicoes: Audição[]) {
    let naipes: { label: string, value: string }[] = audicoes.filter((audicao, indice, audicoes_antes_filtrar) =>
      audicoes_antes_filtrar.findIndex(audicao_anterior => audicao_anterior.naipe === audicao.naipe) === indice
    ).map(audicao => ({ label: audicao.naipe, value: audicao.naipe }));
    return naipes;
  }

  static async buscarNaipesAudicoes(request, response) {
    try {
      const audicoes = await Audição.find();
      const naipes = ServiçosMúsico.filtrarNaipesEliminandoRepetição(audicoes);
      return response.json(naipes.sort());
    } catch (error) { return response.status(500).json({ erro: "Erro BD: buscarNaipesAudicoes" }); }
  }

  static async buscarAvaliacoesAudicao(request, response) {
    try {
      const id_audicao = request.params.id_audicao;
      const avaliacoes = await Avaliação.find({ 
        where: { audição: { id: id_audicao } },
        relations: ["maestro", "maestro.usuário", "audição"]
      });
      return response.json(avaliacoes);
    } catch (error) { return response.status(500).json({ erro: "Erro BD: buscarAvaliacoesAudicao" }); }
  }
}