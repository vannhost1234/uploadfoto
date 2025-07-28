const axios = require('axios');

module.exports = function (app) {
    app.get('/pterodactyl/listpanel', async (req, res) => {
        const { domain, ptla } = req.query;

        if (!domain || !ptla) {
            return res.json({ status: false, message: 'Parameter domain dan ptla wajib diisi.' });
        }

        try {
            const response = await axios.get(`https://${domain}/api/application/servers`, {
                headers: {
                    'Authorization': `Bearer ${ptla}`,
                    'Accept': 'Application/vnd.pterodactyl.v1+json'
                }
            });

            const list = response.data.data.map(server => ({
                id: server.attributes.id,
                name: server.attributes.name,
                uuid: server.attributes.uuidShort,
                created_at: server.attributes.created_at
            }));

            res.json({
                status: true,
                result: list
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.response?.data || error.message
            });
        }
    });
};