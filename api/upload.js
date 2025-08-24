export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, content } = req.body;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = "vannhostq234"; // ganti
  const REPO_NAME = "uploadfoto";      // ganti
  const BRANCH = "main";
  const FOLDER_PATH = "images";

  const upload = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}/${name}`, {
    method: "PUT",
    headers: {
      "Authorization": `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Upload ${name}`,
      content
    })
  });

  const result = await upload.json();
  res.status(upload.status).json(result);
}