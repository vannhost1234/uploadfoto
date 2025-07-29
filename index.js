require('./settings');

require('./src/message')
const {
  Telegraf,
  Markup
} = require('telegraf');

const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const axios = require("axios");
const path = require('path');
const archiver = require('archiver');
const fetch = require('node-fetch');
const canvafy = require("canvafy");
const connectwa = require("./src/lib/connectwa");

const panelBillingPath = './src/database/panel-billing.json';
const thumbnailPath = path.join(__dirname, "src/image/thumbnail.jpg");
const db_respon_list = JSON.parse(fs.readFileSync('./src/database/list.json'));
const {
  addResponList1,
  delResponList1,
  isAlreadyResponList1,
  isAlreadyResponList1Group,
  sendResponList1,
  updateResponList1,
  getDataResponList1
} = require('./src/lib/addlist');
const warnFile = path.join(__dirname, "./src/database/warns.json");
let seller = JSON.parse(fs.readFileSync('./src/database/seller.json'));
const owners = JSON.parse(fs.readFileSync('./owner.json', 'utf8'));


const readlineSync = require('readline-sync');

const tokenPath = path.join(__dirname, './src/database/token.json');

function askToken() {
  console.log('🔑 Masukkan Token Bot Telegram:');
  return readlineSync.question('> ').trim();
}

function getToken() {
  if (fs.existsSync(tokenPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
      if (data.token && data.token.trim() !== '') {
        return data.token.trim();
      }
    } catch (err) {
      console.log('⚠️ Gagal membaca token.json, meminta token baru...');
    }
  }

  const token = askToken();

  if (!token) {
    console.log('❌ Token kosong! Program dihentikan.');
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(tokenPath), { recursive: true });
  fs.writeFileSync(tokenPath, JSON.stringify({ token }, null, 2));
  console.log('✅ Token berhasil disimpan!');
  
  return token;
}

const botToken = getToken();
const bot = new Telegraf(botToken);

function readWarnDB() {
  try {
    if (fs.existsSync(warnFile)) {
      return JSON.parse(fs.readFileSync(warnFile, "utf8"));
    }
    return {}; // Jika file tidak ada, kembalikan objek kosong
  } catch (error) {
    console.error("❌ Error membaca warnDB:", error);
    return {}; // Jika terjadi error, kembalikan objek kosong agar tidak crash
  }
}

