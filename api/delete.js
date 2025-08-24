export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { name } = req.body;
  if (!name) return res.status(400).send('Invalid data');

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_USERNAME = "vannhost1234";
  const GITHUB_REPO = "uploadfoto";
  const filePath = `images/${name}`;

  // Dapatkan SHA file dulu
  const shaRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${filePath}`);
  const shaData = await shaRes.json();
  if (!shaRes.ok) return res.status(shaRes.status).send(JSON.stringify(shaData));

  const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${filePath}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Delete ${name}`,
      sha: shaData.sha
    })
  });

  const data = await response.json();
  if (!response.ok) return res.status(response.status).send(JSON.stringify(data));
  res.status(200).json({ success: true });
}