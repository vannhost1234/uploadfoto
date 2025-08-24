export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const { name } = req.query; // nama file misalnya: foto123.png

  // Dapatkan SHA file dulu
  const fileResponse = await fetch(`https://api.github.com/repos/vannhost1234/uploadfoto/contents/images/${name}`, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  const fileData = await fileResponse.json();
  if (!fileResponse.ok) {
    return res.status(fileResponse.status).json(fileData);
  }

  // Hapus file berdasarkan SHA
  const deleteResponse = await fetch(`https://api.github.com/repos/vannhost1234/uploadfoto/contents/images/${name}`, {
    method: 'DELETE',
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Delete ${name}`,
      sha: fileData.sha
    })
  });

  const result = await deleteResponse.json();
  if (deleteResponse.ok) {
    res.status(200).json({ message: 'Berhasil dihapus!' });
  } else {
    res.status(deleteResponse.status).json(result);
  }
}