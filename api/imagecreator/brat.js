const axios = require("axios");

async function getBuffer(url) {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(res.data);
}

module.exports = function (app) {
    app.get('/imagecreator/brat', async (req, res) => {
        try {
            const { apikey, text } = req.query;
            if (!global.apikey || !global.apikey.includes(apikey)) {
                return res.json({ status: false, error: 'Apikey invalid' });
            }
            if (!text) return res.json({ status: false, error: 'Parameter text diperlukan' });

            const imageBuffer = await getBuffer(`https://www.bratgenerator.com/api/brat?text=${encodeURIComponent(text)}`);
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': imageBuffer.length,
            });
            res.end(imageBuffer);
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });

    app.get('/imagecreator/bratvideo', async (req, res) => {
        try {
            const { apikey, text } = req.query;
            if (!global.apikey || !global.apikey.includes(apikey)) {
                return res.json({ status: false, error: 'Apikey invalid' });
            }
            if (!text) return res.json({ status: false, error: 'Parameter text diperlukan' });

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