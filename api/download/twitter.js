module.exports = function (app) {
    app.get('/download/twitter', async (req, res) => {
        try {
            const { url } = req.query;
            if (!url) {
                return res.status(400).json({ status: false, error: 'Url is required' });
            }

            const results = await global.fetchJson(`https://fastrestapis.fasturl.cloud/downup/twdown?url=${encodeURIComponent(url)}`);

            res.status(200).json({
                status: true,
                result: results.result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}