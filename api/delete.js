export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  const { name } = req.body;
  const token = process.env.GITHUB_TOKEN;
  const repo = "vannhost1234/uploadfoto";
  const path = `images/${name}`;

  // Ambil SHA dulu
  const shaRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`);
  const shaData = await shaRes.json();
  if (!shaRes.ok) return res.status(400).json(shaData);

  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'DELETE',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Delete ${name}`,
      sha: shaData.sha
    })
  });

  if (response.status === 200) {
    return res.status(200).json({ message: "Deleted" });
  } else {
    return res.status(response.status).send(await response.text());
  }
}