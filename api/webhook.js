export default async function handler(req, res) {
  if (req.method === 'POST') {
    const body = req.body;

    console.log('Webhook recebido:', body);

    return res.status(200).json({ success: true, message: 'Webhook processado com sucesso.' });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
