const fetch = require('node-fetch');

module.exports = function (app) {

  app.get('/cloudflare/add-subdomain', async (req, res) => {
  const { subdomain, content, zoneid, token, domain, type } = req.query;

  if (!subdomain || !content || !zoneid || !token || !domain) {
    return res.status(400).json({
      status: false,
      error: "Parameter tidak lengkap. Wajib: subdomain, content, zoneid, token, domain"
    });
  }

  // Default type record jika tidak disertakan
  const recordType = type ? type.toUpperCase() : "A";

  // Header untuk Cloudflare API
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  try {
    // Cari dulu record tipe tertentu untuk subdomain ini
    const find = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneid}/dns_records?type=${recordType}&name=${subdomain}.${domain}`, { headers });
    const findJson = await find.json();

    if (!findJson.success) {
      return res.status(500).json({ status: false, error: "Gagal mencari subdomain", detail: findJson.errors });
    }

    // Payload dasar
    const payload = {
      type: recordType,
      name: `${subdomain}.${domain}`,
      content: content,
      ttl: 3600,
      proxied: false
    };

    // Kalau tipe MX dan SRV biasanya ada tambahan field, kalau mau bisa extend lagi ya

    if (findJson.result.length > 0) {
      // Update jika record sudah ada
      const recordId = findJson.result[0].id;

      const update = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneid}/dns_records/${recordId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload)
      });

      const updateJson = await update.json();

      if (!updateJson.success) {
        return res.status(500).json({ status: false, error: "Gagal mengupdate subdomain", detail: updateJson.errors });
      }

      return res.status(200).json({
        status: true,
        message: "Subdomain berhasil diupdate",
        subdomain: `${subdomain}.${domain}`,
        result: updateJson.result
      });

    } else {
      // Create baru kalau belum ada
      const create = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneid}/dns_records`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const createJson = await create.json();

      if (!createJson.success) {
        return res.status(500).json({ status: false, error: "Gagal menambah subdomain", detail: createJson.errors });
      }

      return res.status(200).json({
        status: true,
        message: "Subdomain berhasil ditambahkan",
        subdomain: `${subdomain}.${domain}`,
        result: createJson.result
      });
    }

  } catch (err) {
    return res.status(500).json({ status: false, error: "Terjadi kesalahan", detail: err.message });
  }
});

  app.get('/cloudflare/delete-subdomain', async (req, res) => {
    const { subdomain, zoneid, token, domain } = req.query;

    if (!subdomain || !zoneid || !token || !domain) {
      return res.status(400).json({
        status: false,
        error: "Parameter tidak lengkap. Wajib: subdomain, zoneid, token, domain"
      });
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    try {
      const find = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneid}/dns_records?name=${subdomain}.${domain}`, { headers });
      const list = await find.json();

      if (!list.success || list.result.length === 0) {
        return res.status(404).json({ status: false, error: "Subdomain tidak ditemukan" });
      }

      const recordId = list.result[0].id;

      const del = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneid}/dns_records/${recordId}`, {
        method: "DELETE",
        headers
      });

      const delJson = await del.json();
      if (!delJson.success) {
        return res.status(500).json({ status: false, error: "Gagal menghapus subdomain", detail: delJson.errors });
      }

      return res.status(200).json({
        status: true,
        message: "Subdomain berhasil dihapus",
        subdomain: `${subdomain}.${domain}`
      });

    } catch (err) {
      return res.status(500).json({ status: false, error: "Terjadi kesalahan", detail: err.message });
    }
  });

};