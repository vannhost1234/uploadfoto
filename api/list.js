export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = "vannhost1234"; // ganti
  const REPO_NAME = "uploadfoto";      // ganti
  const FOLDER_PATH = "images";

  const list = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}`, {
    headers: { "Authorization": `token ${GITHUB_TOKEN}` }
  });

  const result = await list.json();
  res.status(list.status).json(result);
}