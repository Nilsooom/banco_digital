const { contas } = require('../dados/bancodedados')
const fs = require('fs')


function verificarConta(numeroConta, resposta) {
    const contaRequerida = contas.find((cliente) => {
        return cliente.numero === Number(numeroConta)
    })


    if (!contaRequerida) {
        return resposta.status(404).json({
            "mensagem": "O numero da conta solicitada não é valida"
        })
    }
}

function listarContas(req, res) {
    return res.status(200).json(contas)
}

function cadastroDeConta(req, res) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const cadastro = {
        "numero": contas.length + 1,
        "saldo": 0,
        "usuario": {
            "nome": nome,
            "cpf": cpf,
            "data_nascimento": data_nascimento,
            "telefone": telefone,
            "email": email,
            "senha": senha
        }
    }
    const dados = require('../dados/bancodedados')

    dados.contas.push(cadastro)
    let registro = JSON.stringify(dados);

    fs.writeFileSync('./desafio-backend-02-sistema-bancario-dbe-t02-ifood/src/dados/bancodedados.js', 'module.exports = ')
    fs.appendFileSync('./desafio-backend-02-sistema-bancario-dbe-t02-ifood/src/dados/bancodedados.js', registro);

    return res.status(201).json("Conta criado com sucesso !")
}

function atualizacaoDeConta(req, res) {
    const { nome, data_nascimento, telefone, senha } = req.body;
    const { numeroConta } = req.params;

    const contaRequerida = contas.find((usuario) => {
        return usuario.numero === Number(numeroConta)
    })

    contaRequerida.usuario.nome = nome
    contaRequerida.usuario.data_nascimento = data_nascimento
    contaRequerida.usuario.telefone = telefone
    contaRequerida.usuario.senha = senha

    return res.status(204).json()
}

function deletarConta(req, res) {
    const { numeroConta } = req.params;
    verificarConta(numeroConta, res)

    const contaRequerida = contas.find((usuario) => {
        return usuario.numero === Number(numeroConta)
    })

    if (contaRequerida.saldo !== 0) {
        return res.status(400).json({
            "mensagem": "A conta só pode ser removida se o saldo for zero!"
        })
    }

    contas.splice(contas.findIndex((usuario) => {
        return usuario.numero === contaRequerida.numero
    }), 1)

    return res.status(204).json()
}





module.exports = {
    listarContas,
    cadastroDeConta,
    atualizacaoDeConta,
    deletarConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}