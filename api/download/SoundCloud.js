module.exports = function (app) {
    app.get('/download/soundcloud', async (req, res) => {
        try {
            const { url } = req.query;

            if (!url) {
                return res.status(400).json({ status: false, error: 'Url is required' });
            }

            // Panggil API eksternal untuk download SoundCloud
            const results = await global.fetchJson(`https://fastrestapis.fasturl.cloud/downup/soundclouddown?url=${encodeURIComponent(url)}`);

            res.status(200).json({
                status: true,
                result: results.result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}