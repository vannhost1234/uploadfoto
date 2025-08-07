const fetch = require('node-fetch');
const { Client } = require('ssh2');
const crypto = require('crypto');

function generateRandomPassword(length = 10) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

module.exports = function (app) {
  app.get('/pterodactyl/installpanel', async (req, res) => {
    const { ip, pass, panel, node, ram } = req.query;
    let responded = false;

    if (!ip || !pass || !panel || !node || !ram) {
      return res.status(400).json({
        status: false,
        message: 'Parameter kurang! Wajib isi: ip, pass, panel, node, ram'
      });
    }

    const password = generateRandomPassword();
    const conn = new Client();

    const commandPanel = 'bash <(curl -s https://raw.githubusercontent.com/zerodevxc/revan/main/panel.sh)';
    const commandWings = 'bash <(curl -s https://raw.githubusercontent.com/zerodevxc/revan/main/wings.sh)';
    const commandNode = 'bash <(curl -s https://raw.githubusercontent.com/zerodevxc/revan/main/node.sh)';

    function handleOutput(label, data) {
      console.log(`[${label}]`, data.toString());
    }

    function handlePanelInput(data, stream) {
      const str = data.toString();
      if (str.includes('Input') || str.includes('Terms') || str.includes('email')) {
        stream.write('0\n\n\n1248\nAsia/Jakarta\nadmin@gmail.com\nadmin@gmail.com\nadm\nadm\nadm\n');
        stream.write(`${password}\n${panel}\ny\ny\ny\ny\nyes\nA\n\n1\n`);
      }
    }

    function handleWingsInput(data, stream) {
      const str = data.toString();
      if (str.includes('Input')) {
        stream.write(`1\ny\ny\ny\n${panel}\ny\nuser\n1248\ny\n${node}\ny\nadmin@gmail.com\ny\n`);
      }
    }

    function handleNodeInput(data, stream) {
      const str = data.toString();
      if (str.includes('revan') || str.includes('SC')) {
        stream.write('revan\n4\nSGP\nSC INSTALL PANEL BY VANN HOST 🚀\n');
        stream.write(`${node}\nNODES\n${ram}\n${ram}\n1\n`);
      }
    }

    function createNode() {
      console.log('[INFO] Creating node...');
      conn.exec(commandNode, (err, stream) => {
        if (err && !responded) {
          responded = true;
          return res.status(500).json({ status: false, message: 'Gagal menjalankan command node' });
        }

        stream.on('close', () => {
          conn.end();
          if (!responded) {
            responded = true;
            return res.status(200).json({
              status: true,
              message: '✅ Panel berhasil diinstall',
              result: {
                login: panel,
                username: 'adm',
                password,
                note: 'Tunggu 1-5 menit agar panel bisa diakses. Buat allocation di node lalu jalankan .startwings (token)'
              }
            });
          }
        }).on('data', data => handleNodeInput(data, stream))
          .stderr.on('data', data => handleOutput('NODE-ERR', data));
      });
    }

    function installWings() {
      console.log('[INFO] Installing Wings...');
      conn.exec(commandWings, (err, stream) => {
        if (err && !responded) {
          responded = true;
          return res.status(500).json({ status: false, message: 'Gagal menjalankan command wings' });
        }

        stream.on('close', () => createNode())
          .on('data', data => handleWingsInput(data, stream))
          .stderr.on('data', data => handleOutput('WINGS-ERR', data));
      });
    }

    conn.on('ready', () => {
      console.log('[SSH] Connected. Starting panel install...');
      conn.exec(commandPanel, (err, stream) => {
        if (err && !responded) {
          responded = true;
          return res.status(500).json({ status: false, message: 'Gagal menjalankan command panel' });
        }

        stream.on('close', () => installWings())
          .on('data', data => handlePanelInput(data, stream))
          .stderr.on('data', data => handleOutput('PANEL-ERR', data));
      });
    }).on('error', err => {
      if (!responded) {
        responded = true;
        return res.status(500).json({ status: false, message: 'SSH Connection failed', detail: err.message });
      }
    }).connect({
      host: ip,
      port: 22,
      username: 'root',
      password: pass
    });

    setTimeout(() => {
      if (!responded) {
        responded = true;
        conn.end();
        return res.status(408).json({ status: false, message: '⏱ Timeout: Proses terlalu lama' });
      }
    }, 120000); // 2 menit timeout
  });
  
  app.get('/pterodactyl/startwings', async (req, res) => {
  const { ip, pass, token } = req.query;
  let responded = false;

  if (!ip || !pass || !token) {
    return res.status(400).json({ status: false, message: 'Parameter kurang! Wajib isi: ip, pass, token' });
  }

  const conn = new Client();
  const command = 'bash <(curl -s https://raw.githubusercontent.com/zerodevxc/revan/main/node.sh)';

  conn.on('ready', () => {
    console.log('[STARTWINGS] SSH Connected...');
    conn.exec(command, (err, stream) => {
      if (err && !responded) {
        responded = true;
        return res.status(500).json({ status: false, message: 'Gagal menjalankan command start wings' });
      }

      stream.on('close', () => {
        conn.end();
        if (!responded) {
          responded = true;
          return res.status(200).json({ status: true, message: '✅ Wings berhasil dikonfigurasi dan dijalankan!' });
        }
      }).on('data', (data) => {
        stream.write('revan\n');
        stream.write('3\n');
        stream.write(`${token}\n`);
        console.log('[WINGS-DATA]', data.toString());
      }).stderr.on('data', data => console.error('[WINGS-ERR]', data.toString()));
    });
  }).on('error', err => {
    if (!responded) {
      responded = true;
      return res.status(500).json({ status: false, message: 'SSH Connection failed', detail: err.message });
    }
  }).connect({ host: ip, port: 22, username: 'root', password: pass });
});
  
  app.get('/pterodactyl/uninstallpanel', async (req, res) => {
  const { ip, pass } = req.query;
  let responded = false;

  if (!ip || !pass) {
    return res.status(400).json({ status: false, message: 'Parameter kurang! Wajib isi: ip, pass' });
  }

  const conn = new Client();
  const command = 'bash <(curl -s https://raw.githubusercontent.com/zerodevxc/revan/main/uninstall.sh)';

  conn.on('ready', () => {
    console.log('[UNINSTALL] SSH Connected...');
    conn.exec(command, (err, stream) => {
      if (err && !responded) {
        responded = true;
        return res.status(500).json({ status: false, message: 'Gagal menjalankan uninstall command' });
      }

      stream.on('close', () => {
        conn.end();
        if (!responded) {
          responded = true;
          return res.status(200).json({ status: true, message: '✅ Panel berhasil dihapus!' });
        }
      }).on('data', (data) => {
        stream.write('revan\n');
        stream.write('5\n');
        console.log('[UNINSTALL-DATA]', data.toString());
      }).stderr.on('data', data => console.error('[UNINSTALL-ERR]', data.toString()));
    });
  }).on('error', err => {
    if (!responded) {
      responded = true;
      return res.status(500).json({ status: false, message: 'SSH Connection failed', detail: err.message });
    }
  }).connect({ host: ip, port: 22, username: 'root', password: pass });
});

  app.get('/pterodactyl/createadmin', async (req, res) => {
  const { username, domain, ptla } = req.query;

  if (!username || !domain || !ptla) {
    return res.status(400).json({
      status: false,
      message: 'Parameter tidak lengkap. Harus ada: username, domain, ptla'
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
        message: "Gagal membuat admin",
        detail: json
      });
    }

    return res.status(200).json({
      status: true,
      message: "✅ Admin berhasil dibuat",
      result: {
        username: username.toLowerCase(),
        password,
        domain,
        email,
        user_id: json.attributes.id
      }
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "❌ Terjadi kesalahan saat request",
      detail: err.message
    });
  }
});

  // ✅ FIXED CREATE SERVER
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
    if (!spec) return res.status(400).json({ status: false, error: "RAM tidak valid" });

    const email = `${username.toLowerCase()}@gmail.com`;
    const password = `${username.toLowerCase()}001`;
    const name = `${username.charAt(0).toUpperCase() + username.slice(1)} Server`;

    const headers = {
      Authorization: `Bearer ${ptla}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    try {
      // Cek apakah user sudah ada
      const userListRes = await fetch(`${domain}/api/application/users`, { headers });
      const userListJson = await userListRes.json();
      const existingUser = userListJson?.data?.find(u => u.attributes.email === email);
      let userId;

      if (existingUser) {
        userId = existingUser.attributes.id;
      } else {
        const userPayload = {
          email,
          username: username.toLowerCase(),
          first_name: username,
          last_name: "VannHost",
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

        userId = userJson.attributes.id;
      }

      const eggRes = await fetch(`${domain}/api/application/nests/${nestid}/eggs/${eggid}?include=variables`, { headers });
      const eggJson = await eggRes.json();

      if (!eggRes.ok || !eggJson?.attributes) {
        return res.status(500).json({ status: false, error: "Gagal mengambil data egg", detail: eggJson });
      }

      const startup = eggJson.attributes.startup || "npm start";
      const docker = eggJson.attributes.docker_image || "ghcr.io/parkervcp/yolks:nodejs_21";

      const env = {};
      const variables = eggJson?.attributes?.relationships?.variables?.data || [];
      for (const variable of variables) {
        env[variable.attributes.env_variable] = variable.attributes.default_value || "";
      }

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
        environment: env,
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

      // ✅ PERBAIKAN PENTING: Tambahkan result untuk client
      return res.status(200).json({
        status: true,
        result: {
          username: username,
          password: password,
          domain: domain
        }
      });

    } catch (err) {
      return res.status(500).json({
        status: false,
        error: "❌ Terjadi kesalahan saat memproses",
        detail: err.message
      });
    }
  });

  // Delete Server
  app.get('/pterodactyl/deleteserver', async (req, res) => {
    const { idserver, domain, ptla } = req.query;

    if (!idserver || !domain || !ptla) {
      return res.status(400).json({ status: false, error: 'Parameter tidak lengkap. Wajib: idserver, domain, ptla' });
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
        return res.status(200).json({
          status: true,
          message: `✅ Server dengan ID ${idserver} berhasil dihapus.`
        });
      } else {
        const errorData = await response.json();
        return res.status(response.status).json({
          status: false,
          error: "Gagal menghapus server",
          detail: errorData
        });
      }

    } catch (err) {
      return res.status(500).json({
        status: false,
        error: "❌ Terjadi kesalahan saat menghapus server",
        detail: err.message
      });
    }
  });

  // Delete User
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
        return res.status(200).json({
          status: true,
          message: `✅ User ID ${iduser} berhasil dihapus.`
        });
      } else {
        const errorData = await response.json();
        return res.status(response.status).json({
          status: false,
          error: 'Gagal menghapus user',
          detail: errorData
        });
      }

    } catch (err) {
      return res.status(500).json({
        status: false,
        error: '❌ Terjadi kesalahan saat menghapus user',
        detail: err.message
      });
    }
  });

  // List Panel
  app.get('/pterodactyl/listpanel', async (req, res) => {
    const { eggid, nestid, loc, domain, ptla } = req.query;

    if (!domain || !ptla) {
      return res.status(400).json({
        status: false,
        error: 'Parameter wajib: domain & ptla'
      });
    }

    const headers = {
      Authorization: `Bearer ${ptla}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    try {
      const url = `${domain}/api/application/servers`;
      const response = await fetch(url, { headers });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          status: false,
          error: `Gagal mengambil data dari panel: ${response.statusText}`,
          detail: errorText
        });
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.data)) {
        return res.status(500).json({
          status: false,
          error: "Respon tidak sesuai format yang diharapkan",
          detail: data
        });
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

      return res.status(200).json({
        status: true,
        total: result.length,
        servers: result
      });

    } catch (err) {
      return res.status(500).json({
        status: false,
        error: "Terjadi kesalahan saat mengambil list panel",
        detail: err.message
      });
    }
  });

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
      // 1. Ambil semua server
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

      // 2. Hapus satu per satu
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

      // 3. Balikkan hasil
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