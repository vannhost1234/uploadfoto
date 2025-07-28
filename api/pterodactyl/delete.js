import axios from 'axios';

export default async function handler(req, res) {
  const { idserver, domain, ptla, ptlc } = req.query;

  if (!idserver || !ptla || !ptlc) {
    return res.status(400).json({
      success: false,
      message: 'Missing one or more required parameters (idserver, ptla, ptlc)'
    });
  }

  try {
    const url = `${ptla}/api/application/servers/${idserver}`;

    await axios.delete(url, {
      headers: {
        'Authorization': `Bearer ${ptlc}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return res.status(200).json({
      success: true,
      message: `Server dengan ID ${idserver} berhasil dihapus.`
    });

  } catch (error) {
    const errMsg = error?.response?.data || error.message;
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus server.',
      error: errMsg
    });
  }
}