const fetch = require('node-fetch');

module.exports = function (app) {
  app.get('/pterodactyl/deleteuser', async (req, res) => {
    const { iduser, domain, ptla } = req.query;

    // Validasi Parameter
    if (!iduser || !domain || !ptla) {
      return res.status(400).json({
        status: false,
        error: 'Parameter tidak lengkap. Wajib: iduser, domain, ptla'
      });
    }

    const headers = {
      "Authorization": `Bearer ${ptla}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    try {
      const response = await fetch(`${domain}/api/application/users/${iduser}`, {
        method: "DELETE",
        headers
      });

      if (response.status === 204) {
        return res.status(200).json({
          status: true,
          message: `User ID ${iduser} berhasil dihapus.`
        });
      } else {
        const errorData = await response.json();
        return res.status(response.status).json({
          status: false,
          error: 'Gagal menghapus user',
          detail: errorData
        });
      }

    } catch (err) {
      return res.status(500).json({
        status: false,
        error: 'Terjadi kesalahan saat menghapus user',
        detail: err.message
      });
    }
  });
};