const axios = require('axios');

module.exports = function(app) {
    app.get('/pterodactyl/delete', async (req, res) => {
        const { apikey, idserver, domain, ptla, ptlc } = req.query;

        if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });

        if (!idserver || !domain || !ptla || !ptlc) {
            return res.json({ status: false, error: 'Missing parameters' });
        }

        try {
            await axios.delete(`${ptla}/api/application/servers/${idserver}`, {
                headers: {
                    'Authorization': `Bearer ${ptlc}`,
                    'Accept': 'application/json'
                }
            });

            res.status(200).json({
                status: true,
                message: `Server with ID ${idserver} on ${domain} has been deleted.`
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error?.response?.data || error.message });
        }
    });
};