export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, content } = req.body;
  const token = process.env.GITHUB_TOKEN;
  const repo = 'uploadfoto';
  const owner = 'vannhost1234';
  const path = `images/${name}`;

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Upload ${name}`,
        content: content.replace(/^data:image\/\w+;base64,/, ''),
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Upload failed', error: data });
    }

    return res.status(200).json({ message: 'Upload success', url: data.content.html_url });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}