export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const body = req.body;

  if (body.event === 'transaction_paid') {
    const pedido = {
      numero: "PED-" + body.transaction_id,
      data: new Date().toISOString().slice(0, 10),
      cliente: {
        nome: "Cliente Exemplo",
        tipoPessoa: "F",
        cpfCnpj: "12345678900",
        endereco: "Rua Teste",
        numero: "123",
        bairro: "Centro",
        cep: "15000000",
        cidade: "São José do Rio Preto",
        uf: "SP"
      },
      itens: [
        {
          codigo: "PROD001",
          descricao: "Produto Teste",
          quantidade: 1,
          valor: body.amount / 100
        }
      ],
      formaPagamento: {
        id: 1
      },
      tipoIntegracao: "API"
    };

    try {
      const response = await fetch('https://www.bling.com.br/Api/v3/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic SEU_TOKEN_ENCODED'
        },
        body: JSON.stringify(pedido)
      });

      const data = await response.json();

      return res.status(200).json({
        success: true,
        message: 'Pedido enviado ao Bling com sucesso.',
        blingResponse: data
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao enviar para o Bling.',
        error: error.message
      });
    }
  } else {
    return res.status(200).json({
      success: true,
      message: 'Evento ignorado: ' + body.event
    });
  }
}
