export const checarListaVazia = (erros) => Object.keys(erros).length === 0;

export const validarCampoEmail = (email) => {
    let erros = {};
    if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) erros.email = "Endereço de email inválido.";
    return erros;
};

export const validarCamposObrigatórios = (dados) => {
    let erros = {};
    Object.entries(dados).forEach(([chave, valor]) => {
        if (!valor && valor !== false) erros[chave] = "Campo obrigatório.";
    });
    return erros;
};

export const validarConfirmaçãoSenha = (senha, confirmação) => {
    let erros = {};
    if (senha !== confirmação) erros.confirmação_senha = "As senhas não coincidem.";
    return erros;
};

export const validarConfirmaçãoSenhaOpcional = (senha, confirmação) => {
    let erros = {};
    if (senha || confirmação) return validarConfirmaçãoSenha(senha, confirmação);
    return erros;
};

export const validarRecuperaçãoAcessoOpcional = (questão, resposta) => {
    let erros = {};
    if ((questão && !resposta) || (!questão && resposta)) {
        erros.questão = "Preencha a questão e a resposta.";
        erros.resposta = "Preencha a questão e a resposta.";
    }
    return erros;
};

export const MostrarMensagemErro = ({ mensagem }) => (
    mensagem ? <small className="p-error">{mensagem}</small> : <small className="p-error">&nbsp;</small>
);