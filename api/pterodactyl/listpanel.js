const axios = require('axios');

module.exports = function(app) {
    app.get('/pterodactyl/listpanel', async (req, res) => {
        const { apikey, eggid, nestid, loc, domain, ptla, ptlc } = req.query;

        if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });

        if (!domain || !ptla || !ptlc) return res.json({ status: false, error: 'Missing domain/ptla/ptlc' });

        try {
            const response = await axios.get(`${ptla}/api/application/servers`, {
                headers: {
                    'Authorization': `Bearer ${ptlc}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const servers = response.data.data.map(s => s.attributes).filter(s =>
                s.name.includes(domain)
            );

            res.status(200).json({
                status: true,
                result: servers
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error?.response?.data || error.message });
        }
    });
};