export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, sha } = req.body;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = "vannhost1234"; // ganti
  const REPO_NAME = "uploadfoto";      // ganti
  const FOLDER_PATH = "images";

  const del = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}/${name}`, {
    method: "DELETE",
    headers: {
      "Authorization": `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Delete ${name}`,
      sha
    })
  });

  const result = await del.json();
  res.status(del.status).json(result);
}