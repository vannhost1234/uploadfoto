const axios = require('axios');

module.exports = function (app) {
    app.get('/pterodactyl/create', async (req, res) => {
        const { username, ram, disk, cpu, eggid, nestid, loc, domain, ptla, ptlc } = req.query;

        if (!username || !ram || !disk || !cpu || !eggid || !nestid || !loc || !domain || !ptla || !ptlc) {
            return res.json({ status: false, message: 'Parameter tidak lengkap.' });
        }

        try {
            const response = await axios.post(`https://${domain}/api/application/servers`, {
                name: username,
                user: 1,
                egg: parseInt(eggid),
                docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
                startup: "npm start",
                environment: {
                    USERNAME: username
                },
                limits: {
                    memory: parseInt(ram),
                    swap: 0,
                    disk: parseInt(disk),
                    io: 500,
                    cpu: parseInt(cpu)
                },
                feature_limits: {
                    databases: 0,
                    backups: 0,
                    allocations: 1
                },
                allocation: {
                    default: 1
                },
                deploy: {
                    locations: [parseInt(loc)],
                    dedicated_ip: false,
                    port_range: []
                },
                start_on_completion: true
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ptla}`,
                    'Accept': 'Application/vnd.pterodactyl.v1+json'
                }
            });

            res.json({
                status: true,
                message: 'Panel berhasil dibuat.',
                data: response.data
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.response?.data || error.message
            });
        }
    });
};