function saveWarnDB(data) {
  try {
    fs.writeFileSync(warnFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Error menyimpan warnDB:", error);
  }
}

let warnDB = readWarnDB();
let pendingWarns = new Map();

const ownerIds = global.owner || [];







async function backupAndSend(xy) {
  const foldersToBackup = [
  'src',
  'sessions'
  ];
  const filesToBackup = [
    'package.json',
    'bot.js',
    'run.js',
    'owner.json',
    'settings.js',
    'xy.js',
    'index.js'
  ];

  const zipFileName = 'backup.zip';

  const output = fs.createWriteStream(zipFileName);
  const archive = archiver('zip', {
    zlib: {
      level: 9
    }
  });

  output.on('close', async () => {
    await sendBackupToTelegram(xy, zipFileName);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  for (const folder of foldersToBackup) {
    const folderPath = `./${folder}`;
    if (fs.existsSync(folderPath)) {
      archive.directory(folderPath, folder);
    } else {
      console.log(`📂 Folder '${folderPath}' tidak ditemukan.`);
    }
  }

  for (const file of filesToBackup) {
    const filePath = `./${file}`;
    if (fs.existsSync(filePath)) {
      archive.file(filePath, {
        name: file
      });
    } else {
      console.log(`📄 File '${filePath}' tidak ditemukan.`);
    }
  }

  archive.finalize();
}

async function sendBackupToTelegram(xy, zipFileName) {
  try {
    const ownerId = owners[0];

    if (!ownerId || isNaN(ownerId)) {
      console.error('❌ ID Owner tidak valid atau tidak ditemukan.');
      return;
    }

    const fileSize = fs.statSync(zipFileName).size / (1024 * 1024);
    const formattedDate = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta'
    });

    const caption = `📦 *Backup Bot Berhasil!* 📦\n\n📁 *Ukuran*: ${fileSize.toFixed(2)} MB\n📆 *Tanggal*: ${formattedDate}\n\n✅ Simpan backup ini dengan baik!`;

await xy.telegram.sendDocument(ownerId, {
  source: zipFileName
}, {
  caption,
  parse_mode: 'Markdown'
});
    console.log(`📤 Backup dikirim ke owner: ${ownerId}`);

    fs.unlinkSync(zipFileName);
  } catch (error) {
    console.error('❌ Gagal mengirim backup ke Telegram:', error.message);
  }
}

function checkExpiredSellers() {
  let now = Date.now();
  let updatedSellers = seller.filter(s => s.expiresAt > now);

  if (updatedSellers.length !== seller.length) {
    seller = updatedSellers;
    fs.writeFileSync('./src/database/seller.json', JSON.stringify(seller, null, 2));
    console.log('✅ Seller yang expired telah dihapus otomatis.');
  }
}


function runBot() {

  (async () => {
    await connectwa.restoreWhatsAppSessions();
    console.log("✅ Semua sesi berhasil direstore. Bot siap digunakan.");
  })();

  setInterval(() => {
    backupAndSend(bot);
  }, 21600000);

  setInterval(() => {
    checkExpiredSellers(bot);
  }, 3000);

   bot.start((xy) => {
    const inlineKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [{
            text: 'Info Script',
            callback_data: 'info_script'
          }], 
          [{
            text: 'Kreator Script',
            callback_data: 'creator'
          }],
          [{
              text: 'Buka Menu',
              callback_data: 'mainmenu'
            } // Tombol untuk buka menu
          ]
        ]
      }
    };

    xy.reply('Hallo Selamat Datang Di Bot Vann Hosting\n\nSilahkan Menikmati :)', inlineKeyboard);
  });

bot.action("info_script", (ctx) => {
  ctx.reply(
    "📜 Info Script:\nScript ini gratis dan tersedia di YouTube.\nKlik tombol di bawah untuk menonton!",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📺 Chanel YouTube",
              url: "https://youtube.com/@vannhosting"
            }
          ]
        ]
      }
    }
  );
});

