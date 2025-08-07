const axios = require('axios');
const cheerio = require('cheerio');

async function capcutdl(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);

        const videoSrc = $('video.player-o3g3Ag').attr('src');
        const posterSrc = $('video.player-o3g3Ag').attr('poster');
        const title = $('h1.template-title').text().trim();
        const actionsDetail = $('p.actions-detail').text().trim();

        let date = null, uses = null, likes = null;
        if (actionsDetail.includes(',')) {
            [date, uses, likes] = actionsDetail.split(',').map(item => item.trim());
        }

        const authorAvatar = $('span.lv-avatar-image img').attr('src');
        const authorName = $('span.lv-avatar-image img').attr('alt');

        if (!videoSrc) throw new Error('Video tidak ditemukan.');
        if (!posterSrc) throw new Error('Poster video tidak ditemukan.');

        return {
            title: title || 'Untitled',
            date: date || null,
            pengguna: uses || null,
            likes: likes || null,
            author: {
                name: authorName || 'Unknown',
                avatarUrl: authorAvatar || null
            },
            videoUrl: videoSrc,
            posterUrl: posterSrc
        };
    } catch (error) {
        throw new Error('Gagal mengambil data CapCut: ' + error.message);
    }
}

module.exports = function (app) {
    app.get('/download/capcut', async (req, res) => {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ status: false, error: 'Parameter url wajib diisi.' });
        }

        try {
            const result = await capcutdl(url);
            if (!result) {
                return res.status(404).json({ status: false, error: 'Data tidak ditemukan atau tidak valid.' });
            }
            res.status(200).json({ status: true, result });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};