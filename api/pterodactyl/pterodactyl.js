const fetch = require('node-fetch');

module.exports = function (app) {

  // ============== CREATE ADMIN ==============
  app.get('/pterodactyl/createadmin', async (req, res) => {
    const { username, domain, ptla } = req.query;

    if (!username || !domain || !ptla) {
      return res.status(400).json({
        status: false,
        error: 'Parameter tidak lengkap. Harus ada: username, domain, ptla'
      });
    }

    const email = `${username.toLowerCase()}@gmail.com`;
    const password = `${username.toLowerCase()}001`;

    const headers = {
      "Authorization": `Bearer ${ptla}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    const payload = {
      email,
      username: username.toLowerCase(),
      first_name: username,
      last_name: "Admin",
      password,
      language: "en",
      root_admin: true
    };

    try {
      const response = await fetch(`${domain}/api/application/users`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const json = await response.json();

      if (!json?.attributes?.id) {
        return res.status(500).json({
          status: false,
          error: "Gagal membuat admin",
          detail: json
        });
      }

      return res.status(200).json({
        status: true,
        message: "✅ Admin berhasil dibuat",
        panel: domain,
        email,
        username,
        password,
        admin_id: json.attributes.id
      });

    } catch (err) {
      return res.status(500).json({
        status: false,
        error: "❌ Terjadi kesalahan saat request",
        detail: err.message
      });
    }
  });

  // ============== CREATE SERVER ==============
  app.get('/pterodactyl/create', async (req, res) => {
    const { username, ram, eggid, nestid, loc, domain, ptla } = req.query;

    if (!username || !ram || !eggid || !nestid || !loc || !domain || !ptla) {
      return res.status(400).json({
        status: false,
        error: "Parameter tidak lengkap. Wajib: username, ram, eggid, nestid, loc, domain, ptla"
      });
    }

    const ramMapping = {
      "1024": { ram: "1000", disk: "1000", cpu: "40" },
      "2048": { ram: "2000", disk: "1000", cpu: "60" },
      "3072": { ram: "3000", disk: "2000", cpu: "80" },
      "4096": { ram: "4000", disk: "2000", cpu: "100" },
      "5120": { ram: "5000", disk: "3000", cpu: "120" },
      "6144": { ram: "6000", disk: "3000", cpu: "140" },
      "7168": { ram: "7000", disk: "4000", cpu: "160" },
      "8192": { ram: "8000", disk: "4000", cpu: "180" },
      "9216": { ram: "9000", disk: "5000", cpu: "200" },
      "10240": { ram: "10000", disk: "5000", cpu: "220" },
      "0": { ram: "0", disk: "0", cpu: "0" }
    };

    const spec = ramMapping[ram];
    if (!spec) {
      return res.status(400).json({ status: false, error: "RAM tidak valid" });
    }

    const email = `${username.toLowerCase()}@gmail.com`;
    const password = `${username.toLowerCase()}001`;
    const name = `${username.charAt(0).toUpperCase() + username.slice(1)} Server`;

    const headers = {
      Authorization: `Bearer ${ptla}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    try {
      // Cek auth token
      const checkAuth = await fetch(`${domain}/api/application/users`, { headers });
      if (checkAuth.status === 401) {
        return res.status(401).json({ status: false, error: "Token Pterodactyl tidak valid atau expired (401)" });
      }

      // Buat user dulu
      const userPayload = {
        email,
        username: username.toLowerCase(),
        first_name: username,
        last_name: "Skyzee",
        password,
        language: "en"
      };

      const userRes = await fetch(`${domain}/api/application/users`, {
        method: "POST",
        headers,
        body: JSON.stringify(userPayload)
      });

      const userJson = await userRes.json();
      if (!userRes.ok || !userJson?.attributes?.id) {
        return res.status(500).json({ status: false, error: "Gagal membuat user", detail: userJson });
      }

      const userId = userJson.attributes.id;

      // Ambil data egg
      const eggRes = await fetch(`${domain}/api/application/nests/${nestid}/eggs/${eggid}`, { headers });
      const eggJson = await eggRes.json();

      if (!eggRes.ok || !eggJson?.attributes) {
        return res.status(500).json({ status: false, error: "Gagal mengambil data egg", detail: eggJson });
      }

      const startup = eggJson.attributes.startup || "npm start";
      const docker = eggJson.attributes.docker_image || "ghcr.io/parkervcp/yolks:nodejs_21";

      // Buat server
      const serverPayload = {
        name,
        user: userId,
        egg: parseInt(eggid),
        docker_image: docker,
        startup,
        limits: {
          memory: parseInt(spec.ram),
          swap: 0,
          disk: parseInt(spec.disk),
          io: 500,
          cpu: parseInt(spec.cpu)
        },
        feature_limits: {
          databases: 2,
          backups: 2,
          allocations: 1
        },
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start"
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: []
        },
        start_on_completion: true
      };

      const serverRes = await fetch(`${domain}/api/application/servers`, {
        method: "POST",
        headers,
        body: JSON.stringify(serverPayload)
      });

      const serverJson = await serverRes.json();
      if (!serverRes.ok || !serverJson?.attributes?.id) {
        return res.status(500).json({ status: false, error: "Gagal membuat server", detail: serverJson });
      }

      return res.status(200).json({
        status: true,
        message: "✅ Server berhasil dibuat!",
        panel: domain,
        user: username,
        pass: password,
        server_id: serverJson.attributes.id
      });

    } catch (err) {
      return res.status(500).json({ status: false, error: "❌ Terjadi kesalahan saat memproses", detail: err.message });
    }
  });

  // ============== DELETE SERVER ==============
  app.get('/pterodactyl/deleteserver', async (req, res) => {
    const { idserver, domain, ptla } = req.query;

    if (!idserver || !domain || !ptla) {
      return res.status(400).json({
        status: false,
        error: 'Parameter tidak lengkap. Wajib: idserver, domain, ptla'
      });
    }

    const headers = {
      "Authorization": `Bearer ${ptla}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    try {
      const response = await fetch(`${domain}/api/application/servers/${idserver}`, {
        method: "DELETE",
        headers
      });

      if (response.status === 204) {
        return res.json({ status: true, message: `Server ID ${idserver} berhasil dihapus.` });
      } else {
        const errorData = await response.json();
        return res.json({
          status: false,
          error: "Gagal menghapus server.",
          detail: errorData
        });
      }

    } catch (err) {
      return res.json({
        status: false,
        error: "Terjadi kesalahan saat menghapus server.",
        detail: err.message
      });
    }
  });

  // ============== DELETE USER ==============
  app.get('/pterodactyl/deleteuser', async (req, res) => {
    const { iduser, domain, ptla } = req.query;

    if (!iduser || !domain || !ptla) {
      return res.status(400).json({
        status: false,
        error: 'Parameter tidak lengkap. Wajib: iduser, domain, ptla'
      });
    }

    const headers = {
      "Authorization": `Bearer ${ptla}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    try {
      const response = await fetch(`${domain}/api/application/users/${iduser}`, {
        method: "DELETE",
        headers
      });

      if (response.status === 204) {
        return res.json({
          status: true,
          message: `User ID ${iduser} berhasil dihapus.`
        });
      } else {
        const errorData = await response.json();
        return res.json({
          status: false,
          error: 'Gagal menghapus user',
          detail: errorData
        });
      }

    } catch (err) {
      return res.json({
        status: false,
        error: 'Terjadi kesalahan saat menghapus user',
        detail: err.message
      });
    }
  });

  // ============== LIST PANEL ==============
  app.get('/pterodactyl/listpanel', async (req, res) => {
    const { eggid, nestid, loc, domain, ptla } = req.query;

    if (!domain || !ptla) {
      return res.status(400).json({ status: false, error: 'Parameter domain & ptla wajib diisi' });
    }

    const headers = {
      "Authorization": `Bearer ${ptla}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    try {
      const response = await fetch(`${domain}/api/application/servers`, { headers });
      const data = await response.json();

      if (!data || !data.data) {
        return res.status(500).json({ status: false, error: "Gagal mengambil data server", detail: data });
      }

      const filtered = data.data.filter(server => {
        const attr = server.attributes;
        return (!nestid || attr.nest === parseInt(nestid)) &&
               (!eggid || attr.egg === parseInt(eggid)) &&
               (!loc || attr.location === parseInt(loc));
      });

      const result = filtered.map(srv => ({
        id: srv.attributes.id,
        name: srv.attributes.name,
        uuid: srv.attributes.uuid,
        identifier: srv.attributes.identifier,
        user: srv.attributes.user,
        limits: srv.attributes.limits,
        created_at: srv.attributes.created_at
      }));

      res.json({
        status: true,
        total: result.length,
        servers: result
      });

    } catch (err) {
      res.status(500).json({
        status: false,
        error: "Terjadi kesalahan saat mengambil list panel",
        detail: err.message
      });
    }
  });

  // ============== PEMBERSIH (DELETE ALL SERVERS) ==============
  app.get('/pterodactyl/pembersih', async (req, res) => {
    const { domain, ptla } = req.query;

    if (!domain || !ptla) {
      return res.status(400).json({
        status: false,
        error: "Parameter wajib: domain, ptla"
      });
    }

    const headers = {
      Authorization: `Bearer ${ptla}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    try {
      const response = await fetch(`${domain}/api/application/servers`, { headers });
      const data = await response.json();

      if (!data || !Array.isArray(data.data)) {
        return res.status(500).json({
          status: false,
          error: "Gagal mengambil daftar server",
          detail: data
        });
      }

      const servers = data.data;
      const total = servers.length;

      if (total === 0) {
        return res.status(200).json({
          status: true,
          message: "✅ Tidak ada server yang ditemukan panel bersih."
        });
      }

      let sukses = 0;
      let gagal = 0;
      let detailGagal = [];

      for (const server of servers) {
        const id = server.attributes.id;
        const del = await fetch(`${domain}/api/application/servers/${id}`, {
          method: "DELETE",
          headers
        });

        if (del.status === 204) {
          sukses++;
        } else {
          gagal++;
          try {
            const errJson = await del.json();
            detailGagal.push({ id, error: errJson });
          } catch {
            detailGagal.push({ id, error: "Gagal mengambil detail error" });
          }
        }
      }

      return res.status(200).json({
        status: true,
        message: "✅ Proses pembersihan selesai.",
        total_server: total,
        berhasil_dihapus: sukses,
        gagal_dihapus: gagal,
        detail_gagal: detailGagal
      });

    } catch (err) {
      return res.status(500).json({
        status: false,
        error: "❌ Terjadi kesalahan saat memproses",
        detail: err.message
      });
    }
  });

};