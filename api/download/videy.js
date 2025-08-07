function videy(url) {
  try {
    let id = url.split("id=")[1];
    if (!id || id.length < 9) throw new Error("ID video tidak valid.");

    let typ = '.mp4';
    if (id.length === 9 && id[8] === '2') {
      typ = '.mov';
    }

    return `https://cdn.videy.co/${id}${typ}`;
  } catch (error) {
    throw new Error('Gagal memproses URL: ' + error.message);
  }
}

module.exports = function (app) {
  app.get('/download/videy', async (req, res) => {
    try {
      const { url } = req.query;

      if (!url) {
        return res.status(400).json({ status: false, error: 'Parameter url wajib diisi.' });
      }

      const result = videy(url);

      res.status(200).json({
        status: true,
        result
      });

    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};