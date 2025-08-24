export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, content } = req.body;

  const response = await fetch(`https://api.github.com/repos/vannhost1234/uploadfoto/contents/images/${name}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Upload ${name}`,
      content: content.split(',')[1]
    })
  });

  const data = await response.json();
  if (response.ok) {
    res.status(200).json({ url: data.content.html_url });
  } else {
    res.status(response.status).json(data);
  }
}