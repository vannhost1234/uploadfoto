const axios = require('axios');

module.exports = function (app) {
    app.get('/pterodactyl/delete', async (req, res) => {
        const { idserver, domain, ptla } = req.query;

        if (!idserver || !domain || !ptla) {
            return res.json({ status: false, message: 'Parameter idserver, domain, dan ptla wajib diisi.' });
        }

        try {
            await axios.delete(`https://${domain}/api/application/servers/${idserver}`, {
                headers: {
                    'Authorization': `Bearer ${ptla}`,
                    'Accept': 'Application/vnd.pterodactyl.v1+json'
                }
            });

            res.json({
                status: true,
                message: 'Panel berhasil dihapus.'
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.response?.data || error.message
            });
        }
    });
};