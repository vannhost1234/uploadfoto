export default async function handler(req, res) {
  const GITHUB_USERNAME = "vannhost1234";
  const GITHUB_REPO = "uploadfoto";

  const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/images`);
  const data = await response.json();

  if (!response.ok) return res.status(response.status).send(JSON.stringify(data));

  const files = data.filter(item => item.type === 'file').map(item => item.name);
  res.status(200).json(files);
}