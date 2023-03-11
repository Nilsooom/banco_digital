const express = require('express');
const rotas = express()

const { acesso, verificacaoDeDados, validacaoDeDados, validacaoURL, senhaUsuarioTransfer, senhaUsuarioSaque, validacaoDeAtualizacao } = require('./controladores/middleware')
const { sacar, depositar, transferir, extrato, saldo } = require('./controladores/transacoes')
const { listarContas, cadastroDeConta, atualizacaoDeConta, deletarConta } = require('./controladores/contas');


rotas.get('/contas', acesso, listarContas)
rotas.get('/contas/saldo', validacaoURL, saldo)
rotas.get('/contas/extrato', validacaoURL, extrato)
rotas.post('/contas', verificacaoDeDados, validacaoDeDados, cadastroDeConta)
rotas.put('/contas/:numeroConta/usuario', verificacaoDeDados, validacaoDeAtualizacao, atualizacaoDeConta)
rotas.delete('/contas/:numeroConta', deletarConta)
rotas.post('/transacoes/depositar', depositar)
rotas.post('/transacoes/sacar', senhaUsuarioSaque, sacar)
rotas.post('/transacoes/transferir', senhaUsuarioTransfer, transferir)


module.exports = rotas
