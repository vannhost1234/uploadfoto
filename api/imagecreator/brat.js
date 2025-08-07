const axios = require('axios');

// Fungsi bantu untuk ambil buffer
async function getBuffer(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

module.exports = function (app) {

    // 🔤 Gambar Brat
    app.get('/imagecreator/brat', async (req, res) => {
        try {
            const { text } = req.query;
            if (!text) return res.status(400).json({ status: false, error: 'Parameter text wajib diisi.' });

            const imageBuffer = await getBuffer(`https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(text)}`);
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': imageBuffer.length,
            });
            res.end(imageBuffer);
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });

    // 🎞️ Video Brat (Animated)
    app.get('/imagecreator/bratvideo', async (req, res) => {
        try {
            const { text } = req.query;
            if (!text) return res.status(400).json({ status: false, error: 'Parameter text wajib diisi.' });

            const videoBuffer = await getBuffer(`https://skyzxu-brat.hf.space/brat-animated?text=${encodeURIComponent(text)}`);
            res.writeHead(200, {
                'Content-Type': 'video/mp4',
                'Content-Length': videoBuffer.length,
            });
            res.end(videoBuffer);
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};