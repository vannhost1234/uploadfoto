const fetch = require('node-fetch');

module.exports = function (app) {

  app.get('/cloudflare/add-subdomain', async (req, res) => {
  const { subdomain, content, zoneid, token, domain, type, proxied } = req.query;

  if (!subdomain || !content || !zoneid || !token || !domain) {
    return res.status(400).json({
      status: false,
      error: "Parameter tidak lengkap. Wajib: subdomain, content, zoneid, token, domain"
    });
  }

  // Default type record
  const recordType = type ? type.toUpperCase() : "A";

  // Default proxied → false, bisa override dengan 'true' di query
  const proxyStatus = proxied && proxied.toLowerCase() === "true";

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  try {
    // Cari record yang sudah ada
    const find = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneid}/dns_records?type=${recordType}&name=${subdomain}.${domain}`,
      { headers }
    );
    const findJson = await find.json();

    if (!findJson.success) {
      return res.status(500).json({ status: false, error: "Gagal mencari subdomain", detail: findJson.errors });
    }

    const payload = {
      type: recordType,
      name: `${subdomain}.${domain}`,
      content: content,
      ttl: 3600,
      proxied: proxyStatus
    };

    if (findJson.result.length > 0) {
      // Update record
      const recordId = findJson.result[0].id;
      const update = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneid}/dns_records/${recordId}`,
        { method: "PUT", headers, body: JSON.stringify(payload) }
      );
      const updateJson = await update.json();

      if (!updateJson.success) {
        return res.status(500).json({ status: false, error: "Gagal mengupdate subdomain", detail: updateJson.errors });
      }

      return res.status(200).json({
        status: true,
        message: "Subdomain berhasil diupdate",
        subdomain: `${subdomain}.${domain}`,
        proxied: proxyStatus,
        result: updateJson.result
      });
    } else {
      // Buat record baru
      const create = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneid}/dns_records`,
        { method: "POST", headers, body: JSON.stringify(payload) }
      );
      const createJson = await create.json();

      if (!createJson.success) {
        return res.status(500).json({ status: false, error: "Gagal menambah subdomain", detail: createJson.errors });
      }

      return res.status(200).json({
        status: true,
        message: "Subdomain berhasil ditambahkan",
        subdomain: `${subdomain}.${domain}`,
        proxied: proxyStatus,
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
  
  app.get('/cloudflare/delete-all-subdomain', async (req, res) => {
  const { zoneid, token, domain } = req.query;

  if (!zoneid || !token || !domain) {
    return res.status(400).json({
      status: false,
      error: "Parameter tidak lengkap. Wajib: zoneid, token, domain"
    });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  try {
    // Ambil semua record DNS di zone
    const find = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneid}/dns_records?per_page=100`,
      { headers }
    );
    const list = await find.json();

    if (!list.success) {
      return res.status(500).json({ status: false, error: "Gagal mengambil daftar DNS", detail: list.errors });
    }

    // Filter subdomain, buang domain utama
    const subdomains = list.result.filter(
      r => r.name !== domain && r.name.endsWith(`.${domain}`)
    );

    if (subdomains.length === 0) {
      return res.status(404).json({ status: false, error: "Tidak ada subdomain yang ditemukan" });
    }

    let deleted = [];
    for (const record of subdomains) {
      const del = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneid}/dns_records/${record.id}`,
        { method: "DELETE", headers }
      );
      const delJson = await del.json();
      if (delJson.success) {
        deleted.push(record.name);
      }
    }

    return res.status(200).json({
      status: true,
      message: "Subdomain berhasil dihapus semua",
      deleted
    });

  } catch (err) {
    return res.status(500).json({ status: false, error: "Terjadi kesalahan", detail: err.message });
  }
});

};