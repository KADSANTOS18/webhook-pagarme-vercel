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

