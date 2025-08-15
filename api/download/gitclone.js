const fetch = require("node-fetch");

async function gitClone(urls) {
    let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
    try {
        let [, user, repo] = urls.match(regex) || [];
        if (!user || !repo) throw new Error("Invalid GitHub URL");

        repo = repo.replace(/.git$/, '');
        let apiUrl = `https://api.github.com/repos/${user}/${repo}/zipball`;

        const response = await fetch(apiUrl, { method: 'HEAD' });
        const contentDisposition = response.headers.get('content-disposition');
        if (!contentDisposition) throw new Error("Cannot fetch filename from GitHub");

        const filenameMatch = contentDisposition.match(/attachment; filename=(.*)/);
        if (!filenameMatch) throw new Error("Cannot extract filename from headers");

        return {
            download: apiUrl,
            filename: filenameMatch[1]
        };
    } catch (err) {
        throw err;
    }
}

module.exports = function (app) {
    app.get('/download/github', async (req, res) => {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ status: false, error: 'Url is required' });
        }

        try {
            const results = await gitClone(url);
            res.status(200).json({
                status: true,
                result: results
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}