module.exports = function (app) {
  app.get('/download/likee', async (req, res) => {
    try {
      const { url } = req.query;

      if (!url) {
        return res.status(400).json({ status: false, error: 'Parameter url wajib diisi.' });
      }

      const response = await fetch(`https://fastrestapis.fasturl.cloud/downup/likeedown?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!data || !data.result) {
        return res.status(502).json({ status: false, error: 'Data tidak ditemukan atau API upstream gagal.' });
      }

      res.status(200).json({
        status: true,
        result: data.result
      });
    } catch (error) {
      res.status(500).json({ status: false, error: `Internal Server Error: ${error.message}` });
    }
  });
};