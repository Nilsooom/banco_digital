const { contas } = require('../dados/bancodedados')


function acesso(req, res, next) {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(401).json({
            "mensagem": "Senha não informada!"
        })
    }

    if (senha_banco !== "Cubos123Bank") {
        return res.status(403).json({
            "mensagem": "A senha do banco informada é inválida!"
        })
    }
    next()
}

function senhaUsuarioSaque(req, res, next) {
    const { senha, numero_conta, valor } = req.body;

    if (!senha) {
        return res.status(401).json({
            "mensagem": "Senha de usuario não informada!"
        })
    }

    if (!numero_conta || !valor) {
        return res.status(400).json({
            "mensagem": "O numero da conta e o valor são obrigatórios!"
        })
    }

    const contaRequerida = contas.find((cliente) => {
        return cliente.numero === Number(numero_conta)
    })

    if (!contaRequerida) {
        return res.status(404).json({
            "mensagem": "O numero da conta solicitada não é valida"
        })
    }

    if (senha !== contaRequerida.usuario.senha) {
        return res.status(403).json({
            "mensagem": "Senha inválida!"
        })
    }
    next()
}

function senhaUsuarioTransfer(req, res, next) {
    const { senha, numero_conta_origem, numero_conta_destino, valor } = req.body;


    if (!senha) {
        return res.status(401).json({
            "mensagem": "Senha de usuario não informada!"
        })
    }

    if (!numero_conta_origem || !numero_conta_destino || !valor) {
        return res.status(400).json({
            "mensagem": "O numero da conta e o valor são obrigatórios!"
        })
    }

    const contaRequerida = contas.find((cliente) => {
        return cliente.numero === Number(numero_conta_origem)
    })

    if (!contaRequerida) {
        return res.status(404).json({
            "mensagem": "O numero da conta solicitada não é valida"
        })
    }

    if (senha !== contaRequerida.usuario.senha) {
        return res.status(403).json({
            "mensagem": "Senha inválida!"
        })
    }
    next()
}

function validacaoDeDados(req, res, next) {
    const { cpf, email } = req.body;

    if (!cpf) {
        return res.status(400).json({
            "mensagem": "CPF não informado! A informação é obrigatória."
        })
    }

    if (!email) {
        return res.status(400).json({
            "mensagem": "EMAIL não informado! A informação é obrigatória"
        })
    }

    const verificadorCPF = contas.some((conta) => {
        return conta.usuario.cpf === cpf
    })

    const verificadorEMAIL = contas.some((conta) => {
        return conta.usuario.email === email
    })

    if (verificadorCPF) {
        return res.status(403).json({
            "mensagem": " CPF inválido! Já existe uma conta com o CPF informado."
        })
    }
    if (verificadorEMAIL) {
        return res.status(403).json({
            "mensagem": "EMAIL inválido! Já existe uma conta com o Email informado."
        })
    }
    next()
}

function validacaoDeAtualizacao(req, res, next) {
    const { cpf, email } = req.body;
    const { numeroConta } = req.params;

    const contaRequerida = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })

    if (!contaRequerida) {
        return res.status(404).json({
            "mensagem": "O numero da conta solicitada não é valida"
        })
    }

    if (cpf) {
        const verificadorCPF = contas.some((conta) => {
            return conta.usuario.cpf === cpf
        })
        if (verificadorCPF) {
            return res.status(403).json({
                "mensagem": " CPF inválido! Já existe uma conta com o CPF informado."
            })
        }
        contaRequerida.usuario.cpf = cpf
    }

    if (email) {
        const verificadorEMAIL = contas.some((conta) => {
            return conta.usuario.email === email
        })
        if (verificadorEMAIL) {
            return res.status(403).json({
                "mensagem": "EMAIL inválido! Já existe uma conta com o Email informado."
            })
        }
        contaRequerida.usuario.email = email
    }
    next()
}

function verificacaoDeDados(req, res, next) {
    const { nome, data_nascimento, telefone, senha } = req.body;

    if (!nome) {
        return res.status(400).json({
            "mensagem": "Nome não informado! A informação é obrigatória."
        })
    }
    if (!data_nascimento) {
        return res.status(400).json({
            "mensagem": "Data de nascimento não informada! A informação é obrigatória."
        })
    }
    if (!telefone) {
        return res.status(400).json({
            "mensagem": "Telefone não informado! A informação é obrigatória."
        })
    }
    if (!senha) {
        return res.status(400).json({
            "mensagem": "Senha não informada! A informação é obrigatória."
        })
    }
    next()
}

function validacaoURL(req, res, next) {
    const { numero_conta, senha } = req.query;

    if (!senha) {
        return res.status(401).json({
            "mensagem": "Senha de usuario não informada!"
        })
    }

    if (!numero_conta) {
        return res.status(401).json({
            "mensagem": "Numero de conta não informado!"
        })
    }

    const contaRequerida = contas.find((cliente) => {
        return cliente.numero === Number(numero_conta)
    })

    if (!contaRequerida) {
        return res.status(404).json({
            "mensagem": "O numero da conta solicitada não é valida"
        })
    }
    if (contaRequerida.usuario.senha !== senha) {
        return res.status(403).json({
            "mensagem": "Senha inválida!"
        })
    }
    next()
}



module.exports = {
    acesso,
    senhaUsuarioSaque,
    senhaUsuarioTransfer,
    validacaoDeDados,
    verificacaoDeDados,
    validacaoURL,
    validacaoDeAtualizacao
}