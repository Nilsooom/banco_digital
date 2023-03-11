const { contas, depositos, saques, transferencias } = require('../dados/bancodedados')
const { format } = require('date-fns')


function sacar(req, res) {
    const { numero_conta, valor } = req.body;

    const contaRequerida = contas.find((cliente) => {
        return cliente.numero === Number(numero_conta)
    })

    if (valor > contaRequerida.saldo) {
        return res.status(403).json({
            "mensagem": "Saldo insuficiente para saque!"
        })
    }

    const saque = {
        "data": format(new Date(), "dd/MM/yyyy - H:mm:ss aa"),
        "numero_conta": numero_conta,
        "valor": valor
    }

    contaRequerida.saldo -= valor
    saques.push(saque)

    return res.status(204).json()
}


function depositar(req, res) {
    const { numero_conta, valor } = req.body;

    if (valor <= 0) {
        return res.status(403).json({
            "mensagem": "Saldo informado não é válido!"
        })
    }

    if (numero_conta === undefined || !valor) {
        return res.status(400).json({
            "mensagem": "O número da conta e o valor são obrigatórios!"
        })
    }

    verificarConta(numero_conta, res);

    const contaRequerida = contas.find((usuario) => {
        return usuario.numero === numero_conta
    })

    const deposito = {
        "data": format(new Date(), "dd/MM/yyyy - H:mm:ss aa"),
        "numero_conta": numero_conta,
        "valor": valor
    }

    contaRequerida.saldo += valor
    depositos.push(deposito);

    return res.status(204).json()
}

function transferir(req, res) {
    const { numero_conta_origem, numero_conta_destino, valor } = req.body;

    verificarConta(numero_conta_destino, res)

    const contaOrigem = contas.find((cliente) => {
        return cliente.numero === Number(numero_conta_origem)
    })

    const contaDestino = contas.find((cliente) => {
        return cliente.numero === Number(numero_conta_destino)
    })

    if (contaOrigem.saldo < valor) {
        return res.status(403).json({
            "mensagem": "Saldo insuficiente para está transferência!"
        })
    }
    contaOrigem.saldo -= valor
    contaDestino.saldo += valor

    const transicoes = {
        "data": format(new Date(), "dd/MM/yyyy - H:mm:ss aa"),
        "numero_conta_origem": numero_conta_origem,
        "numero_conta_destino": numero_conta_destino,
        "valor": valor
    }

    transferencias.push(transicoes)
    return res.status(204).json()
}

function extrato(req, res) {
    const { numero_conta } = req.query;

    const extratoDeposito = depositos.filter((historico) => {
        return historico.numero_conta === Number(numero_conta)
    })
    const extratoSaque = saques.filter((historico) => {
        return historico.numero_conta === numero_conta
    })

    let transferenciaEnviada = [];
    let transferenciaRecebida = [];

    transferencias.forEach((transferencia) => {
        if (transferencia.numero_conta_origem === Number(numero_conta)) {
            transferenciaEnviada.push(transferencia)
        } else if (transferencia.numero_conta_destino === Number(numero_conta)) {
            transferenciaRecebida.push(transferencia)
        }
    });

    return res.status(201).json({
        "depositos": extratoDeposito,
        "saques": extratoSaque,
        "transferenciasEnviadas": transferenciaEnviada,
        "transferenciaRecebida": transferenciaRecebida
    })
}

function saldo(req, res) {
    const { numero_conta } = req.query;

    const contaRequerida = contas.find((cliente) => {
        return cliente.numero === Number(numero_conta)
    })

    return res.status(200).json({
        "saldo": contaRequerida.saldo
    })

}
module.exports = {
    sacar,
    depositar,
    transferir,
    extrato,
    saldo
}