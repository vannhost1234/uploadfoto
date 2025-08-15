module.exports = function (app) {
    app.get('/download/ytmp4', async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, error: 'Url is required' });

        try {
            const results = await global.fetchJson(`https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${encodeURIComponent(url)}&quality=720&server=auto`);
            res.status(200).json({
                status: true,
                result: results.result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });

    app.get('/download/ytmp3', async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, error: 'Url is required' });

        try {
            const results = await global.fetchJson(`https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(url)}&quality=128kbps&server=auto`);
            res.status(200).json({
                status: true,
                result: results.result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}