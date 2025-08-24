export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { name, content } = req.body;
  if (!name || !content) return res.status(400).send('Invalid data');

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_USERNAME = "vannhost1234";
  const GITHUB_REPO = "uploadfoto";
  const filePath = `images/${name}`;

  const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Upload ${name}`,
      content
    })
  });

  const data = await response.json();
  if (!response.ok) return res.status(response.status).send(JSON.stringify(data));
  res.status(200).json({ success: true, file: name });
}