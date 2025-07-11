import { getValidBlingToken } from '../utils/blingAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const body = req.body;

  if (body.event === 'transaction_paid') {
    const cliente = {
      nome: body.customer?.name || "Nome não informado",
      tipoPessoa: body.customer?.document_number?.length === 14 ? "J" : "F",
      cpfCnpj: body.customer?.document_number || "00000000000",
      email: body.customer?.email || "sem@email.com",
      fone: body.customer?.phone_numbers?.[0] || "00000000000",
      endereco: body.billing?.address?.street || "Rua não informada",
      numero: body.billing?.address?.street_number || "0",
      bairro: body.billing?.address?.neighborhood || "Centro",
      cep: body.billing?.address?.zipcode || "00000000",
      cidade: body.billing?.address?.city || "Cidade",
      uf: body.billing?.address?.state || "SP"
    };

    const pedido = {
      numero: "PED-" + body.transaction_id,
      data: new Date().toISOString().slice(0, 10),
      cliente: cliente,
      itens: [
        {
          codigo: body.metadata?.codigo_produto || "PROD001",
          descricao: body.metadata?.descricao_produto || "Produto Padrão",
          quantidade: Number(body.metadata?.quantidade) || 1,
          valor: body.amount / 100
        }
      ],
      formaPagamento: {
        id: Number(body.metadata?.forma_pagamento_id) || 1
      },
      tipoIntegracao: "API"
    };

    try {
      const token = await getValidBlingToken();

      const response = await fetch('https://www.bling.c
