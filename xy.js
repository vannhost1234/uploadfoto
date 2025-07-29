require('./settings')
require('./index')
require('./src/message')
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const {
  Client
} = require('ssh2');
const {
  exec
} = require('child_process');
const Tiktok = require("@tobyg74/tiktok-api-dl");
const {
  igdl
} = require('btch-downloader');
const yts = require('yt-search');
const ffmpeg = require('fluent-ffmpeg');
const pino = require("pino");
const ytdl = require('@distube/ytdl-core');
const {
  UploadFileUgu
} = require('./src/lib/uploader.js');
const {
  formatLog
} = require('./src/lib/logger')
const pinterest = require('./src/lib/pinterest');
//const { createCanvas, registerFont } = require('canvas');

module.exports = async (xy, bot, chatUpdate, store) => {
  try {
    const thumbnailPath = path.join(__dirname, "src/image/thumbnail.jpg");
    const paket = path.join(__dirname, 'src/image/paket.jpg');

    const warnFile = path.join(__dirname, "./src/database/warns.json");



    const seller = JSON.parse(fs.readFileSync('./src/database/seller.json'));
    const sellerPath = './src/database/seller.json';
    const owners = JSON.parse(fs.readFileSync('./owner.json', 'utf8'));
    const db_respon_list = JSON.parse(fs.readFileSync('./src/database/list.json'));
    const tokenPath = path.join(__dirname, './src/database/token.json');

    const {
      addResponList1,
      delResponList1,
      isAlreadyResponList1,
      isAlreadyResponList1Group,
      sendResponList1,
      updateResponList1,
      getDataResponList1
    } = require('./src/lib/addlist');
    const {
      startWhatsAppSession,
      sessions,
      restoreWhatsAppSessions
    } = require("./src/lib/connectwa")

    async function getBuffer(url) {
      const res = await axios.get(url, {
        responseType: "arraybuffer"
      });
      return Buffer.from(res.data);
    }



    function readWarnDB() {
      if (!fs.existsSync(warnFile)) return {};
      return JSON.parse(fs.readFileSync(warnFile, "utf8"));
    }

    function saveWarnDB(data) {
      fs.writeFileSync(warnFile, JSON.stringify(data, null, 2));
    }

    let warnDB = readWarnDB();
    let pendingWarns = new Map(); // Menyimpan pesan peringatan yang bisa dibatalkan

    const sleep = async (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    function generateReadableString(length) {
      const words = ["sky", "cloud", "wind", "fire", "storm", "light", "wave", "stone", "shadow", "earth"];
      const randomWord = words[Math.floor(Math.random() * words.length)];
      const randomNumber = Math.floor(100 + Math.random() * 900); // 3-digit number
      return randomWord + randomNumber;
    }

    const prefix = '/';
    const userId = xy.message.from.id;
    const chatId = xy.message.chat.id;
    const message = xy.message.text;
    const userName = xy.message.from.first_name;

    const body = xy.message.text || xy.message.caption ||
      (xy.message.document ? xy.message.document.file_name : '') ||
      (xy.message.video ? xy.message.video.file_name : '') ||
      (xy.message.audio ? xy.message.audio.file_name : '') ||
      (xy.message.voice ? '[Voice Message]' : '') ||
      (xy.message.sticker ? '[Sticker]' : '') ||
      (xy.message.animation ? '[GIF]' : '');

    const command = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase() : "";
    const args = body.trim().split(/ +/).slice(1);
    const q = text = args.join(" ");


    const reply = (teks) => {
      xy.telegram.sendMessage(chatId, teks);
    };


    const isCmd = body.startsWith(prefix)
    if (!xy.telegram.botInfo) {
      xy.telegram.botInfo = await xy.telegram.getMe();
    }

    const isOwner = owners.includes(String(xy.message.from.id));
    const now = Date.now();

    const validSellers = seller.filter(item => item.expiresAt > now);

if (validSellers.length !== seller.length) {
  fs.writeFileSync(sellerPath, JSON.stringify(validSellers, null, 2));
}

const isSeller = validSellers.some(item =>
  item.id === String(xy.message.from.id)
);
    const isGroup = xy.message.chat.type.includes("group");

    const groupName = isGroup ? xy.message.chat.title : "";
    const groupId = isGroup ? xy.message.chat.id : "";
    const participants = isGroup ? await xy.getChatAdministrators() : [];
    const groupAdmins = participants.map(admin => admin.user.id);
    const isBotGroupAdmins = groupAdmins.includes(xy.telegram.botInfo.id) || false;
    const isGroupAdmins = groupAdmins.includes(xy.message.from.id) || false;

    if (isCmd) {
      console.log(formatLog(command, args, userName, userId, isGroup, groupName, groupId));
    }
    switch (command) {

      case "tes":
        xy.telegram.sendMessage(chatId, "Pesan yang dikirim");
        break

      case "restart":
        if (!isOwner) return reply(mess.owner);

        reply("🔄 Restarting xy.telegram...");
        await sleep(3000);
        reply('Sukses')
        await sleep(3000);
        process.exit(1); // Keluar dari terminal, jika pakai PM2 akan restart otomatis
        break;

      case "shutdown":
        if (!isOwner) return reply(mess.owner);

        reply("⚠️ Shutting down xy.telegram...");
        await sleep(3000);
        reply('Sukses')
        await sleep(3000);
        process.exit(); // Keluar dari terminal tanpa restart otomatis
        break;

      case "delusr":
      case "deladmin": {
        if (!isOwner) return reply(mess.owner);
        if (!text || !/^\d+$/.test(text))
          return reply(`*Format salah!*

Penggunaan:
${prefix + command} user_id

Contoh:
${prefix + command} 1`);

        let userId = text; // ID user yang akan dihapus

        let f = await fetch(`${global.domain}/api/application/users/${userId}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${global.plta}`
          }
        });

        let data = {};
        let textResponse = await f.text(); // Ambil respons sebagai teks

        if (textResponse) {
          try {
            data = JSON.parse(textResponse); // Parse JSON jika ada isinya
          } catch (err) {
            return reply(`Gagal memproses respons API: ${err.message}`);
          }
        }

        if (data.errors) {
          return reply(`Gagal menghapus user: ${JSON.stringify(data.errors[0], null, 2)}`);
        }

        reply(`✅ User dengan ID ${userId} berhasil dihapus.`);
      }
      break;

      case "delsrv": {
        if (!isOwner) return reply(mess.owner);

        if (!text)
          return reply(`*Format salah!*

Penggunaan:
${prefix + command} server_id

Contoh:
${prefix + command} 1`);

        let serverId = text; // ID server yang akan dihapus
        console.log(serverId)

        let f = await fetch(`${global.domain}/api/application/servers/${serverId}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${global.plta}`
          }
        });

        let data = {};
        let textResponse = await f.text(); // Ambil respons sebagai teks

        if (textResponse) {
          try {
            data = JSON.parse(textResponse); // Parse JSON jika ada isinya
          } catch (err) {
            return reply(`Gagal memproses respons API: ${err.message}`);
          }
        }

        if (data.errors) {
          return reply(`Gagal menghapus server: ${JSON.stringify(data.errors[0], null, 2)}`);
        }

        reply(`✅ Server dengan ID ${serverId} berhasil dihapus.`);
      }
      break;

      case 'addseller':
        if (!isOwner) return reply(mess.owner);
        if (!text) {
          return reply('Penggunaan yang benar: \n/addseller ID_Telegram,durasi,waktu\n\nWaktu bisa menit,jam,hari dan bulan\n\nContoh: /addseller 272818828,1,jam');
        }

        let args = text.split(',');
        if (args.length !== 3) {
          return reply('Format salah! Gunakan: /addseller ID_Telegram,durasi,waktu\n\nWaktu bisa menit,jam,hari dan bulan\n\nContoh: /addseller 272818828,1,jam');
        }

        let userID = args[0];
        let duration = parseInt(args[1]);
        let timeUnit = args[2].toLowerCase();

        if (isNaN(duration) || duration <= 0) {
          return reply('Durasi harus berupa angka yang valid!');
        }

        let timeMultiplier = {
          'menit': 60 * 1000,
          'jam': 60 * 60 * 1000,
          'hari': 24 * 60 * 60 * 1000,
          'bulan': 30 * 24 * 60 * 60 * 1000
        };

        if (!timeMultiplier[timeUnit]) {
          return reply('Format waktu tidak valid! Gunakan: menit, jam, hari, atau bulan.');
        }

        let expiryTime = Date.now() + duration * timeMultiplier[timeUnit];

        let existingSeller = seller.find(s => s.id === userID);
        if (existingSeller) {
          return reply(`ID Telegram ${userID} sudah menjadi seller.`);
        }

        seller.push({
          id: userID,
          expiresAt: expiryTime
        });
        fs.writeFileSync('./src/database/seller.json', JSON.stringify(seller, null, 2));

        return reply(`ID Telegram ${userID} telah ditambahkan ke daftar seller selama ${duration} ${timeUnit}.`);

        break;

      case 'delseller':
        if (!isOwner) return reply(mess.owner);
        if (!text) {
          return reply('Penggunaan yang benar: \n/delseller ID_Telegram\n\nContoh: /delseller 1234567890');
        }

        let index = seller.findIndex(s => s.id === text);
        if (index !== -1) {
          seller.splice(index, 1);
          fs.writeFileSync('./src/database/seller.json', JSON.stringify(seller, null, 2));
          return reply(`ID Telegram ${text} telah dihapus dari daftar seller.`);
        } else {
          return reply(`ID Telegram ${text} tidak ditemukan dalam daftar seller.`);
        }
        break;

      case 'listseller':
        if (!isOwner) return reply(mess.owner);
        if (seller.length === 0) {
          return reply('Belum ada seller yang terdaftar.');
        }

        let sellerList = [];

        for (let s of seller) {
          let remainingTime = s.expiresAt - Date.now();
          if (remainingTime <= 0) {
            seller = seller.filter(item => item.id !== s.id);
            fs.writeFileSync('./src/database/seller.json', JSON.stringify(seller, null, 2));
            continue;
          }

          let remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
          let remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

          let timeLeft = remainingHours > 0 ?
            `${remainingHours} jam ${remainingMinutes} menit` :
            `${remainingMinutes} menit`;

          try {
            let chat = await xy.telegram.getChat(s.id);
            let name = chat.first_name + (chat.last_name ? ' ' + chat.last_name : '');
            sellerList.push(`🆔 *ID:* ${s.id}\n👤 *Nama:* ${name}\n⏳ *Waktu Tersisa:* ${timeLeft}`);
          } catch (err) {
            sellerList.push(`🆔 *ID:* ${s.id}\n👤 *Nama:* Tidak ditemukan\n⏳ *Waktu Tersisa:* ${timeLeft}`);
          }
        }

        let message = `📜 *Daftar Seller:*\n\n${sellerList.join('\n\n')}`;
        return xy.telegram.sendMessage(xy.message.chat.id, message, {
          parse_mode: 'Markdown'
        });

        break;

      case 'addowner':
        if (!isOwner) return reply(mess.owner);
        if (!text) {
          return reply('📌 Penggunaan yang benar:\n/addowner ID_Telegram\n(ID harus berupa angka).');
        }

        if (owners.includes(text)) {
          return reply(`⚠️ ID Telegram ${text} sudah menjadi Owner.`);
        } else {
          owners.push(text);
          fs.writeFileSync('./owner.json', JSON.stringify(owners));
          return reply(`✅ ID Telegram ${text} telah ditambahkan ke daftar Owner!`);
        }
        break;

      case 'delowner':
        if (!isOwner) return reply(mess.owner);
        if (!text) {
          return reply('📌 Penggunaan:\n/delowner ID_Telegram\nContoh: /delowner 1234567890');
        }

        const index1 = owners.indexOf(text);
        if (index1 !== -1) {
          owners.splice(index1, 1);
          fs.writeFileSync('./owner.json', JSON.stringify(owners));
          return reply(`✅ ID Telegram ${text} telah dihapus dari daftar Owner.`);
        } else {
          return reply(`⚠️ ID Telegram ${text} tidak ditemukan dalam daftar Owner.`);
        }
        break;

      case 'listowner':
        if (!isOwner) return reply(mess.owner);
        if (owners.length === 0) {
          return reply('🚫 Belum ada Owner yang terdaftar.');
        }

        let ownerList = [];

        for (let id of owners) {
          try {
            let chat = await xy.telegram.getChat(id);
            let name = chat.first_name + (chat.last_name ? ' ' + chat.last_name : '');
            ownerList.push(`🆔 *ID:* ${id}\n👑 *Nama:* ${name}`);
          } catch (err) {
            ownerList.push(`🆔 *ID:* ${id}\n👑 *Nama:* Tidak ditemukan`);
          }
        }

        let message1 = `📜 *Daftar Owner:*\n\n${ownerList.join('\n\n')}`;
        return xy.telegram.sendMessage(xy.message.chat.id, message1, {
          parse_mode: 'Markdown'
        });
        break;

      case 'cekidtele':
        const replyToMessage = xy.message.reply_to_message;
        if (replyToMessage && replyToMessage.forward_from) {
          const forwardedUserId = replyToMessage.forward_from.id;
          return reply(`ID Telegram pengguna yang meneruskan pesan ini adalah: ${forwardedUserId}`);
        } else if (replyToMessage) {
          return reply('🚫 Harap gunakan pesan yang diteruskan dari orang lain. Jika mau dapatkan id orang');
        } else {
          return reply(`ID Telegram Anda adalah: ${xy.message.from.id}`);
        }
        break;

      case 'listpanel':
        if (!isOwner) return reply(mess.owner);
        let halamanPanel = parseInt(text.split(" ")[1]) || 1;

        if (halamanPanel > 25) return reply("⚠️ Maksimal hanya bisa melihat sampai halaman 25!");

        try {
          let response = await fetch(`${global.domain}/api/application/servers?page=${halamanPanel}&per_page=25`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${global.plta}`
            }
          });

          let hasil = await response.json();

          if (!response.ok) {
            return reply(`🚫 Gagal mendapatkan data. Kode error: ${response.status}`);
          }

          if (hasil.errors) {
            return reply(`⚠️ Kesalahan ditemukan: ${JSON.stringify(hasil.errors[0], null, 2)}`);
          }

          if (!hasil.data || hasil.data.length === 0) {
            return reply("📌 Tidak ada server yang terdaftar dalam sistem.");
          }

          let daftarServer = `📡 *Daftar Server yang Aktif (Halaman ${halamanPanel})* 📡\n`;
          daftarServer += "━━━━━━━━━━━━━━━━━━━━━━━\n";

          for (let server of hasil.data) {
            let info = server.attributes;
            daftarServer += `🆔 *Server ID*: \`${info.id}\`\n`;
            daftarServer += `🔹 *Nama Server*: ${info.name}\n`;
            daftarServer += "───────────────────────\n";
          }

          daftarServer += `📄 *Halaman*: ${hasil.meta.pagination.current_page}/${hasil.meta.pagination.total_pages}\n`;
          daftarServer += `📊 *Total Server Terdaftar*: ${hasil.meta.pagination.count}`;

          let buttons = [];

          if (hasil.meta.pagination.current_page < hasil.meta.pagination.total_pages && halamanPanel < 25) {
            buttons.push({
              text: "➡️ Halaman Berikutnya",
              callback_data: `listpanel ${halamanPanel + 1}`
            });
          }
          if (halamanPanel > 1) {
            buttons.unshift({
              text: "⬅️ Halaman Sebelumnya",
              callback_data: `listpanel ${halamanPanel - 1}`
            });
          }

          let sentMessage = await xy.telegram.sendMessage(chatId, daftarServer, {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: buttons.length > 0 ? [buttons] : []
            }
          });

          global.lastListPanelMessageId = sentMessage.message_id;

        } catch (err) {
          console.log("❗ Error:", err);
          reply(`⚠️ Terjadi kesalahan: ${err.message}`);
        }
        break;


      case 'listusr':
        if (!isOwner) return reply(mess.owner);
        let halamanUsr = text[1] || '1';

        try {
          let response = await fetch(`${global.domain}/api/application/users?page=${halamanUsr}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${global.plta}`
            }
          });

          let hasil = await response.json();

          if (!response.ok) {
            return reply(`❌ Gagal mengambil data. Kode error: ${response.status}`);
          }

          if (hasil.errors) {
            return reply(`⚠️ Kesalahan saat memproses permintaan: ${JSON.stringify(hasil.errors[0], null, 2)}`);
          }

          if (!hasil.data || hasil.data.length === 0) {
            return reply("📌 Tidak ada pengguna yang ditemukan.");
          }

          let daftarUser = "👥 *Daftar Pengguna Terdaftar* 👥\n";
          daftarUser += "━━━━━━━━━━━━━━━━━━━━━━━\n";

          for (let user of hasil.data) {
            let info = user.attributes;
            daftarUser += `🆔 *User ID*: \`${info.id}\`\n`;
            daftarUser += `🔸 *Username*: ${info.username}\n`;
            daftarUser += "───────────────────────\n";
          }

          daftarUser += `📄 *Halaman*: ${hasil.meta.pagination.current_page}/${hasil.meta.pagination.total_pages}\n`;
          daftarUser += `📊 *Total Pengguna*: ${hasil.meta.pagination.count}`;

          xy.telegram.sendMessage(chatId, daftarUser, {
            parse_mode: "Markdown"
          });

          if (hasil.meta.pagination.current_page < hasil.meta.pagination.total_pages) {
            xy.telegram.sendMessage(chatId, `➡️ Gunakan perintah: \`/listusr ${hasil.meta.pagination.current_page + 1}\` untuk melihat halaman berikutnya.`, {
              parse_mode: "Markdown"
            });
          }
        } catch (err) {
          console.log("❗ Error:", err);
          reply(`⚠️ Terjadi kesalahan: ${err.message}`);
        }
        break;

      case 'listadmin':
        if (!isOwner) return reply(mess.owner);
        let halamanAdmin = text[1] || '1';

        try {
          let response = await fetch(`${global.domain}/api/application/users?page=${halamanAdmin}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${global.plta}`
            }
          });

          let hasil = await response.json();

          if (!response.ok) {
            return reply(`❌ Gagal mengambil daftar admin. Kode error: ${response.status}`);
          }

          if (hasil.errors) {
            return reply(`⚠️ Terjadi kesalahan: ${JSON.stringify(hasil.errors[0], null, 2)}`);
          }

          let daftarAdmin = hasil.data.filter(user => user.attributes.root_admin === true);

          if (daftarAdmin.length === 0) {
            return reply("🚫 Tidak ada admin yang terdaftar.");
          }

          let pesanAdmin = "👑 *Daftar Administrator* 👑\n";
          pesanAdmin += "━━━━━━━━━━━━━━━━━━━━━━━\n";

          for (let admin of daftarAdmin) {
            let info = admin.attributes;
            pesanAdmin += `🆔 *Admin ID*: \`${info.id}\`\n`;
            pesanAdmin += `🔹 *Nama*: ${info.username}\n`;
            pesanAdmin += "───────────────────────\n";
          }

          pesanAdmin += `📄 *Halaman*: ${hasil.meta.pagination.current_page}/${hasil.meta.pagination.total_pages}\n`;
          pesanAdmin += `📊 *Total Admin*: ${daftarAdmin.length}`;

          xy.telegram.sendMessage(chatId, pesanAdmin, {
            parse_mode: "Markdown"
          });

          if (hasil.meta.pagination.current_page < hasil.meta.pagination.total_pages) {
            xy.telegram.sendMessage(chatId, `➡️ Gunakan perintah: \`/listadmin ${hasil.meta.pagination.current_page + 1}\` untuk melihat halaman berikutnya.`, {
              parse_mode: "Markdown"
            });
          }
        } catch (err) {
          console.log("❗ Error:", err);
          xy.telegram.sendMessage(chatId, `⚠️ Terjadi kesalahan: ${err.message}`);
        }
        break;

      case "1gb":
      case "2gb":
      case "3gb":
      case "4gb":
      case "5gb":
      case "6gb":
      case "7gb":
      case "8gb":
      case "9gb":
      case "10gb":
      case "unli": {
        if (!isOwner && !isSeller) return reply(mess.seller);

        let ram, disk, cpu;
        const userInput = text; // Ambil input user
        console.log(userInput);

        switch (command) {
          case "1gb":
            ram = "1024";
            disk = "1024";
            cpu = "40";
            break;
          case "2gb":
            ram = "2048";
            disk = "2048";
            cpu = "60";
            break;
          case "3gb":
            ram = "3072";
            disk = "3072";
            cpu = "80";
            break;
          case "4gb":
            ram = "4096";
            disk = "4096";
            cpu = "100";
            break;
          case "5gb":
            ram = "5120";
            disk = "5120";
            cpu = "120";
            break;
          case "6gb":
            ram = "6144";
            disk = "6144";
            cpu = "140";
            break;
          case "7gb":
            ram = "7168";
            disk = "7168";
            cpu = "160";
            break;
          case "8gb":
            ram = "8192";
            disk = "8192";
            cpu = "180";
            break;
          case "9gb":
            ram = "9216";
            disk = "9216";
            cpu = "200";
            break;
          case "10gb":
            ram = "10240";
            disk = "10240";
            cpu = "220";
            break;
          case "unli":
            ram = "0";
            disk = "0";
            cpu = "0";
            break;
        }

        let t = userInput.split(",");
        if (t.length < 3) {
          return reply(`*Format salah!*\n\nPenggunaan:\n${command} sendwa/sendtele,username,nowa/idtele\n\nContoh:\n${command} sendwa,tesss,628123456789`);
        }

        let sendType = t[0].trim(); // Pilihan pengiriman (sendwa atau sendtele)
        let username = t[1].trim(); // Username
        let targetNumber = t[2].trim(); // ID Telegram atau Nomor WhatsApp

        console.log(sendType);
        console.log(username);
        console.log(targetNumber);

        if (!["sendwa", "sendtele"].includes(sendType)) {
          return reply("Pilihan pengiriman hanya boleh 'sendwa' atau 'sendtele'.");
        }

        if (!targetNumber.match(/^\d+$/)) {
          return reply(`ID tele / No. WA tujuan tidak valid.`);
        }

        let email = `${username}@xpanel.id`;

        let fCheckEmail = await fetch(`${global.domain}/api/application/users/email/${email}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${global.plta}`
          }
        });

        let checkEmailData = await fCheckEmail.json();
        if (checkEmailData.errors && checkEmailData.errors.length > 0 && checkEmailData.errors[0].meta && checkEmailData.errors[0].meta.source_field === 'email') {
          return reply(`*Email sudah terdaftar!* Silakan pilih username lain.`);
        }

        let password = Math.random().toString(36).slice(-8);

        let f = await fetch(`${global.domain}/api/application/users`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${global.plta}`
          },
          body: JSON.stringify({
            email: email,
            username: username,
            first_name: username,
            last_name: username,
            language: "en",
            password: password.toString()
          })
        });

        let data = await f.json();
        if (data.errors) {
          return xy.telegram.sendMessage(xy.message.chat.id, JSON.stringify(data.errors[0], null, 2));
        }
        let user = data.attributes;

        let f2 = await fetch(`${global.domain}/api/application/nests/5/eggs/${global.eggs}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${global.pltc}`
          }
        });

        let data2 = await f2.json();
        console.log(data2)
        let startup_cmd = data2.attributes.startup;

        let f3 = await fetch(`${global.domain}/api/application/servers`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${global.pltc}`
          },
          body: JSON.stringify({
            name: username,
            description: "panel pterodatcyl",
            user: user.id,
            egg: parseInt(global.eggs),
            docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
            startup: startup_cmd,
            environment: {
              INST: "npm",
              USER_UPLOAD: "0",
              AUTO_UPDATE: "0",
              CMD_RUN: "npm start"
            },
            limits: {
              memory: ram,
              swap: 0,
              disk: disk,
              io: 500,
              cpu: cpu
            },
            feature_limits: {
              databases: 5,
              backups: 5,
              allocations: 5
            },
            deploy: {
              locations: [parseInt(global.loc)],
              dedicated_ip: false,
              port_range: []
            }
          })
        });

        let res = await f3.json();
        if (res.errors) {
          return xy.telegram.sendMessage(xy.message.chat.id, JSON.stringify(res.errors[0], null, 2));
        }
        let server = res.attributes;

        let messageToSend = `
🎉 *Panel Berhasil Dibuat!*

🔹 *Detail Panel Anda:*
────────────────────
- 𝗜𝗗: ${user.id}
- 𝗘𝗠𝗔𝗜𝗟: ${user.email}
- 𝗨𝗦𝗘𝗥𝗡𝗔𝗠𝗘: ${user.username}
- 𝗣𝗔𝗦𝗦𝗪𝗢𝗥𝗗: ${password.toString()}
- 𝗟𝗢𝗚𝗜𝗡: [Klik untuk login](${global.domain})

⚠️ 𝗣𝗘𝗥𝗛𝗔𝗧𝗜𝗔𝗡:
────────────────────
Simpan informasi ini dengan baik, karena kami hanya mengirimkan detail akun sekali. Jika hilang, Anda bertanggung jawab atas data ini.
`;

        if (sendType === "sendtele") {
          await xy.telegram.sendPhoto(targetNumber, {
            source: paket
          }, {
            caption: messageToSend
          });
        } else if (sendType === "sendwa") {
          const sessionNumber = Array.from(sessions.keys())[0];
          const waClient = sessions.get(sessionNumber);
          if (!waClient) return reply(`Sesi WhatsApp ${sessionNumber} tidak ditemukan.`);
          if (!sessions.has(sessionNumber)) return reply(`WhatsApp ${sessionNumber} belum terhubung.`);
          const custwa = targetNumber.includes("@") ? targetNumber : `${targetNumber}@s.whatsapp.net`;
          try {
            await waClient.sendMessage(custwa, {
              image: {
                url: paket
              }, // Kirim gambar dari URL atau path file
              caption: messageToSend // Tambahkan teks di bawah gambar
            });
            reply(`✅ Detail panel telah dikirim ke WhatsApp ${targetNumber}`);
          } catch (error) {
            console.error("Gagal mengirim pesan ke WhatsApp:", error);
            reply(`❌ Gagal mengirim pesan ke WhatsApp ${targetNumber}`);
          }
        }

        let messageToSender = `✅ Panel untuk username *${username}* telah berhasil dibuat dan data telah dikirim ke *${sendType === "sendtele" ? "Telegram" : "WhatsApp"}* ${targetNumber}.`;
        await xy.telegram.sendMessage(xy.message.chat.id, messageToSender);
      };
      break;

      case "createadmin": {
        if (!isOwner) return reply(mess.owner);

        let t = text.split(",");
        if (t.length < 3)
          return reply(`*Format salah!*

Penggunaan:
${prefix + command} sendwa/sendtele,nama,nomor_telepon

Contoh:
${prefix + command} sendwa,tes,628123456789`);

        let sendType = t[0].trim(); // Pilihan pengiriman (sendwa atau sendtele)
        let username = t[1].trim(); // Username
        let targetNumber = t[2].replace(/[^0-9]/g, ""); // ID Telegram atau Nomor WhatsApp

        if (!["sendwa", "sendtele"].includes(sendType)) {
          return reply("Pilihan pengiriman hanya boleh 'sendwa' atau 'sendtele'.");
        }

        let password = Math.random().toString(36).slice(-8); // Password acak
        let email = username + "@xpanel.id";

        let f = await fetch(`${global.domain}/api/application/users`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${global.plta}`
          },
          body: JSON.stringify({
            email: email,
            username: username,
            first_name: username,
            last_name: username,
            language: "en",
            root_admin: true,
            password: password.toString()
          })
        });

        let data = await f.json();
        if (data.errors) {
          return reply(`❌ Error: ${JSON.stringify(data.errors[0], null, 2)}`);
        }
        let user = data.attributes;

        let messageToTarget = `
✓ Admin Panel Berhasil Dibuat

- 𝗜𝗗: ${user.id}
- 𝗘𝗠𝗔𝗜𝗟: ${user.email}
- 𝗨𝗦𝗘𝗥𝗡𝗔𝗠𝗘: ${user.username}
- 𝗣𝗔𝗦𝗦𝗪𝗢𝗥𝗗: ${password.toString()}
- 𝗟𝗢𝗚𝗜𝗡: ${global.domain}

⚠️ Simpan informasi ini, kami hanya mengirimkan detail akun sekali.
`;

        if (sendType === "sendtele") {
          await xy.telegram.sendPhoto(targetNumber, {
            source: paket
          }, {
            caption: messageToTarget
          });
        } else if (sendType === "sendwa") {
          const sessionNumber = Array.from(sessions.keys())[0];
          const waClient = sessions.get(sessionNumber);
          if (!waClient) return reply(`❌ Sesi WhatsApp ${sessionNumber} tidak ditemukan.`);

          const custwa = targetNumber.includes("@") ? targetNumber : `${targetNumber}@s.whatsapp.net`;
          try {
            await waClient.sendMessage(custwa, {
              image: {
                url: paket
              },
              caption: messageToTarget
            });
            reply(`✅ Detail admin telah dikirim ke WhatsApp *${targetNumber}*`);
          } catch (error) {
            console.error("Gagal mengirim ke WhatsApp:", error);
            reply(`❌ Gagal mengirim ke WhatsApp *${targetNumber}*`);
          }
        }

        let messageToSender = `✅ Admin *${username}* berhasil dibuat dan data telah dikirim ke *${sendType === "sendtele" ? "Telegram" : "WhatsApp"}* ${targetNumber}.`;
        await xy.telegram.sendMessage(xy.message.chat.id, {
          text: messageToSender
        });
      }
      break;


      case 'qris':
        const qrImageUrl = 'src/image/qris.jpg'; // Path gambar QRIS
        const qrisCaption = '📲 Ini adalah QRIS untuk pembayaran. Silakan scan!';

        await xy.telegram.sendPhoto(chatId, {
          source: qrImageUrl
        }, {
          caption: qrisCaption
        });
        break;


      case 'changeqris':
        if (!isOwner) return reply(mess.owner);
        if (xy.message.photo) {
          const photoId = xy.message.photo[xy.message.photo.length - 1].file_id;

          xy.telegram.getFileLink(photoId)
            .then((fileLink) => {
              const fs = require('fs');
              const https = require('https');
              const path = './src/image/qris.jpg'; // Path gambar QRIS yang lama

              https.get(fileLink, (response) => {
                const fileStream = fs.createWriteStream(path);
                response.pipe(fileStream);

                fileStream.on('finish', () => {
                  fileStream.close();

                  xy.telegram.sendPhoto(chatId, {
                    source: path
                  }, {
                    caption: `📸 QRIS telah diperbarui. Silakan scan!`
                  });
                });
              });
            })
            .catch((error) => {
              console.log('Error downloading user image:', error);
            });
        } else {
          xy.telegram.sendMessage(xy.message.chat.id, 'Harap kirimkan gambar untuk mengganti QRIS!');
        }
        break;

      case 'tourl': {
        if (!xy.message.reply_to_message || (!xy.message.reply_to_message.photo && !xy.message.reply_to_message.video)) {
          return reply(`📌 *Reply gambar atau video dengan caption* \`${prefix + command}\``);
        }

        let fileId = xy.message.reply_to_message.photo ?
          xy.message.reply_to_message.photo[xy.message.reply_to_message.photo.length - 1].file_id :
          xy.message.reply_to_message.video.file_id;

        try {
          let file = await xy.telegram.getFile(fileId);
          let fileUrl = `https://api.telegram.org/file/bot${xy.telegram.token}/${file.file_path}`;

          let filePath = path.join(__dirname, path.basename(file.file_path));

          let response = await axios({
            url: fileUrl,
            responseType: 'stream'
          });

          let writer = fs.createWriteStream(filePath);
          response.data.pipe(writer);

          writer.on('finish', async () => {
            try {
              let uploaded = await UploadFileUgu(filePath);
              reply(`✅ *Berhasil diunggah!*\n🔗 *URL:* ${uploaded.url}`);
              fs.unlinkSync(filePath); // Hapus file setelah upload
            } catch (uploadError) {
              reply(`❌ Gagal mengunggah file.`);
              console.error(uploadError);
            }
          });

          writer.on('error', (err) => {
            reply(`❌ Gagal menyimpan file.`);
            console.error(err);
          });

        } catch (err) {
          reply(`❌ Gagal mengambil file dari Telegram.`);
          console.error(err);
        }
      }
      break;

      case 'sticker': {
        if (!xy.message.reply_to_message ||
          (!xy.message.reply_to_message.photo && !xy.message.reply_to_message.video)) {
          return reply(`📌 *Reply gambar atau video dengan perintah* \`${prefix + command}\``);
        }

        let fileId, isVideo = false;

        if (xy.message.reply_to_message.photo) {
          fileId = xy.message.reply_to_message.photo[xy.message.reply_to_message.photo.length - 1].file_id;
        } else if (xy.message.reply_to_message.video) {
          fileId = xy.message.reply_to_message.video.file_id;
          isVideo = true;
        }

        try {
          let file = await xy.telegram.getFile(fileId);

          if (!file.file_path) {
            return reply(`❌ Gagal mengambil file dari Telegram. file_path tidak ditemukan.`);
          }

          let fileUrl = `https://api.telegram.org/file/bot${xy.telegram.token}/${file.file_path}`;
          let inputPath = path.join(__dirname, path.basename(file.file_path));
          let outputPath = inputPath.replace(/\.[^/.]+$/, isVideo ? ".webm" : ".webp");

          let response = await axios({
            url: fileUrl,
            responseType: 'stream'
          });

          let writer = fs.createWriteStream(inputPath);
          response.data.pipe(writer);

          writer.on('finish', async () => {
            if (isVideo) {
              exec(`ffmpeg -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease" -c:v libvpx-vp9 -b:v 500k -an "${outputPath}"`, async (err) => {
                if (err) {
                  console.error(err);
                  return reply(`❌ Gagal mengonversi video ke stiker.`);
                }

                await xy.telegram.sendSticker(xy.message.chat.id, {
                  source: outputPath
                });

                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
              });

            } else {
              exec(`ffmpeg -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease" -qscale 50 "${outputPath}"`, async (err) => {
                if (err) {
                  console.error(err);
                  return reply(`❌ Gagal mengonversi gambar ke stiker.`);
                }

                await xy.telegram.sendSticker(xy.message.chat.id, {
                  source: outputPath
                });

                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
              });
            }
          });

          writer.on('error', (err) => {
            console.error(err);
            reply(`❌ Gagal menyimpan file dari Telegram.`);
          });

        } catch (err) {
          console.error(err);
          reply(`❌ Gagal mengambil file dari Telegram.`);
        }
      }
      break;

      case 'toimage':
      case 'toimg': {
        if (!xy.message.reply_to_message || !xy.message.reply_to_message.sticker) {
          return reply(`📌 *Reply stiker dengan perintah* \`${prefix + command}\``);
        }

        let fileId = xy.message.reply_to_message.sticker.file_id;

        try {
          let file = await xy.telegram.getFile(fileId);

          if (!file.file_path) {
            return reply(`❌ Gagal mengambil file dari Telegram. file_path tidak ditemukan.`);
          }

          let fileUrl = `https://api.telegram.org/file/bot${xy.telegram.token}/${file.file_path}`;
          let inputPath = path.join(__dirname, path.basename(file.file_path));
          let outputPath = inputPath.replace(".webp", ".png"); // Ubah ke PNG

          let response = await axios({
            url: fileUrl,
            responseType: 'stream'
          });

          let writer = fs.createWriteStream(inputPath);
          response.data.pipe(writer);

          writer.on('finish', async () => {
            exec(`ffmpeg -i "${inputPath}" "${outputPath}"`, async (err) => {
              fs.unlinkSync(inputPath);

              if (err) {
                console.error(err);
                return reply(`❌ Gagal mengonversi stiker ke gambar.`);
              }

              await xy.telegram.sendPhoto(xy.message.chat.id, {
                source: outputPath
              }, {
                caption: "✅ *Berhasil dikonversi ke gambar!*"
              });

              fs.unlinkSync(outputPath);
            });
          });

          writer.on('error', (err) => {
            console.error(err);
            reply(`❌ Gagal menyimpan file dari Telegram.`);
          });

        } catch (err) {
          console.error(err);
          reply(`❌ Gagal mengambil stiker dari Telegram.`);
        }
      }
      break;

      case 'tovideo': {
        if (!xy.message.reply_to_message || !xy.message.reply_to_message.sticker) {
          return reply(`📌 *Reply stiker dengan perintah* \`${prefix + command}\``);
        }

        let fileId = xy.message.reply_to_message.sticker.file_id;
        let isAnimated = xy.message.reply_to_message.sticker.is_animated;
        let isVideoSticker = xy.message.reply_to_message.sticker.is_video;

        try {
          let file = await xy.telegram.getFile(fileId);

          if (!file.file_path) {
            return reply(`❌ Gagal mengambil file dari Telegram. file_path tidak ditemukan.`);
          }

          let fileUrl = `https://api.telegram.org/file/bot${xy.telegram.token}/${file.file_path}`;

          let ext = file.file_path.endsWith('.webm') ? '.webm' : '.webp';
          let inputPath = path.join(__dirname, `sticker${ext}`);
          let outputPath = inputPath.replace(ext, ".mp4"); // Ubah ke MP4

          let response = await axios({
            url: fileUrl,
            responseType: 'stream'
          });

          let writer = fs.createWriteStream(inputPath);
          response.data.pipe(writer);

          writer.on('finish', async () => {
            exec(`ffmpeg -i "${inputPath}" -movflags faststart -pix_fmt yuv420p -vf "scale=512:512:force_original_aspect_ratio=decrease" "${outputPath}"`, async (err) => {
              fs.unlinkSync(inputPath);

              if (err) {
                console.error(err);
                return reply(`❌ Gagal mengonversi stiker ke video.`);
              }

              await xy.telegram.sendVideo(xy.message.chat.id, {
                source: outputPath
              }, {
                caption: "✅ *Berhasil dikonversi ke video!*"
              });

              fs.unlinkSync(outputPath);
            });
          });

          writer.on('error', (err) => {
            console.error(err);
            reply(`❌ Gagal menyimpan file dari Telegram.`);
          });

        } catch (err) {
          console.error(err);
          reply(`❌ Gagal mengambil stiker dari Telegram.`);
        }
      }
      break;

      case 'installpanel': {
        if (!isOwner) return reply(`❌ *Hanya owner yang bisa menggunakan perintah ini!*`);

        if (!text || text.split(',').length < 5) {
          return reply(`❌ *Format salah!*\n\nGunakan: \n/installpanel ipvps, passwordvps, paneldomain, nodedomain, ram\n\nContoh:\n/installpanel 192.168.1.1, mypassword, panel.example.com, node.example.com, 2048`);
        }

        let [vpsIP, vpsPassword, panelDomain, nodeDomain, nodeRAM] = text.split(',').map(a => a.trim());

        let dbName = generateReadableString(8);
        let pswd = generateReadableString(8);
        let dbUsername = generateReadableString(8);
        let randomNumber = Math.floor(1000 + Math.random() * 9000);
        let usradmn = `admin${randomNumber}`
        let pwadmn = `Admin${randomNumber}`

        const ssh = new Client();

        function installPanel() {
          reply(`🔄 *Menginstall Pterodactyl Panel di VPS ${vpsIP}...*`);
          ssh.exec(`bash <(curl -s https://pterodactyl-installer.se)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal menjalankan instalasi panel!*`);

            stream.on('data', (data) => {
              console.log(`STDOUT: ${data}`);
              let output = data.toString();

              if (output.includes("Input 0-6")) {
                stream.write("0\n");
              }
              if (output.includes("(y/N)")) {
                stream.write("y\n");
              }
              if (output.includes("Database name (panel)")) {
                stream.write(`${dbName}\n`);
              }
              if (output.includes("Database username (pterodactyl)")) {
                stream.write(`${dbUsername}\n`);
              }
              if (output.includes("Password (press enter to use randomly generated password)")) {
                stream.write("admin\n");
              }
              if (output.includes("Select timezone [Europe/Stockholm]")) {
                stream.write("Asia/Jakarta\n");
              }
              if (output.includes("Provide the email address")) {
                stream.write("admin@gmail.com\n");
              }
              if (output.includes("Email address for the initial admin account")) {
                stream.write(`admin${randomNumber}@gmail.com\n`);
              }
              if (output.includes("Username for the initial admin account")) {
                stream.write(`${usradmn}\n`);
              }
              if (output.includes("First name for the initial admin account")) {
                stream.write(`${usradmn}\n`);
              }
              if (output.includes("Last name for the initial admin account")) {
                stream.write(`${usradmn}\n`);
              }
              if (output.includes("Password for the initial admin account")) {
                stream.write(`${pwadmn}\n`);
              }
              if (output.includes("Set the FQDN of this panel")) {
                stream.write(`${panelDomain}\n`);
              }
              if (output.includes("Do you want to automatically configure UFW")) {
                stream.write("y\n");
              }
              if (output.includes("Do you want to automatically configure HTTPS")) {
                stream.write("y\n");
              }
              if (output.includes("Select the appropriate number")) {
                stream.write("1\n");
              }
              if (output.includes("I agree that this HTTPS request is performed")) {
                stream.write("y\n");
              }
              if (output.includes("Proceed anyways")) {
                stream.write("y\n");
              }
              if (output.includes("(yes/no)")) {
                stream.write("y\n");
              }
              if (output.includes("Initial configuration completed. Continue?")) {
                stream.write("y\n");
              }
              if (output.includes("Still assume SSL? (y/N)")) {
                stream.write("y\n");
              }
              if (output.includes("Please read the Terms of Service")) {
                stream.write("y\n");
              }
              if (output.includes("(A)gree/(C)ancel:")) {
                stream.write("A\n");
              }
            });
            stream.on('close', () => {
              reply(`✅ *Panel berhasil diinstall! Sekarang membuat lokasi...*`);
              makeLocation();
            });
          });
        }

        function makeLocation() {
          ssh.exec(`
cd /var/www/pterodactyl && php artisan p:location:make <<EOF
Singapore
Lokasi Singapura
EOF
        `, (err, stream) => {
            if (err) return reply(`❌ *Gagal membuat lokasi!*`);

            let locationId = 1;

            stream.on('data', (data) => {
              console.log(`STDOUT: ${data}`);
              let match = data.toString().match(/ID:\s*(\d+)/);
              if (match) {
                locationId = match[1]; // Ambil ID lokasi
              }
            });

            stream.on('close', () => {
              if (locationId) {
                reply(`✅ *Lokasi berhasil dibuat dengan ID ${locationId}!*`);
                makeNode(locationId);
              } else {
                reply(`❌ *Gagal mendapatkan ID lokasi!*`);
              }
            });
          });
        }

        function makeNode(locationId) {
          ssh.exec(`
cd /var/www/pterodactyl && php artisan p:node:make <<EOF
Node Singapore
Singapore
${locationId}
https
${nodeDomain}
yes
no
no
${nodeRAM}
${nodeRAM}
2048
2048
100
8080
2022
/var/lib/pterodactyl/volumes
EOF
        `, (err, stream) => {
            if (err) return reply(`❌ *Gagal membuat node!*`);

            stream.on('data', (data) => {
              console.log(`STDOUT: ${data}`);
            });

            stream.on('close', () => {
              reply("✅ *Node berhasil dibuat!*");
              installWings();
            });
          });
        }

        function installWings() {
          ssh.exec(`bash <(curl -s https://pterodactyl-installer.se)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal menjalankan instalasi Wings!*`);

            stream.on('data', (data) => {
              console.log(`STDOUT: ${data}`);
              let output = data.toString();

              if (output.includes("Input 0-6")) {
                stream.write("1\n");
              }
              if (output.includes("(y/N)")) {
                stream.write("y\n");
              }
              if (output.includes("Enter the panel address (blank for any address):")) {
                stream.write(`${panelDomain}\n`);
              }
              if (output.includes("Database host username (pterodactyluser):")) {
                stream.write(`${dbName}\n`);
              }
              if (output.includes("Database host password:")) {
                stream.write(`${pswd}\n`);
              }
              if (output.includes("Set the FQDN to use for Let's Encrypt (node.example.com):")) {
                stream.write(`${nodeDomain}\n`);
              }
              if (output.includes("Enter email address for Let's Encrypt:")) {
                stream.write("admin@gmail.com\n");
              }

            });

            stream.on('close', () => {
              ssh.end();
              reply(`
✅ *Pterodactyl Panel dan Wings berhasil diinstall di VPS ${vpsIP}!*
🌐 *Login Panel:* ${panelDomain}
👤 *Username:* ${usradmn}  
🔑 *Password:* ${pwadmn}
📂 *Database Name:* ${dbName}
👤 *Database Username:* ${dbUsername}
                `);
            });
          });
        }

        ssh.on('ready', installPanel).connect({
          host: vpsIP,
          port: 22,
          username: 'root',
          password: vpsPassword
        });
      }
      break;

      case 'uninstallpanel': {
        if (!isOwner) return reply(`❌ *Hanya owner yang bisa menggunakan perintah ini!*`);

        if (!text || text.split(',').length < 2) {
          return reply(`❌ *Format salah!*\n\nGunakan: \n/uninstallpanel ipvps, passwordvps\n\nContoh:\n/uninstallpanel 192.168.1.1, mypassword`);
        }

        let [vpsIP, vpsPassword] = text.split(',').map(a => a.trim());

        reply(`🔄 *Menghapus Pterodactyl Panel dari VPS ${vpsIP}...*`);

        const ssh = new Client();
        ssh.on('ready', () => {
          ssh.exec(`bash <(curl -s https://pterodactyl-installer.se)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal menjalankan perintah uninstall!*`);

            stream.on('data', (data) => {
              if (data.includes("Input 0-6")) stream.write("6\n");
              if (data.toString().includes('(y/N)')) {
                stream.write('y\n');
              }
              if (data.toString().includes('Choose the panel database (to skip don\'t input anything)')) {
                stream.write('\n');
              }
              if (data.toString().includes('Choose the panel database (to skip don\'t input anything)')) {
                stream.write('\n');
              }
              console.log(`STDOUT: ${data}`);
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Pterodactyl Panel berhasil dihapus dari VPS ${vpsIP} tanpa sisa!*`);
            });
          });
        }).connect({
          host: vpsIP,
          port: 22,
          username: 'root',
          password: vpsPassword
        });
      }
      break;

      case 'startwings': {
        if (!isOwner) return reply(`❌ *Hanya owner yang bisa menggunakan perintah ini!*`);

        if (!text || text.split(',').length < 2) {
          return reply(`❌ *Format salah!*\n\nGunakan: \n/uninstallpanel ipvps, passwordvps\n\nContoh:\n/uninstallpanel 192.168.1.1, mypassword`);
        }

        let [vpsIP, vpsPassword, token] = text.split(',').map(a => a.trim());

        reply(`🔄 *Configuration Node Panel dari VPS ${vpsIP}...*`);

        const ssh = new Client();
        ssh.on('ready', () => {
          ssh.exec(`${token} && systemctl start wings`, (err, stream) => {
            if (err) return reply(`❌ *Gagal menjalankan perintah uninstall!*`);

            stream.on('data', (data) => {
              stream.write('y\n')
              console.log(`STDOUT: ${data}`);
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Configuration Node Panel berhasil dihapus dari VPS ${vpsIP}!*`);
            });
          });
        }).connect({
          host: vpsIP,
          port: 22,
          username: 'root',
          password: vpsPassword
        });
      }
      break;

      case 'tiktok': {
        if (!text) return reply(`❌ *Format salah!*\n\nContoh penggunaan:\n/tiktok link_video`);

        if (text.includes('tiktok')) {
          reply(`⏳ *Sedang memproses video TikTok...*`);

          require('./src/lib/tiktok').Tiktok(text).then(async (data) => {
            try {
              await xy.telegram.sendVideo(chatId, data.watermark, {
                caption: `🎥 *Video tanpa watermark*`
              });

              if (data.audio && data.audio.startsWith('http')) {
                const audioBuffer = await getBuffer(data.audio);
                await xy.telegram.sendAudio(chatId, audioBuffer, {
                  caption: `🎵 *Audio dari TikTok*`
                });
              }

              xy.telegram.sendMessage(chatId, `✅ *Berhasil mengunduh video dan audio TikTok!*`, {
                parse_mode: "Markdown"
              });

            } catch (error) {
              xy.telegram.sendMessage(chatId, `❌ *Terjadi kesalahan saat mengirim video atau audio.*`);
              console.error(error);
            }
          }).catch((err) => {
            xy.telegram.sendMessage(chatId, `❌ *Terjadi kesalahan saat memproses video TikTok.*`);
            console.error(err);
          });
        } else {
          reply(`❌ *Tautan yang diberikan tidak valid atau tidak didukung.*`);
        }
      }
      break;

      case "igdl": {
        if (!text) return reply(`❌ *Format salah!*\n\nContoh penggunaan:\n/igdl https://www.instagram.com/reel/xyz`);

        if (!text.includes("instagram.com/reel/")) {
          return reply("❌ *Hanya mendukung unduhan Instagram Reels!*");
        }

        try {
          reply("⏳ *Sedang mengunduh video Reels, harap tunggu...*");

          const data = await igdl(text);
          console.log("Data IGDL:", data);

          if (!data || !Array.isArray(data) || data.length === 0) {
            return reply("❌ *Tidak ada media yang ditemukan dalam Reels Instagram!*");
          }

          let alreadySent = new Set();

          for (const item of data) {
            if (!item.url || alreadySent.has(item.url)) continue;

            console.log("🔄 Sedang mendownload:", item.url);
            const videoPath = path.join('./reels.mp4');

            const writer = fs.createWriteStream(videoPath);
            const response = await axios({
              url: item.url,
              method: "GET",
              responseType: "stream",
            });

            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
              writer.on("finish", resolve);
              writer.on("error", reject);
            });

            console.log("✅ Download selesai:", videoPath);
            await xy.telegram.sendVideo(chatId, {
              source: videoPath
            }, {
              caption: "🎥 *Berikut adalah video dari Instagram Reels!*"
            });

            alreadySent.add(item.url);

            fs.unlinkSync(videoPath);
          }

          if (alreadySent.size === 0) {
            reply("❌ *Gagal mengunduh video. Coba link lain!*");
          } else {
            reply("✅ *Reels Instagram berhasil diunduh!*");
          }
        } catch (err) {
          console.error("Kesalahan saat mengunduh Reels Instagram:", err);
          reply("❌ *Terjadi kesalahan saat mengunduh Reels Instagram!*");
        }
        break;
      }

      case 'ssweb': {
        if (!text) return reply(`❌ *Format salah!*\n\nContoh penggunaan:\n/ssweb https://github.com`);

        let url = text.startsWith('http') ? text : 'https://' + text;
        let screenshotUrl = `https://image.thum.io/get/width/1900/crop/1000/fullpage/${url}`;

        try {
          await xy.telegram.sendPhoto(chatId, screenshotUrl, {
            caption: '✅ *Screenshot berhasil diambil!*'
          });
        } catch (err) {
          console.error('Kesalahan saat mengambil screenshot:', err);
          reply('❌ *Gagal mengambil screenshot, coba lagi nanti!*');
        }
      }
      break;

      case "spotifydl": {
        try {
          if (!text) return reply("❌ *Masukkan link Spotify yang valid!*");

          const match = text.match(/track\/([a-zA-Z0-9]+)/);
          if (!match) return reply("❌ *Link Spotify tidak valid!*");

          const trackId = match[1];
          reply("⏳ *Sedang mencari lagu...*");

          const searchResults = await yts(trackId);
          const video = searchResults.videos[0];
          if (!video) return reply("❌ *Lagu tidak ditemukan!*");

          const youtubeUrl = video.url;
          const fileName = `${video.title.replace(/[^\w\s]/gi, '')}_${Date.now()}.mp3`;
          const filePath = `./${fileName}`;

          const videoStream = ytdl(youtubeUrl, {
            filter: 'audioandvideo',
            quality: 'highestaudio'
          });

          await new Promise((resolve, reject) => {
            const ffmpegProcess = ffmpeg(videoStream)
              .audioCodec('libmp3lame')
              .format('mp3')
              .on('end', resolve)
              .on('error', reject)
              .save(filePath);
          });

          await xy.telegram.sendDocument(chatId, {
            source: filePath,
            filename: fileName
          }, {
            caption: `🎵 *Lagu berhasil diunduh dari Spotify!*`
          });

          fs.unlinkSync(filePath);

        } catch (error) {
          console.error("Error:", error.message);
          reply("❌ *Terjadi kesalahan saat mengunduh lagu!*");
        }
      }
      break;

      case 'ytdl': {
        if (!text) return reply('❌ *Format salah!*\n\nContoh penggunaan:\n/yt https://www.youtube.com/watch?v=xyz');

        const link = text;
        if (!ytdl.validateURL(link)) return reply('❌ *Link tidak valid!*');

        try {
          reply('⏳ *Sedang mengunduh video dan audio dari YouTube, harap tunggu...*');

          const info = await ytdl.getInfo(link, {
            requestOptions: {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              }
            }
          });

          if (!info) return reply('❌ *Gagal mendapatkan informasi video!*');

          const {
            title,
            author: {
              name: channelName
            },
            lengthSeconds,
            uploadDate
          } = info.videoDetails;

          const duration = new Date(lengthSeconds * 1000).toISOString().substr(11, 8);
          const durationFormatted = duration.startsWith('00:') ? duration.substr(3) : duration;

          const videoCaption = `✨ *Informasi Video* ✨\n\n📌 *Judul:* ${title}\n📺 *Channel:* ${channelName}\n⏳ *Durasi:* ${durationFormatted}\n📅 *Diterbitkan:* ${uploadDate || 'Tidak tersedia'}\n🔗 *Tautan:* ${link}`;

          const videoPath = `./video_yt.mp4`;
          const audioPath = `./audio_yt.mp3`;

          const videoStream = ytdl(link, {
            filter: 'audioandvideo',
            quality: 'highestaudio'
          });
          const videoWriter = fs.createWriteStream(videoPath);
          videoStream.pipe(videoWriter);



          await new Promise((resolve, reject) => {
            ffmpeg(videoStream)
              .audioCodec('libmp3lame')
              .format('mp3')
              .on('end', resolve)
              .on('error', reject)
              .save(audioPath);
          });


          await xy.telegram.sendDocument(chatId, {
            source: audioPath
          }, {
            caption: `📂 *Berikut adalah audio YouTube dalam format dokumen!*`
          });
          await xy.telegram.sendVideo(chatId, {
            source: videoPath
          }, {
            caption: `📹 *Berikut adalah video YouTube!*`
          });

          fs.unlinkSync(videoPath)
          fs.unlinkSync(audioPath);

        } catch (err) {
          console.error('Kesalahan saat mengunduh YouTube:', err);
          reply('❌ *Terjadi kesalahan saat mengunduh YouTube!*');
        }
      }
      break;

      case "temastellar": {
        if (!isOwner) return reply(`❌ *Hanya Owner Yang Bisa Menggunakan Perintah Ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format Salah!*\n\nGunakan:\n/temastellar ipvps,pwvps\n\nContoh:\n/temastellar 192.168.1.1,mypassword`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai Instalasi Tema Stellar Di Vps ${ipvps}...*`);

          ssh.exec(`bash <(curl https://raw.githubusercontent.com/vannhost1234/installtheme/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal Menjalankan Perintah Install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("vann\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("1\n"); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Stellar Berhasil Diinstall Di Vps ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *Ip Atau Password Vps Salah!*`);
        }).connect(connSettings);
      }
      break;

      case "temanebula": {
        if (!isOwner) return reply(`❌ *Hanya Owner Yang Bisa Menggunakan Perintah Ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format Salah!*\n\nGunakan:\n/temanebula ipvps,pwvps\n\nContoh:\n/temanebula 192.168.1.1,mypassword`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai Instalasi Tema Nebula Di Vps ${ipvps}...*`);

          ssh.exec(`bash <(curl https://raw.githubusercontent.com/vannhost1234/installtheme/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal Menjalankan Perintah Install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("vann\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("2\n"); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Nebula Berhasil Diinstall Di Vps ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *Ip Atau Password Vps Salah!*`);
        }).connect(connSettings);
      }
      break;

      case "temadarknate": {
        if (!isOwner) return reply(`❌ *Hanya Owner Yang Bisa Menggunakan Perintah Ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format Salah!*\n\nGunakan:\n/temadarknate ipvps,pwvps,linkmedsos\n\nContoh:\n/temadarknate 192.168.1.1,mypassword,https://wa.me/62123456789`);
        }

        let [ipvps, passwd, linkmed] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai Instalasi Tema Darknate Di Vps ${ipvps}...*`);

          ssh.exec(`bash <(curl https://raw.githubusercontent.com/vannhost1234/installtheme/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal Menjalankan Perintah Install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("vann\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("3\n"); // Pilih Stellar
              }

              if (output.includes("Masukkan Link Nomor Telegram/Whatsapp:")) {
                stream.write(`${linkmed}\n`); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Draknate Berhasil Diinstall Di Vps ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *Ip Atau Password Vps Salah!*`);
        }).connect(connSettings);
      }
      break;

      case "temaenigma": {
        if (!isOwner) return reply(`❌ *Hanya Owner Yang Bisa Menggunakan Perintah Ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format Salah!*\n\nGunakan:\n/temaenigma ipvps,pwvps\n\nContoh:\n/temaenigma 192.168.1.1,mypassword`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai Instalasi Tema Enigma Di Vps ${ipvps}...*`);

          ssh.exec(`bash <(curl https://raw.githubusercontent.com/vannhost1234/installtheme/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal Menjalankan Perintah Install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("vann\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("4\n"); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Enigma Berhasil Diinstall Di Vps ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *Ip Atau Password Vps Salah!*`);
        }).connect(connSettings);
      }
      break;

      case "temabilling": {
        if (!isOwner) return reply(`❌ *Hanya Owner Yang Bisa Menggunakan Perintah Ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format Salah!*\n\nGunakan:\n/temabilling ipvps,pwvps\n\nContoh:\n/temabilling 192.168.1.1,mypassword`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai Instalasi Tema Billing Di Vps ${ipvps}...*`);

          ssh.exec(`bash <(curl https://raw.githubusercontent.com/vannhost1234/installtheme/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal Menjalankan Perintah Install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("vann\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("5\n"); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Billing Berhasil Diinstall Di Vps ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *Ip Atau Password Vps Salah!*`);
        }).connect(connSettings);
      }
      break;

      case "temaiceminecraft": {
        if (!isOwner) return reply(`❌ *Hanya Owner Yang Bisa Menggunakan Perintah Ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format Salah!*\n\nGunakan:\n/temaiceminecraft ipvps,pwvps\n\nContoh:\n/temaiceminecraft 192.168.1.1,mypassword`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai Instalasi Tema Iceminecraft Di Vps ${ipvps}...*`);

          ssh.exec(`bash <(curl https://raw.githubusercontent.com/vannhost1234/installtheme/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal Menjalankan Perintah Install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("vann\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("6\n"); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Iceminecraft Berhasil Diinstall Di Vps ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *Ip Atau Password Vps Salah!*`);
        }).connect(connSettings);
      }
      break;

      case "temanooktheme": {
        if (!isOwner) return reply(`❌ *Hanya Owner Yang Bisa Menggunakan Perintah Ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format Salah!*\n\nGunakan:\n/temanooktheme ipvps,pwvps\n\nContoh:\n/temanooktheme 192.168.1.1,mypassword`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai Instalasi Tema Nooktheme Di Vps ${ipvps}...*`);

          ssh.exec(`bash <(curl https://raw.githubusercontent.com/vannhost1234/installtheme/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal Menjalankan Perintah Install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("vann\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("7\n"); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Nooktheme Berhasil Diinstall Di Vps ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *Ip Atau Password Vps Salah!*`);
        }).connect(connSettings);
      }
      break;
      
      case "temanightcore": {
        if (!isOwner) return reply(`❌ *Hanya Owner Yang Bisa Menggunakan Perintah Ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format Salah!*\n\nGunakan:\n/temanightcore ipvps,pwvps\n\nContoh:\n/temanightcore 192.168.1.1,mypassword`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai instalasi tema Nightcore di VPS ${ipvps}...*`);

          ssh.exec(`bash <(curl https://raw.githubusercontent.com/vannhost1234/installtheme/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal Menjalankan Perintah Install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("vann\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("8\n"); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Nightcore Berhasil Diinstall Di Vps ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *Ip Atau Password Vps Salah!*`);
        }).connect(connSettings);
      }
      break;

      case "uninstalltema": {
        if (!isOwner) return reply(`❌ *Hanya Owner Yang Bisa Menggunakan Perintah Ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format Salah!*\n\nGunakan:\n/uninstalltema ipvps,pwvps\n\nContoh:\n/uninstalltema 192.168.1.1,mypassword`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Menghapus Tema Di Vps ${ipvps}...*`);

          ssh.exec(`bash <(curl https://raw.githubusercontent.com/vannhost1234/installtheme/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal Menjalankan Perintah Uninstall!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("vann\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("2\n"); // Pilih uninstall
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Berhasil Dihapus Dari Vps ${ipvps}, Panel Kembali Ke Default!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *Ip Atau Password Vps Salah!*`);
        }).connect(connSettings);
      }
      break;

      case "ai": {
        if (!text) return reply(`❌ *Format salah!*\n\nGunakan:\n/ai <pertanyaan>\n\nContoh:\n/ai apa itu baju`);

        const query = encodeURIComponent(text);

        const url = `https://www.gravinity.my.id/query.php?query=${query}`;

        const axios = require('axios');
        axios.get(url)
          .then(response => {
            const data = response.data;

            if (data && data.data) {
              reply(data.data);
            } else {
              reply(`❌ *Gagal mendapatkan respons dari AI!*`);
            }
          })
          .catch(error => {
            console.log(`Error: ${error}`);
            reply(`❌ *Terjadi kesalahan saat menghubungi AI!*`);
          });
      }
      break;

      case 'connect':
        if (!isOwner) return reply(mess.owner);
        if (!text[0]) return reply('Gunakan: /connect nomor_telepon');

        const number = text; // Ambil angka dari argumen pertama
        if (sessions.has(number)) return reply(`WhatsApp ${number} sudah terhubung.`);

        xy.telegram.sendMessage(xy.message.chat.id, `🔄 Memulai koneksi ke WhatsApp ${number}...`)
          .then((sentMessage) => {
            startWhatsAppSession(number, xy.message.chat.id, sentMessage.message_id)
              .then(() => xy.telegram.sendMessage(xy.message.chat.id, `✅ Proses koneksi ke WhatsApp ${number} sedang berjalan.`))
              .catch((err) => xy.telegram.sendMessage(xy.message.chat.id, `❌ Gagal menghubungkan WhatsApp ${number}: ${err.message}`));
          });

        break;

      case 'send':
        if (!isOwner) return reply(mess.owner);
        if (text.length < 2) return reply('Gunakan: /send nomor_tujuan, teks_pesan');

        let [targetNumber, textMessage] = text.split(",").map(a => a.trim());
        targetNumber = targetNumber.replace(/\D/g, ''); // Bersihkan nomor tujuan

        console.log("DEBUG: Sesi setelah restore:", [...sessions.keys()]);

        console.log("DEBUG: Sesi berhasil disimpan di Map:", [...sessions.keys()]);

        if (!targetNumber) return reply('Nomor tujuan tidak valid.');
        if (!textMessage) return reply('Pesan tidak boleh kosong.');
        if (sessions.size === 0) return reply('Tidak ada sesi WhatsApp yang aktif.');

        const sessionNumber = Array.from(sessions.keys())[0];
        const waClient = sessions.get(sessionNumber);

        if (!waClient) return reply(`Sesi WhatsApp ${sessionNumber} tidak ditemukan.`);

        try {
          const jid = targetNumber.includes("@") ? targetNumber : `${targetNumber}@s.whatsapp.net`;
          await waClient.sendMessage(jid, {
            text: textMessage
          });
          reply(`✅ Pesan berhasil dikirim ke ${targetNumber} menggunakan sesi ${sessionNumber}`);
        } catch (error) {
          console.error(`⚠️ Gagal mengirim pesan ke ${targetNumber}:`, error);
          reply(`❌ Gagal mengirim pesan ke ${targetNumber}. Error: ${error.message}`);
        }
        break;

      case 'addlist':
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
        if (!text.includes("@")) return reply(`_Cara Addlist Dengan Benar_\n\n/addlist Namalist@isilist\n\nLakukan Dengan Benar Jangan Sampai Salah\n\nAtau bisa juga dengan mengirim gambar dengan caption: /${command} tes@apa`);

        let [text1, text2] = text.split("@").map(a => a.trim());

        if (isAlreadyResponList1(xy.message.chat.id, text1, db_respon_list)) {
          return reply(`❌ List respon dengan key: *${text1}* sudah ada di grup ini.`);
        }

        if (xy.message.photo) {
          try {
            let fileId = xy.message.photo[xy.message.photo.length - 1].file_id;

            let fileUrl = await xy.telegram.getFileLink(fileId);

            addResponList1(xy.message.chat.id, text1, text2, true, fileUrl, db_respon_list);
            reply(`✅ Berhasil menambah List menu dengan gambar: *${text1}*`);
          } catch (error) {
            console.error("❌ Gagal mengambil gambar:", error);
            return reply("⚠️ Terjadi kesalahan saat mengambil gambar dari Telegram.");
          }
        } else {
          addResponList1(xy.message.chat.id, text1, text2, false, '-', db_respon_list);
          reply(`✅ Berhasil menambah List menu: *${text1}*`);
        }
        break;

      case 'list':
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (db_respon_list.length === 0) return reply(`Belum ada list message di database/group ini.`);

        let filteredList = db_respon_list.filter(item => item.id === xy.message.chat.id);
        if (filteredList.length === 0) return reply(`Belum ada list message terdaftar di grup ini.`);

        let buttons = filteredList.map(item => [{
          text: `🛍️ ${item.key}`,
          callback_data: `list_${xy.message.chat.id}_${item.key}`
        }]);

        xy.telegram.sendMessage(xy.message.chat.id, `📋 *List Menu di Grup Ini* 📋\nSilakan pilih salah satu dari list di bawah ini:`, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: buttons
          }
        });
        break;

      case 'dellist': {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);
        if (!text) return reply(`_Cara Delete List_\n\n.dellist [Nama List Yg Ingin Dihapus]\n\nContoh :\n.dellist EPEP\n\n_Lakukan Dengan Benar Jangan Sampe Salah_`);

        if (db_respon_list.length === 0) return reply(`Belum ada list message di database.`);

        let index = db_respon_list.findIndex(item => item.id === xy.message.chat.id && item.key === text);
        if (index === -1) return reply(`List dengan nama "${text}" tidak ditemukan.`);

        db_respon_list.splice(index, 1);
        reply(`✅ List "${text}" berhasil dihapus.`);
        break;
      }

      case 'updatelist': {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        const [namaList, isiList] = text.split("@").map(s => s.trim());

        if (!namaList || !isiList) {
          return reply(`_Cara Update List_\n\n.updatelist NamaList@IsiListBaru\n\n_Lakukan Dengan Benar Jangan Sampe Salah_`);
        }

        let index = db_respon_list.findIndex(item => item.id === xy.message.chat.id && item.key === namaList);
        if (index === -1) return reply(`List dengan nama "${namaList}" tidak ditemukan.`);

        db_respon_list[index].response = isiList;
        reply(`✅ Response pada list "${namaList}" berhasil diperbarui menjadi:\n\n"${isiList}"`);
        break;
      }

      case 'dellistall': {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        let listData = JSON.parse(fs.readFileSync('./src/database/list.json', 'utf8'));

        const groupID = xy.message.chat.id;

        const newListData = listData.filter(item => item.id !== groupID);

        fs.writeFileSync('./src/database/list.json', JSON.stringify(newListData, null, 2));

        reply("✅ Semua list di grup ini telah dihapus.");
        break;
      }

      case 'welcome': {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        const groupID = xy.message.chat.id;
        const input = text // Pastikan `text[0]` ada
        console.log("DEBUG: Input user untuk welcome:", input); // Debugging

        const status = input === "on" ? true : input === "off" ? false : null;
        if (status === null) return reply("⚠️ Gunakan 'on' atau 'off'. Contoh: /welcome on");

        let listData = [];
        try {
          listData = JSON.parse(fs.readFileSync('./src/database/weleave.json', 'utf8'));
        } catch (error) {
          console.error("Gagal membaca database, membuat baru...");
        }

        const groupIndex = listData.findIndex(item => item.id === groupID);
        if (groupIndex !== -1) {
          listData[groupIndex].welcome = status;
        } else {
          listData.push({
            id: groupID,
            welcome: status,
            leave: false
          });
        }

        fs.writeFileSync('./src/database/weleave.json', JSON.stringify(listData, null, 2));

        reply(`✅ Fitur *Welcome* telah ${status ? "diaktifkan ✅" : "dinonaktifkan ❌"}.`);
        break;
      }

      case 'leave': {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        const groupID = xy.message.chat.id;
        const input = text;
        console.log("DEBUG: Input user untuk leave:", input); // Debugging

        const status = input === "on" ? true : input === "off" ? false : null;
        if (status === null) return reply("⚠️ Gunakan 'on' atau 'off'. Contoh: /leave on");

        let listData = [];
        try {
          listData = JSON.parse(fs.readFileSync('./src/database/weleave.json', 'utf8'));
        } catch (error) {
          console.error("Gagal membaca database, membuat baru...");
        }

        const groupIndex = listData.findIndex(item => item.id === groupID);
        if (groupIndex !== -1) {
          listData[groupIndex].leave = status;
        } else {
          listData.push({
            id: groupID,
            welcome: false,
            leave: status
          });
        }

        fs.writeFileSync('./src/database/weleave.json', JSON.stringify(listData, null, 2));

        reply(`✅ Fitur *Leave* telah ${status ? "diaktifkan ✅" : "dinonaktifkan ❌"}.`);
        break;
      }

      case 'antilink': {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        const groupID = xy.message.chat.id;
        const input = text; // Pastikan hanya membaca argumen pertama
        console.log("DEBUG: Input user untuk antilink:", input); // Debugging

        if (input !== "on" && input !== "off") {
          return reply("⚠️ Gunakan 'on' atau 'off'. Contoh: /antilink on");
        }

        const status = input === "on"; // Jika "on" maka true, jika "off" maka false

        let listData = [];
        try {
          listData = JSON.parse(fs.readFileSync('./src/database/antilink.json', 'utf8'));
        } catch (error) {
          console.error("Gagal membaca database, membuat baru...");
        }

        const groupIndex = listData.findIndex(item => item.id === groupID);
        if (groupIndex !== -1) {
          listData[groupIndex].antilink = status;
        } else {
          listData.push({
            id: groupID,
            antilink: status
          });
        }

        fs.writeFileSync('./src/database/antilink.json', JSON.stringify(listData, null, 2));

        reply(`✅ Fitur *Anti-Link* telah ${status ? "diaktifkan ✅" : "dinonaktifkan ❌"}.`);
        break;
      }

      case "kick": {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        if (!xy.message.reply_to_message) return reply("⚠️ Balas pesan pengguna yang ingin dikick.");

        const userId = xy.message.reply_to_message.from.id;

        try {
          const member = await xy.telegram.getChatMember(xy.message.chat.id, userId);
          if (member.status === "administrator" || member.status === "creator") {
            return reply("⚠️ Tidak bisa menendang admin atau pemilik grup.");
          }

          await xy.telegram.banChatMember(xy.message.chat.id, userId);
          await xy.telegram.unbanChatMember(xy.message.chat.id, userId); // Agar bisa join lagi setelah dikick

          reply(`✅ Berhasil mengeluarkan pengguna.`);
        } catch (error) {
          console.error("❌ Gagal mengeluarkan pengguna:", error);
          reply("⚠️ Gagal mengeluarkan pengguna. Pastikan bot memiliki izin untuk mengeluarkan anggota.");
        }
        break;
      }

      case "add": {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        if (text.length === 0) return reply("⚠️ Masukkan ID pengguna yang ingin ditambahkan.\nContoh: /add 123456789");

        const userId = text[0];

        try {
          const chatInviteLink = await xy.telegram.createChatInviteLink(xy.message.chat.id, {
            expire_date: Math.floor(Date.now() / 1000) + 3600, // Link berlaku 1 jam
            member_limit: 1, // Batas 1 pengguna
          });

          await xy.telegram.sendMessage(text, `✅ Anda telah diundang ke grup. Klik link berikut untuk bergabung:\n${chatInviteLink.invite_link}`);
          reply(`✅ Link undangan telah dikirim ke pengguna.`);
        } catch (error) {
          console.error("❌ Gagal mengirim link undangan:", error);
          reply("⚠️ Gagal mengirim link undangan. Pastikan ID pengguna benar dan bot dapat mengirim pesan ke mereka.");
        }
        break;
      }

      case "close": {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        try {
          await xy.telegram.setChatPermissions(xy.message.chat.id, {
            can_send_messages: false,
            can_send_media_messages: false,
            can_send_polls: false,
            can_send_other_messages: false,
            can_add_web_page_previews: false,
            can_change_info: false,
            can_invite_users: false,
            can_pin_messages: false
          });

          reply("✅ Grup telah *ditutup*. Hanya admin yang dapat mengirim pesan.");
        } catch (error) {
          console.error("❌ Gagal menutup grup:", error);
          reply("⚠️ Gagal menutup grup. Pastikan bot memiliki izin untuk mengubah pengaturan grup.");
        }
        break;
      }

      case "open": {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        try {
          await xy.telegram.setChatPermissions(xy.message.chat.id, {
            can_send_messages: true,
            can_send_media_messages: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true,
            can_change_info: false,
            can_invite_users: false,
            can_pin_messages: false
          });

          reply("✅ Grup telah *dibuka*. Semua anggota dapat mengirim pesan.");
        } catch (error) {
          console.error("❌ Gagal membuka grup:", error);
          reply("⚠️ Gagal membuka grup. Pastikan bot memiliki izin untuk mengubah pengaturan grup.");
        }
        break;
      }

      case "changetitle": {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);
        if (!text.length) return reply("⚠️ Harap masukkan nama grup baru.\nContoh: /changetitle NamaBaru");

        const newTitle = text;

        try {
          await xy.telegram.setChatTitle(xy.message.chat.id, newTitle);
          reply(`✅ Nama grup berhasil diubah menjadi: *${newTitle}*`);
        } catch (error) {
          console.error("❌ Gagal mengubah nama grup:", error);
          reply("⚠️ Gagal mengubah nama grup. Pastikan bot memiliki izin.");
        }
        break;
      }

      case "changedesk": {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);
        if (!text.length) return reply("⚠️ Harap masukkan deskripsi baru.\nContoh: /changedesk DeskripsiBaru");

        const newDescription = text;

        try {
          await xy.telegram.setChatDescription(xy.message.chat.id, newDescription);
          reply("✅ Deskripsi grup berhasil diubah.");
        } catch (error) {
          console.error("❌ Gagal mengubah deskripsi grup:", error);
          reply("⚠️ Gagal mengubah deskripsi grup. Pastikan bot memiliki izin.");
        }
        break;
      }

      case "changeppgc":
        if (!xy.chat.type.includes("group")) return xy.reply("❌ Perintah ini hanya bisa digunakan di grup.");
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);
        if (!("photo" in xy.message)) return reply("❌ Kirim atau balas foto dengan perintah ini untuk mengubah foto profil grup.");

        try {
          const chatId = xy.chat.id;
          const botMember = await xy.getChatMember(xy.botInfo.id);

          if (!["administrator", "creator"].includes(botMember.status)) {
            return xy.reply("❌ Bot harus menjadi admin untuk mengubah foto profil grup.");
          }

          const userMember = await xy.getChatMember(xy.from.id);
          if (!["administrator", "creator"].includes(userMember.status)) {
            return xy.reply("❌ Kamu harus menjadi admin untuk mengganti foto grup.");
          }

          const fileId = xy.message.photo.pop().file_id;
          const fileLink = await xy.telegram.getFileLink(fileId);
          const response = await axios.get(fileLink.href, {
            responseType: "arraybuffer"
          });

          const tempPath = `./temp_${chatId}.jpg`;
          fs.writeFileSync(tempPath, response.data);

          await xy.telegram.setChatPhoto(chatId, {
            source: tempPath
          });
          fs.unlinkSync(tempPath);

          xy.reply("✅ Foto profil grup berhasil diubah!");
        } catch (error) {
          console.error("❌ Gagal mengubah foto profil grup:", error);
          xy.reply("❌ Terjadi kesalahan saat mengubah foto profil grup.");
        }
        break;

      case "promote":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return xy.reply(global.mess.admin);
        if (!xy.message.reply_to_message) return xy.reply("⚠️ Balas pesan pengguna yang ingin dipromosikan menjadi admin.");

        let userToPromote = xy.message.reply_to_message.from.id;
        try {
          await xy.telegram.promoteChatMember(xy.chat.id, userToPromote, {
            can_change_info: false,
            can_delete_messages: true,
            can_invite_users: true,
            can_restrict_members: true,
            can_pin_messages: true,
            can_manage_chat: true
          });
          xy.reply(`✅ @${xy.message.reply_to_message.from.username || xy.message.reply_to_message.from.first_name} telah dipromosikan menjadi admin.`);
        } catch (error) {
          console.error("❌ Gagal mempromosikan pengguna:", error);
          xy.reply("❌ Terjadi kesalahan saat mempromosikan pengguna.");
        }
        break;

      case "demote":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return xy.reply(global.mess.admin);
        if (!xy.message.reply_to_message) return xy.reply("⚠️ Balas pesan pengguna yang ingin dicabut adminnya.");

        let userToDemote = xy.message.reply_to_message.from.id;
        try {
          await xy.telegram.promoteChatMember(xy.chat.id, userToDemote, {
            can_change_info: false,
            can_delete_messages: false,
            can_invite_users: false,
            can_restrict_members: false,
            can_pin_messages: false,
            can_manage_chat: false
          });
          xy.reply(`✅ @${xy.message.reply_to_message.from.username || xy.message.reply_to_message.from.first_name} telah dicabut status adminnya.`);
        } catch (error) {
          console.error("❌ Gagal mencabut status admin pengguna:", error);
          xy.reply("❌ Terjadi kesalahan saat mencabut status admin pengguna.");
        }
        break;

      case "delete":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return xy.reply(global.mess.admin);
        if (!xy.message.reply_to_message) return xy.reply("⚠️ Balas pesan yang ingin dihapus dengan perintah `/delete`.");

        try {
          await xy.telegram.deleteMessage(xy.chat.id, xy.message.reply_to_message.message_id);
          xy.reply("✅ Pesan berhasil dihapus.", {
            reply_to_message_id: xy.message.message_id
          });
        } catch (error) {
          console.error("❌ Gagal menghapus pesan:", error);
          xy.reply("❌ Terjadi kesalahan saat menghapus pesan.");
        }
        break;

      case "pin":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return xy.reply(global.mess.admin);
        if (!xy.message.reply_to_message) return xy.reply("⚠️ Balas pesan yang ingin disematkan dengan perintah `/pin`.");

        try {
          await xy.telegram.pinChatMessage(xy.chat.id, xy.message.reply_to_message.message_id);
          xy.reply("📌 Pesan berhasil disematkan.", {
            reply_to_message_id: xy.message.message_id
          });
        } catch (error) {
          console.error("❌ Gagal menyematkan pesan:", error);
          xy.reply("❌ Terjadi kesalahan saat menyematkan pesan.");
        }
        break;

      case "unpin":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return xy.reply(global.mess.admin);
        if (!xy.message.reply_to_message) return xy.reply("⚠️ Balas pesan yang ingin dilepas dari sematan dengan perintah `/unpin`.");

        try {
          await xy.telegram.unpinChatMessage(xy.chat.id, xy.message.reply_to_message.message_id);
          xy.reply("📌 Pesan berhasil dilepas dari sematan.", {
            reply_to_message_id: xy.message.message_id
          });
        } catch (error) {
          console.error("❌ Gagal melepas sematan:", error);
          xy.reply("❌ Terjadi kesalahan saat melepas sematan.");
        }
        break;

      case "createpolling":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return xy.reply(global.mess.admin);
        if (!text) return xy.reply("⚠️ Masukkan pertanyaan polling dan opsi jawaban.\n\nContoh:\n`/createpolling Apa makanan favorit kalian?, Nasi Goreng, Mie Ayam, Bakso`", {
          parse_mode: "Markdown"
        });

        try {
          let [question, ...options] = text.split(",").map(a => a.trim());

          if (!question || options.length < 2) {
            return xy.reply("⚠️ Format salah! Minimal harus ada 2 opsi jawaban.\n\nContoh:\n`/createpolling Apa makanan favorit kalian?, Nasi Goreng, Mie Ayam, Bakso`", {
              parse_mode: "Markdown"
            });
          }

          await xy.telegram.sendPoll(xy.chat.id, question, options, {
            is_anonymous: false
          });
          xy.reply("📊 Polling berhasil dibuat!", {
            reply_to_message_id: xy.message.message_id
          });
        } catch (error) {
          console.error("❌ Gagal membuat polling:", error);
          xy.reply("❌ Terjadi kesalahan saat membuat polling.");
        }
        break;

      case "groupstats":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);

        try {
          const chat = await xy.telegram.getChat(xy.chat.id);
          const memberCount = await xy.telegram.getChatMembersCount(xy.chat.id);
          const admins = await xy.telegram.getChatAdministrators(xy.chat.id);

          let message = `📊 *Statistik Grup*\n\n`;
          message += `📌 *Nama Grup:* ${chat.title}\n`;
          message += `🆔 *ID Grup:* ${xy.chat.id}\n`;
          message += `👥 *Total Anggota:* ${memberCount}\n`;
          message += `👮‍♂️ *Total Admin:* ${admins.length}\n`;

          xy.reply(message, {
            parse_mode: "Markdown"
          });

        } catch (error) {
          console.error("❌ Gagal mengambil statistik grup:", error);
          xy.reply("❌ Terjadi kesalahan saat mengambil statistik grup.");
        }
        break;

      case "linkgroup":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return xy.reply(global.mess.admin);

        try {
          const inviteLink = await xy.telegram.exportChatInviteLink(xy.chat.id);
          xy.reply(`🔗 *Link Undangan Grup:*\n${inviteLink}`, {
            parse_mode: "Markdown"
          });

        } catch (error) {
          console.error("❌ Gagal mendapatkan link grup:", error);
          xy.reply("❌ Terjadi kesalahan saat mengambil link grup. Pastikan bot adalah admin dan memiliki izin mengundang anggota.");
        }
        break;

      case "warn":
    if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
    if (!isGroupAdmins && !isOwner) return xy.reply(global.mess.admin);

    let targetUser = xy.message.reply_to_message?.from;
    if (!targetUser) return xy.reply("⚠️ Balas pesan anggota yang ingin diberi peringatan.");

    let userId = targetUser.id;
    let reason = text || "Tanpa alasan";

    if (!warnDB[userId]) warnDB[userId] = [];

    warnDB[userId].push(reason);
    saveWarnDB(warnDB);

    let warnCount = warnDB[userId].length;
    let warnMsg = `⚠️ ${targetUser.first_name} telah diperingatkan!\n🔹 Alasan: ${reason}\n📌 Total peringatan: ${warnCount}/3`;

    let sentMessage = await xy.telegram.sendMessage(xy.chat.id, warnMsg, {
        reply_markup: {
            inline_keyboard: [[{
                text: "❌ Batalkan Peringatan",
                callback_data: `cancel_warn_${userId}`
            }]]
        }
    });

    pendingWarns.set(userId, sentMessage.message_id);

    // Hapus pesan yang di-reply
    if (xy.message.reply_to_message) {
        await xy.telegram.deleteMessage(xy.chat.id, xy.message.reply_to_message.message_id);
    }

    if (warnCount >= 3) {
        await xy.telegram.kickChatMember(xy.chat.id, userId);
        delete warnDB[userId];
        saveWarnDB(warnDB);
        await xy.telegram.sendMessage(xy.chat.id, `🚨 ${targetUser.first_name} telah dikeluarkan karena mencapai batas peringatan.`);
    }
    break;

      case "warns":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);

        let target = xy.message.reply_to_message?.from;
        if (!target) return xy.reply("⚠️ Balas pesan anggota untuk melihat peringatannya.");

        let warns = warnDB[target.id] || [];
        if (warns.length === 0) return xy.reply(`✅ <b>${target.first_name}</b> belum memiliki peringatan.`, {
          parse_mode: "HTML"
        });

        let warnList = warns.map((r, i) => `${i + 1}. ${r}`).join("\n");
        xy.reply(`⚠️ Peringatan untuk <b>${target.first_name}</b>:\n\n${warnList}`, {
          parse_mode: "HTML"
        });
        break;

      case "resetwarn":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return xy.reply(global.mess.admin);

        let resetUser = xy.message.reply_to_message?.from;
        if (!resetUser) return xy.reply("⚠️ Balas pesan anggota untuk menghapus peringatannya.");

        delete warnDB[resetUser.id];
        saveWarnDB(warnDB);
        xy.reply(`✅ Peringatan <b>${resetUser.first_name}</b> telah dihapus.`, {
          parse_mode: "HTML"
        });
        break;

      case 'tiktokslide': {
        if (!text) return reply(`Gunakan perintah ini dengan cara ${prefix + command} *url*\n\n_Contoh_\n\n${prefix + command} https://vt.tiktok.com/ZSYg43AwX/`);

        await reply('⏳ Sedang memproses...');

        try {
          let result = await Tiktok.Downloader(text, {
            version: "v1",
            proxy: null
          });

          if (result.status === "success") {
            const push = [];
            let i = 1;

            if (result.result.music && result.result.music.playUrl[0]) {
              const audioUrl = result.result.music.playUrl[0];
              await xy.telegram.sendAudio(chatId, {
                url: audioUrl
              }, {
                caption: '🎵 Audio TikTok'
              });
            }

            if (result.result.type === "image" && result.result.images && result.result.images.length > 0) {
              const images = result.result.images;
              const author = result.result.author;
              const description = result.result.description;
              const statistics = result.result.statistics;
              const urlCreator = result.result.author.url;

              for (let imageUrl of images) {
                await xy.telegram.sendPhoto(chatId, {
                  url: imageUrl
                }, {
                  caption: `📸 Gambar ke-${i++}\n👤 ${author.nickname}\n📝 ${description}`
                });
              }

              await xy.telegram.sendMessage(chatId, {
                text: `📊 Statistik:\n👀 Views: ${statistics.playCount}\n🔄 Shares: ${statistics.shareCount}\n💬 Comments: ${statistics.commentCount}\n📥 Downloads: ${statistics.downloadCount}\n👤 Creator: [${author.nickname}](${urlCreator})`,
                parse_mode: "Markdown"
              });
            } else {
              await xy.telegram.sendMessage(chatId, {
                text: `⚠️ Konten TikTok yang diberikan tidak berupa audio maupun gambar.`
              });
            }
          } else {
            await xy.telegram.sendMessage(chatId, {
              text: `❌ Gagal mengunduh TikTok.`
            });
          }
        } catch (error) {
          console.error(`Error processing TikTok: ${error}`);
          await xy.telegram.sendMessage(chatId, {
            text: `❌ Terjadi kesalahan saat memproses TikTok.`
          });
        }

        break;
      }

      case 'pinterest':
      case 'pin': {
        if (!text) return reply(`• *Example:* ${prefix + command} Nakano Miku`);

        await reply('⏳ Sedang mencari gambar...');

        try {
          let images = await pinterest(text);

          if (images.length === 0) {
            return xy.telegram.sendMessage(chatId, {
              text: `❌ Tidak ditemukan gambar untuk "${text}".`
            });
          }

          images = images.sort(() => Math.random() - 0.5);

          let selectedImages = images.slice(0, 5);
          let i = 1;

          for (let imageUrl of selectedImages) {
            await xy.telegram.sendPhoto(chatId, imageUrl, {
              caption: `📸 Gambar ke-${i++}`
            });
          }

          await xy.telegram.sendMessage(chatId, {
            text: `✅ Berikut hasil pencarian Pinterest untuk "${text}".`
          });

        } catch (error) {
          console.error('Error fetching Pinterest images:', error);
          await xy.telegram.sendMessage(chatId, {
            text: `❌ Terjadi kesalahan saat mengambil gambar dari Pinterest.`
          });
        }
      }
      break;

      case 'remini': {
        if (!xy.message.reply_to_message.photo) {
          return reply('Dimana gambarnya? Reply gambar dengan perintah ini.');
        }

        await reply('⏳ Sedang memproses gambar...');

        const {
          remini
        } = require('./src/lib/remini');

        try {
          let fileId = xy.message.reply_to_message.photo[xy.message.reply_to_message.photo.length - 1].file_id;
          let fileLink = await xy.telegram.getFileLink(fileId);
          let response = await axios.get(fileLink, {
            responseType: 'arraybuffer'
          });

          let hasil = await remini(response.data, "enhance");

          await xy.telegram.sendPhoto(chatId, {
            source: Buffer.from(hasil)
          }, {
            caption: `✨ Gambar telah ditingkatkan kualitasnya!`
          });

        } catch (error) {
          console.error("Error di Remini:", error);
          await xy.telegram.sendMessage(chatId, {
            text: "❌ Gagal meningkatkan kualitas gambar."
          });
        }

        break;
      }

      case 'qc': {
        if (!isOwner) return reply(mess.owner);

        let teks = xy.message.reply_to_message ? xy.message.reply_to_message.text : text ? text : "";
        if (!teks) return reply("Cara penggunaan: /qc teks (atau reply pesan)");

        let userId = xy.message.reply_to_message ? xy.message.reply_to_message.from.id : xy.message.from.id;
        let username = xy.message.reply_to_message ? xy.message.reply_to_message.from.first_name : xy.message.from.first_name;

        let avatar;
        try {
          let photos = await xy.telegram.getUserProfilePhotos(userId);
          avatar = photos.total_count > 0 ?
            await xy.telegram.getFileLink(photos.photos[0][0].file_id) :
            "https://i0.wp.com/telegra.ph/file/134ccbbd0dfc434a910ab.png"; // Avatar default jika tidak ada foto profil
        } catch (err) {
          console.error("Gagal mengambil foto profil:", err);
          avatar = "https://i0.wp.com/telegra.ph/file/134ccbbd0dfc434a910ab.png";
        }

        const json = {
          type: "quote",
          format: "png",
          backgroundColor: "#FFFFFF",
          width: 700,
          height: 580,
          scale: 2,
          "messages": [{
            "entities": [],
            "avatar": true,
            "from": {
              "id": 1,
              "name": username,
              "photo": {
                "url": avatar
              }
            },
            "text": teks,
            "replyMessage": {}
          }],
        };

        axios.post("https://bot.lyo.su/quote/generate", json, {
            headers: {
              "Content-Type": "application/json"
            },
          })
          .then(async (res) => {
            const buffer = Buffer.from(res.data.result.image, "base64");
            await xy.telegram.sendSticker(xy.message.chat.id, {
              source: buffer
            });
          })
          .catch(err => {
            console.error(err);
            reply("Gagal membuat QC.");
          });

        break;
      }
      
        case 'brat': {
            if (!text) return xy.reply('Masukkan teks untuk stiker.\n\nContoh:\n/brat Xiety');

            async function BratGenerator(teks) {
                let width = 512;
                let height = 512;
                let margin = 20;
                let wordSpacing = 50;
                let canvas = createCanvas(width, height);
                let xy = canvas.getContext('2d');

                xy.fillStyle = 'white';
                xy.fillRect(0, 0, width, height);
                let fontSize = 280;
                let lineHeightMultiplier = 1.3;
                xy.textAlign = 'left';
                xy.textBaseline = 'top';
                xy.fillStyle = 'black';

                registerFont('./lib/arialnarrow.ttf', { family: 'Narrow' });

                let words = teks.split(' ');
                let lines = [];

                let rebuildLines = () => {
                    lines = [];
                    let currentLine = '';
                    for (let word of words) {
                        let testLine = currentLine ? `${currentLine} ${word}` : word;
                        let lineWidth = xy.measureText(testLine).width + (currentLine.split(' ').length - 1) * wordSpacing;
                        if (lineWidth < width - 2 * margin) {
                            currentLine = testLine;
                        } else {
                            lines.push(currentLine);
                            currentLine = word;
                        }
                    }
                    if (currentLine) {
                        lines.push(currentLine);
                    }
                };

                xy.font = `${fontSize}px Narrow`;
                rebuildLines();

                while (lines.length * fontSize * lineHeightMultiplier > height - 2 * margin) {
                    fontSize -= 2;
                    xy.font = `${fontSize}px Narrow`;
                    rebuildLines();
                }

                let lineHeight = fontSize * lineHeightMultiplier;
                let y = margin;
                for (let line of lines) {
                    let wordsInLine = line.split(' ');
                    let x = margin;
                    for (let word of wordsInLine) {
                        xy.fillText(word, x, y);
                        x += xy.measureText(word).width + wordSpacing;
                    }
                    y += lineHeight;
                }

                let buffer = canvas.toBuffer('image/png');
                let image = await Jimp.read(buffer);
                image.blur(3);
                let blurredBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

                return xy.replyWithSticker({ source: blurredBuffer });
            }

            await BratGenerator(text);
            break;
            }
           
      default:
    }
  } catch (e) {
    console.log(e);
  }
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(`Update File Terbaru ${__filename}`)
  delete require.cache[file]
  require(file)
})