import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Maestro from "../entidades/maestro";
import Audição from "../entidades/audição";
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

    static async cadastrarAudicao(request, response) {
        try {
            const { título, tipo, naipe, data_audicao, descrição, remunerada, status, cpf } = request.body;
            const cpf_encriptado = md5(cpf);
            const maestro = await Maestro.findOne({ where: { usuário: cpf_encriptado }, relations: ["usuário"] });
            await Audição.create({ título, tipo, naipe, data_audicao, descrição, remunerada, status, maestro }).save();
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

    static async buscarAudicoesMaestro(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const audicoes = await Audição.find({
                where: { maestro: { usuário: cpf_encriptado } },
                relations: ["maestro", "maestro.usuário"]
            });
            return response.json(audicoes);
        } catch (error) { return response.status(500).json({ erro: "Erro BD: buscarAudicoesMaestro" }); }
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