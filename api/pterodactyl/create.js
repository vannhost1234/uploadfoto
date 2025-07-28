const axios = require('axios');
const crypto = require("crypto");

function generateTransactionId() {
    return `VANN HOSTING -${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
}

module.exports = function(app) {
    app.get('/pterodactyl/create', async (req, res) => {
        const { apikey, username, ram, disk, cpu, eggid, nestid, loc, domain, ptla, ptlc } = req.query;

        if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' });

        if (!username || !ram || !disk || !cpu || !eggid || !nestid || !loc || !domain || !ptla || !ptlc) {
            return res.json({ status: false, error: 'Missing required parameters' });
        }

        try {
            const response = await axios.post(`${ptla}/api/application/servers`, {
                name: username,
                user: 1,
                egg: parseInt(eggid),
                docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
                startup: "npm start",
                environment: {},
                limits: {
                    memory: parseInt(ram),
                    swap: 0,
                    disk: parseInt(disk),
                    io: 500,
                    cpu: parseInt(cpu)
                },
                feature_limits: {
                    databases: 1,
                    allocations: 1,
                    backups: 1
                },
                deploy: {
                    locations: [parseInt(loc)],
                    dedicated_ip: false,
                    port_range: []
                },
                start_on_completion: true,
                nest: parseInt(nestid)
            }, {
                headers: {
                    'Authorization': `Bearer ${ptlc}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            res.status(200).json({
                status: true,
                result: response.data
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error?.response?.data || error.message });
        }
    });
};