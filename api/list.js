export default async function handler(req, res) {
  const repo = "vannhost1234/uploadfoto";
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/images`);
  const data = await response.json();
  if (!response.ok) return res.status(response.status).json(data);

  const photos = data.map(file => ({
    name: file.name,
    url: file.download_url
  }));

  res.status(200).json(photos);
}