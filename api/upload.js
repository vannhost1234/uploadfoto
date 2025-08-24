export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  const { name, content } = req.body;
  const token = process.env.GITHUB_TOKEN;

  const base64 = content.split(',')[1]; // ambil data base64 asli
  const repo = "vannhost1234/uploadfoto";
  const path = `images/${Date.now()}-${name}`;

  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Upload ${name}`,
      content: base64
    })
  });

  const data = await response.json();
  if (response.status === 201) {
    return res.status(200).json({ url: data.content.download_url });
  } else {
    return res.status(response.status).send(JSON.stringify(data));
  }
}