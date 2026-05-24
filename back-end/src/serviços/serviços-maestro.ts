import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Maestro from "../entidades/maestro";
import Audição from "../entidades/audição";
import Avaliação from "../entidades/avaliação";
import ServiçosUsuário from "./serviços-usuário";

export default class ServiçosMaestro {
    constructor() {}

    static async cadastrarMaestro(request, response) {
        try {
            const { usuário_info, anosExperiência, estiloRegência } = request.body;
            const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
            const entityManager = getManager();

            await entityManager.transaction(async (transactionManager) => {
                await transactionManager.save(usuário);
                const maestro = Maestro.create({ usuário, anosExperiência, estiloRegência });
                await transactionManager.save(maestro);
                await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });
                return response.json({ status: Status.ATIVO, token });
            });
        } catch (error) {
            return response.status(500).json({ erro: error });
        }
    }

    static async buscarMaestro(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const maestro = await Maestro.findOne({ where: { usuário: cpf_encriptado }, relations: ["usuário"] });
            
            if (!maestro) return response.status(404).json({ erro: "Maestro não encontrado." });

            return response.json({ 
                nome: maestro.usuário.nome, 
                email: maestro.usuário.email, 
                anosExperiência: maestro.anosExperiência, 
                estiloRegência: maestro.estiloRegência 
            });
        } catch (error) { 
            return response.status(500).json({ erro: "Erro BD: buscarMaestro" }); 
        }
    }

    static async atualizarMaestro(request, response) {
        try {
          const { cpf, estiloRegência, anosExperiência } = request.body;
          const cpf_encriptado = md5(cpf);
          await Maestro.update({ usuário: { cpf: cpf_encriptado } },
            { estiloRegência, anosExperiência });
          return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : atualizarMaestro" }); }
    }

    static async cadastrarAvaliacao(request, response) {
        try {
            const { id_audicao, aprovado, parecer_tecnico, cpf } = request.body;
            const cpf_encriptado = md5(cpf);
            const maestro = await Maestro.findOne({ where: { usuário: cpf_encriptado } });
            const audição = await Audição.findOne(id_audicao);
            const avaliacoes = await Avaliação.find({ where: { maestro, audição } });

            if (avaliacoes.length > 0) return response.status(404).json({ erro: "O maestro já cadastrou avaliação para a audição." });

            await Avaliação.create({ aprovado, parecer_tecnico, maestro, audição }).save();
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

    static async buscarAvaliacoesMaestro(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const avaliacoes = await Avaliação.find({ 
                where: { maestro: { usuário: cpf_encriptado } },
                relations: ["maestro", "maestro.usuário", "audição", "audição.músico", "audição.músico.usuário"] 
            });
            return response.json(avaliacoes);
        } catch (error) { return response.status(500).json({ erro: "Erro BD: buscarAvaliacoesMaestro" }); }
    }

    static async buscarAudicoes(request, response) {
        try {
            const audicoes = await Audição.find({ relations: ["músico", "músico.usuário"] });
            return response.json(audicoes);
        } catch (error) { return response.status(500).json({ erro: "Erro BD: buscarAudicoes" }); }
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
            const naipes = ServiçosMaestro.filtrarNaipesEliminandoRepetição(audicoes);
            return response.json(naipes.sort());
        } catch (error) { return response.status(500).json({ erro: "Erro BD: buscarNaipesAudicoes" }); }
    }
}