bot.action("creator", (ctx) => {
  ctx.reply(
    "👤 Kreator Bot:\nUntuk informasi lebih lanjut, klik tombol di bawah.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "💬 Chat Kreator",
              url: "https://t.me/vannhosting"
            }
          ]
        ]
      }
    }
  );
});
    
  async function sendMainMenu(xy) {
    const info = `
🤖 INFO BOT

• Nama Bot: Vann Hosting
• Status Kamu: User Biasa
• Version: 1.0.0

🔘 Silakan pilih menu:`;

    try {
      await xy.replyWithPhoto({
        source: thumbnailPath
      }, {
        caption: info,
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [Markup.button.callback("📌 Owner Menu", "ownermenu")],
          [Markup.button.callback("🛠️ Tools Menu", "toolsmenu")],
          [Markup.button.callback("📥 Downloader Menu", "downloadermenu")],
          [Markup.button.callback("🎛️ Installer Panel", "installermenu")],
          [Markup.button.callback("👥 Group Menu", "groupmenu")],
        ]),
      });
    } catch (error) {
      console.error("❌ Gagal mengirim gambar:", error);
    }
  }

  const menus = {
    ownermenu: {
      caption: `${ownermenu}`,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    toolsmenu: {
      caption: `${toolsmenu}`,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    downloadermenu: {
      caption: `${downloadmenu}`,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    resellerpanel: {
      caption: `${resellerpanel}`,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    cpanelowner: {
      caption: `${cpanelowner}`,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    storemenu: {
      caption: `${storemenu}`,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    installermenu: {
      caption: `${installermenu}`,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    groupmenu: {
      caption: `${groupmenu}`,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
  };

  bot.command("menu", async (xy) => {
    await sendMainMenu(xy);
  });

  Object.keys(menus).forEach((menu) => {
    bot.action(menu, async (xy) => {
      try {
        await xy.editMessageMedia({
          type: "photo",
          media: {
            source: thumbnailPath
          },
          caption: menus[menu].caption,
        }, {
          ...Markup.inlineKeyboard(menus[menu].buttons)
        });
      } catch (error) {
        console.error("❌ Gagal mengedit pesan:", error);
      }
    });
  });

  bot.action("mainmenu", async (xy) => {
    try {
      await xy.editMessageMedia({
        type: "photo",
        media: {
          source: thumbnailPath
        },
        caption: `
🤖 INFO BOT

• Nama Bot: Vann Hosting
• Status Kamu: User Biasa
• Version: 1.0.0

🔘 Silakan pilih menu:`,
      }, {
        ...Markup.inlineKeyboard([
          [Markup.button.callback("📌 Owner Menu", "ownermenu")],
          [Markup.button.callback("🛠️ Tools Menu", "toolsmenu")],
          [Markup.button.callback("📥 Downloader Menu", "downloadermenu")],
          [Markup.button.callback("🎛️ Installer Panel", "installermenu")],
          [Markup.button.callback("👥 Group Menu", "groupmenu")],
        ]),
      });
    } catch (error) {
      console.error("❌ Gagal mengedit pesan:", error);
    }
  });

  bot.on('sticker', (ctx) =>
    ctx.reply('👍')

  )





  bot.on("new_chat_members", async (ctx) => {
    ctx.message.new_chat_members.forEach(async (user) => {
      let fileUrl = "https://i.ibb.co.com/0y40cqKM/images-1.jpg";

      try {
        const photos = await ctx.telegram.getUserProfilePhotos(user.id);
        if (photos.total_count > 0) {
          const fileId = photos.photos[0][0].file_id;
          const file = await ctx.telegram.getFile(fileId);
          fileUrl = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;

          const response = await axios.get(fileUrl, {
            responseType: "arraybuffer"
          });
          if (response.status !== 200) throw new Error("Gagal mengambil gambar");
        }
      } catch (error) {
        console.error("Gagal mengambil foto profil:", error);
      }

      let chatInfo = await ctx.telegram.getChat(ctx.chat.id);
      let groupName = chatInfo.title || "Grup Ini";
      let groupDesc = chatInfo.description ? chatInfo.description.substring(0, 200) : "Tidak ada deskripsi.";


      try {
        const welcomeImage = await new canvafy.WelcomeLeave()
          .setAvatar(fileUrl)
          .setBackground("image", "https://i.ibb.co.com/0y40cqKM/images-1.jpg")
          .setTitle("Welcome")
          .setDescription(`Selamat datang, ${user.first_name}`)
          .setBorder("#2a2e35")
          .setAvatarBorder("#2a2e35")
          .setOverlayOpacity(0.3)
          .build();

        fs.writeFileSync("welcome.png", Buffer.from(welcomeImage));

        await ctx.telegram.sendPhoto(ctx.chat.id, {
          source: "welcome.png"
        }, {
          caption: `🎉 Selamat datang di *${groupName}*, ${user.first_name}!\n\n📌 *Deskripsi Grup:* ${groupDesc}`,
          parse_mode: "Markdown"
        });
      } catch (err) {
        console.error(`Gagal mem
buat gambar:`, err);
      }
    });
  });


  bot.on("left_chat_member", async (ctx) => {
    const user = ctx.message.left_chat_member;
    let fileUrl = "https://i.ibb.co.com/0y40cqKM/images-1.jpg";

    try {
      const photos = await ctx.telegram.getUserProfilePhotos(user.id);
      if (photos.total_count > 0) {
        const fileId = photos.photos[0][0].file_id;
        const file = await ctx.telegram.getFile(fileId);
        fileUrl = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;

        const response = await axios.get(fileUrl, {
          responseType: "arraybuffer"
        });
        if (response.status !== 200) throw new Error("Gagal mengambil gambar");
      }
    } catch (error) {
      console.error("Gagal mengambil foto profil:", error);
    }

    try {
      const leaveImage = await new canvafy.WelcomeLeave()
        .setAvatar(fileUrl)
        .setBackground("image", "https://i.ibb.co.com/0y40cqKM/images-1.jpg")
        .setTitle("Goodbye")
        .setDescription(`${user.first_name} telah keluar.`)
        .setBorder("#ff0000")
        .setAvatarBorder("#ff0000")
        .setOverlayOpacity(0.3)
        .build();

      fs.writeFileSync("leave.png", Buffer.from(leaveImage));

      await ctx.telegram.sendPhoto(ctx.chat.id, {
        source: "leave.png"
      }, {
        caption: `👋 Sampai jumpa, ${user.first_name}!`
      });
    } catch (err) {
      console.error("Gagal membuat gambar:", err);
    }
  });








  bot.on("callback_query", async (xy) => {
    const callbackQuery = xy.callbackQuery;
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    const chatId = msg?.chat.id;
    const messageId = msg?.message_id;

    if (data.startsWith("list_")) {
      let [, chatId, key] = data.split("_");
      chatId = parseInt(chatId);

      if (msg.chat.id !== chatId) return await xy.answerCbQuery();

      let getData = db_respon_list.find(item => item.id === chatId && item.key === key);

      if (!getData) {
        return await xy.answerCbQuery("❌ Data tidak ditemukan!", {
          show_alert: true
        });
      }

      if (getData.isImage && getData.image_url !== "-") {
        try {
          const response = await axios.get(getData.image_url, {
            responseType: "arraybuffer"
          });
          const imagePath = `./temp_${chatId}_${key}.jpg`; // Simpan sementara

          fs.writeFileSync(imagePath, response.data);

          await xy.replyWithPhoto({
            source: imagePath
          }, {
            caption: `📌 *${key}*\n\n${getData.response}`,
            parse_mode: "Markdown"
          });

          fs.unlinkSync(imagePath);
        } catch (error) {
          await xy.reply("❌ Gagal mengunduh atau mengirim gambar.");
        }
      } else {
        await xy.reply(`📌 *${key}*\n\n${getData.response}`, {
          parse_mode: "Markdown"
        });
      }
      await xy.answerCbQuery();
    }

    if (data.startsWith("cancel_warn_")) {
    let warnedUserId = parseInt(data.split("_")[2]); // Ambil user ID
    console.log(warnedUserId);

    if (!warnDB[warnedUserId]) {
        return xy.answerCbQuery(callbackQuery.id, {
            text: "⚠️ Tidak ada peringatan yang bisa dibatalkan.",
            show_alert: true,
        });
    }

    warnDB[warnedUserId].pop(); // Hapus satu peringatan terakhir
    saveWarnDB(warnDB); // Simpan perubahan ke database

    let warnCount = warnDB[warnedUserId]?.length || 0; // Cek jumlah peringatan yang tersisa
    let targetNameMatch = callbackQuery.message.text.match(/⚠️\s(.*?) telah diperingatkan/);
    let targetName = targetNameMatch ? targetNameMatch[1] : "Pengguna"; // Ambil nama user dengan aman

    let updatedMsg = `⚠️ ${targetName} telah diperingatkan!\n📌 Total peringatan: ${warnCount}/3`;

    let replyMarkup = warnCount > 0 ? {
        inline_keyboard: [[{
            text: "❌ Batalkan Peringatan",
            callback_data: `cancel_warn_${warnedUserId}`
        }]]
    } : {};

    await xy.telegram.editMessageText(callbackQuery.message.chat.id, callbackQuery.message.message_id, null, updatedMsg, {
        reply_markup: replyMarkup
    });

    return xy.answerCbQuery(callbackQuery.id, {
        text: "✅ Peringatan berhasil dibatalkan!",
        show_alert: true,
    });
}   

    if (data.startsWith("listpanel")) {
      let halamanPanel = parseInt(data[1]);

      if (halamanPanel > 25) return;


      let response = await fetch(`${global.domain}/api/application/servers?page=${halamanPanel}&per_page=25`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${global.plta}`
        }
      });

      let hasil = await response.json();

      if (!response.ok || hasil.errors || !hasil.data || hasil.data.length === 0) {
        return xy.telegram.answerCallbackQuery(query.id, {
          text: "❌ Gagal memuat data.",
          show_alert: true
        });
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

      await xy.telegram.editMessageText(chatId, messageId, null, daftarServer, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: buttons.length > 0 ? [buttons] : []
        }
      })
      xy.answerCbQuery();
    }
  });

  let warningData = {}; // Data peringatan sementara (tanpa database)

  bot.on("message", async (xy) => {
    require('./xy')(xy, bot);
    const msg = xy.message;
    if (!msg.chat || !msg.chat.id || !msg.from || msg.from.is_bot) return;

    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const messageText = msg.text || "";
    const entities = msg.entities || [];

    let antilinkStatus = false;
    try {
      let listData = JSON.parse(fs.readFileSync("./src/database/antilink.json", "utf8"));
      const groupData = listData.find((item) => item.id === chatId);
      if (groupData) {
        antilinkStatus = groupData.antilink;
      }
    } catch (error) {
      console.error("Gagal membaca database antilink:", error);
    }

    if (!antilinkStatus) return;

    let isAdmin = false;
    try {
      const chatAdmins = await xy.getChatAdministrators();
      isAdmin = chatAdmins.some((admin) => admin.user.id === userId);
    } catch (error) {
      console.error("Gagal mengambil daftar admin:", error);
    }

    if (isAdmin) return;

    let containsLink = /(https?:\/\/[^\s]+)/.test(messageText);

    for (let entity of entities) {
      if (entity.type === "text_link" || entity.type === "url") {
        containsLink = true;
        break;
      }
    }

    if (containsLink) {
      try {
        await xy.deleteMessage();

        if (!warningData[chatId]) warningData[chatId] = {};
        if (!warningData[chatId][userId]) warningData[chatId][userId] = 0;

        warningData[chatId][userId]++;

        if (warningData[chatId][userId] < 3) {
          xy.replyWithMarkdown(`⚠️ *Peringatan ${warningData[chatId][userId]}/3!* ${msg.from.first_name}, jangan kirim link!`);
        } else {
          const muteUntil = Math.floor(Date.now() / 1000) + 10800; // 3 jam dalam detik
          await xy.restrictChatMember(userId, {
            permissions: {
              can_send_messages: false,
              can_send_media_messages: false,
              can_send_polls: false,
              can_send_other_messages: false,
              can_add_web_page_previews: false,
            },
            until_date: muteUntil,
          });

          xy.replyWithMarkdown(`🚨 ${msg.from.first_name} telah mencapai 3 pelanggaran! Mereka telah di-mute selama 3 jam.`);

          warningData[chatId][userId] = 0;
        }
      } catch (error) {
        console.error("❌ Gagal menghapus pesan atau mute user:", error);
      }
    }
  });

  function getGroupSettings(groupID) {
    let listData = JSON.parse(fs.readFileSync("./src/database/weleave.json", "utf8"));
    let group = listData.find((item) => item.id === groupID);
    return group || {
      welcome: false,
      leave: false
    };
  }

  const spinner = ora({
    text: 'Menghubungkan bot...',
    spinner: 'bouncingBar'
  }).start();

  bot.launch()
    .catch((error) => {
      spinner.fail('Gagal menghubungkan bot.');
      console.error('Error:', error.message);
    });

  setTimeout(async () => {
    try {
      const botInfo = await bot.telegram.getMe();
      spinner.succeed(`Bot berhasil terhubung sebagai @${botInfo.username}`);
      console.log(`Nama Bot: ${botInfo.first_name}`);
      console.log(`Bot ID: ${botInfo.id}`);
    } catch (error) {
      console.error('Gagal mengambil info bot:', error.message);
    }
  }, 3000); // Tunda 3 detik setelah bot dijalankan

}
runBot();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;