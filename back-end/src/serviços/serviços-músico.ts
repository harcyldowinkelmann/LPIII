import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Músico from "../entidades/músico";
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
        } catch (error) {
            return response.status(500).json({ erro: error });
        }
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
        } catch (error) { 
            return response.status(500).json({ erro: "Erro BD: buscarMúsico" }); 
        }
    }
};