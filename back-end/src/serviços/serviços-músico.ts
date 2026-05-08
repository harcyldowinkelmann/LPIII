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

  static async cadastrarAvaliacao(request, response) {
    try {
      const { id_audicao, aprovado, parecer_tecnico, cpf } = request.body;
      const cpf_encriptado = md5(cpf);
      const músico = await Músico.findOne({ where: { usuário: cpf_encriptado } });
      const audição = await Audição.findOne(id_audicao);
      const avaliacoes = await Avaliação.find({ where: { músico, audição } });

      if (avaliacoes.length > 0) return response.status(404).json({ erro: "O músico já cadastrou avaliação para a audição." });

      await Avaliação.create({ aprovado, parecer_tecnico, músico, audição }).save();
      return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD: cadastrarAvaliacao" }); }
  }

  static async removerAvaliacao(request, response) {
    try {
      const id = request.params.id;
      await Avaliação.delete(id);
      return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD: removerAvaliacao" }); }
  }

  static async buscarAvaliacoesMusico(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const avaliacoes = await Avaliação.find({ 
        where: { músico: { usuário: cpf_encriptado } },
        relations: ["músico", "músico.usuário", "audição", "audição.maestro", "audição.maestro.usuário"] 
      });
      return response.json(avaliacoes);
    } catch (error) { return response.status(500).json({ erro: "Erro BD: buscarAvaliacoesMusico" }); }
  }

  static async buscarAudicoes(request, response) {
    try {
      const audicoes = await Audição.find({ relations: ["maestro", "maestro.usuário"] });
      return response.json(audicoes);
    } catch (error) { return response.status(500).json({ erro: "Erro BD: buscarAudicoes" }); }
  }
}