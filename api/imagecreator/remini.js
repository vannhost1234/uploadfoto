const axios = require('axios');
const FormData = require('form-data');
const { fromBuffer } = require('file-type');
const qs = require('qs');
const https = require('https');

// Fungsi bantu untuk ambil buffer dari URL
async function getBuffer(url) {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(res.data, 'binary');
}

const tool = ['removebg', 'enhance', 'upscale', 'restore', 'colorize'];

const pxpic = {
    upload: async (buffer) => {
        const { ext, mime } = (await fromBuffer(buffer)) || {};
        const fileName = `${Date.now()}.${ext}`;
        const folder = "uploads";

        const signed = await axios.post("https://pxpic.com/getSignedUrl", { folder, fileName }, {
            headers: { "Content-Type": "application/json" },
        });

        const { presignedUrl } = signed.data;

        await axios.put(presignedUrl, buffer, {
            headers: { "Content-Type": mime }
        });

        const cdnDomain = "https://files.fotoenhancer.com/uploads/";
        return cdnDomain + fileName;
    },

    create: async (buffer, tools) => {
        if (!tool.includes(tools)) {
            throw new Error(`Pilih salah satu dari tools ini: ${tool.join(', ')}`);
        }

        const imageUrl = await pxpic.upload(buffer);

        const data = qs.stringify({
            imageUrl,
            targetFormat: 'png',
            needCompress: 'no',
            imageQuality: '100',
            compressLevel: '6',
            fileOriginalExtension: 'png',
            aiFunction: tools,
            upscalingLevel: ''
        });

        const response = await axios.post('https://pxpic.com/callAiFunction', data, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept-Language': 'id-ID'
            }
        });

        return response.data;
    }
};

module.exports = function (app) {

    app.get('/imagecreator/removebg', async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, error: 'URL gambar wajib diisi.' });

        try {
            const buffer = await getBuffer(url);
            const result = await pxpic.create(buffer, 'removebg');
            res.status(200).json({ status: true, result: result.resultImageUrl });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });

    app.get('/imagecreator/remini', async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, error: 'URL gambar wajib diisi.' });

        try {
            const buffer = await getBuffer(url);
            const result = await pxpic.create(buffer, 'enhance');
            res.status(200).json({ status: true, result: result.resultImageUrl });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });

    app.get('/imagecreator/upscale', async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, error: 'URL gambar wajib diisi.' });

        try {
            const buffer = await getBuffer(url);
            const result = await pxpic.create(buffer, 'upscale');
            res.status(200).json({ status: true, result: result.resultImageUrl });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });

    app.get('/imagecreator/colorize', async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, error: 'URL gambar wajib diisi.' });

        try {
            const buffer = await getBuffer(url);
            const result = await pxpic.create(buffer, 'colorize');
            res.status(200).json({ status: true, result: result.resultImageUrl });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};