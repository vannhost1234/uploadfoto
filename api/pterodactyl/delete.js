import axios from 'axios';

export default async function handler(req, res) {
  const { idserver, domain, ptla, ptlc } = req.query;

  if (!idserver || !ptla || !ptlc) {
    return res.status(400).json({
      success: false,
      message: 'Missing one or more required parameters'
    });
  }

  try {
    const url = `${ptla}/api/application/servers/${idserver}`;

    // Kirim request DELETE ke Pterodactyl
    const response = await axios.delete(url, {
      headers: {
        'Authorization': `Bearer ${ptlc}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return res.status(200).json({
      success: true,
      message: `Server ID ${idserver} has been deleted.`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete server',
      error: error.response?.data || error.message
    });
  }
}