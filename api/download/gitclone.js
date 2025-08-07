const fetch = require("node-fetch");

async function gitClone(urls) {
    const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;

    try {
        let [, user, repo] = urls.match(regex) || [];
        if (!user || !repo) throw new Error("URL GitHub tidak valid.");

        repo = repo.replace(/\.git$/, '');
        const apiUrl = `https://api.github.com/repos/${user}/${repo}/zipball`;

        const headResponse = await fetch(apiUrl, { method: 'HEAD' });
        const contentDisposition = headResponse.headers.get('content-disposition');

        if (!contentDisposition) {
            throw new Error('Tidak bisa mengambil nama file dari GitHub API.');
        }

        const filename = contentDisposition.match(/attachment; filename="?([^"]+)"?/)[1];

        return {
            download: apiUrl,
            filename
        };
    } catch (err) {
        throw new Error('Gagal mengambil data GitHub: ' + err.message);
    }
}

module.exports = function (app) {
    app.get('/download/github', async (req, res) => {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ status: false, error: 'Parameter url wajib diisi.' });
        }

        try {
            const result = await gitClone(url);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};