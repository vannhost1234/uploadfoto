const axios = require('axios');

module.exports = function (app) {
    // Endpoint YouTube to MP4
    app.get('/download/ytmp4', async (req, res) => {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ status: false, error: 'Parameter url wajib diisi!' });
        }

        try {
            const response = await axios.get(`https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${encodeURIComponent(url)}&quality=720&server=auto`);
            res.status(200).json({
                status: true,
                result: response.data.result || response.data
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: 'Gagal mengambil data ytmp4',
                message: error.message
            });
        }
    });

    // Endpoint YouTube to MP3
    app.get('/download/ytmp3', async (req, res) => {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ status: false, error: 'Parameter url wajib diisi!' });
        }

        try {
            const response = await axios.get(`https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(url)}&quality=128kbps&server=auto`);
            res.status(200).json({
                status: true,
                result: response.data.result || response.data
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: 'Gagal mengambil data ytmp3',
                message: error.message
            });
        }
    });
};