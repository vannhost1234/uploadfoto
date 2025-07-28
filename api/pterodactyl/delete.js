const axios = require('axios');

module.exports = function (app) {
  app.get('/pterodactyl/delete', async (req, res) => {
    const { idserver, domain, ptla, ptlc, apikey } = req.query;

    if (!global.apikey.includes(apikey)) return res.json({ success: false, message: "Invalid API key" });

    if (!idserver || !ptla || !ptlc) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
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
  });
};