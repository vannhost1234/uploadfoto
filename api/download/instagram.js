const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const app = express();
const PORT = process.env.PORT || 3000;

// Fungsi utama ambil data
async function igdl(url) {
    const data = qs.stringify({
        'q': url,
        't': 'media',
        'lang': 'en'
    });

    const config = {
        method: 'POST',
        url: 'https://instanavigation.app/api/ajaxSearch',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Referer': 'https://instanavigation.app/',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
        },
        data
    };

    const api = await axios.request(config);
    const html = api.data.data;

    const $ = cheerio.load(html);
    const thumbnail = $('.download-items__thumb img').attr('src');

    const downloadUrls = [];
    $('.download-items__btn a').each((i, el) => {
        const href = $(el).attr('href');
        if (href) downloadUrls.push(href);
    });

    const firstUrl = downloadUrls[0] || '';
    const urlParams = new URLSearchParams(firstUrl.split('?')[1] || '');
    let filename = urlParams.get('filename') || 'instagram_media';
    if (filename.endsWith('.mp4')) filename = filename.replace('.mp4', '');

    return {
        title: filename,
        thumbnail,
        downloadUrls: downloadUrls.length ? downloadUrls : ['Download URL not found']
    };
}

// Endpoint untuk ambil info & link download
app.get('/download/instagram', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, error: 'URL is required' });

    try {
        const result = await igdl(url);
        res.json({ status: true, result });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

// Endpoint download langsung (proxy file)
app.get('/download/instagram/file', async (req, res) => {
    const { url, filename } = req.query;
    if (!url) return res.status(400).json({ status: false, error: 'Download URL is required' });

    try {
        const response = await axios.get(url, { responseType: 'stream' });
        const name = filename || 'instagram_file';

        res.setHeader('Content-Disposition', `attachment; filename="${name}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');
        response.data.pipe(res);
    } catch (err) {
        res.status(500).json({ status: false, error: 'Failed to download file' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});