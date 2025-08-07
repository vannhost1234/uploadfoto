const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');

async function snackvideo(url) {
  const data = qs.stringify({
    'ic-request': 'true',
    'id': url,
    'locale': 'id',
    'ic-element-id': 'main_page_form',
    'ic-id': '1',
    'ic-target-id': 'active_container',
    'ic-trigger-id': 'main_page_form',
    'ic-current-url': '/id/how-to-download-snack-video',
    'ic-select-from-response': '#id1',
    '_method': 'POST'
  });

  const config = {
    method: 'POST',
    url: 'https://getsnackvideo.com/results',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 8.1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
      'Accept': 'text/html-partial, */*; q=0.9',
      'Accept-Language': 'id-ID',
      'Referer': 'https://getsnackvideo.com/id/how-to-download-snack-video',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-IC-Request': 'true',
      'X-HTTP-Method-Override': 'POST',
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': 'https://getsnackvideo.com'
    },
    data
  };

  try {
    const response = await axios.request(config);
    const $ = cheerio.load(response.data);
    const downloadUrl = $('.download_link.without_watermark').attr('href');
    const thumbnail = $('.img_thumb img').attr('src');

    return {
      thumbnail: thumbnail || null,
      downloadUrl: downloadUrl || null
    };
  } catch (error) {
    throw new Error('Gagal mengambil data SnackVideo: ' + error.message);
  }
}

module.exports = function (app) {
  app.get('/download/snackvideo', async (req, res) => {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ status: false, error: 'Parameter url wajib diisi.' });
    }

    try {
      const results = await snackvideo(url);
      if (!results.downloadUrl) {
        return res.status(404).json({ status: false, error: 'Download link tidak ditemukan.' });
      }

      res.status(200).json({
        status: true,
        result: results
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};