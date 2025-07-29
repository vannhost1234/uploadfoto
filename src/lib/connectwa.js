const {
  default: makeWASocket,
  Browsers,
  jidDecode,
  DisconnectReason,
  makeInMemoryStore,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const bot = require('../../bot');
const sleep = async (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const sessions = new Map();

// *Membuat folder sesi jika belum ada*
function ensureSessionDir(number) {
    const dir = `${SESSIONS_DIR}/${number}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
}

// *Menyimpan daftar sesi aktif ke file*
function updateActiveSessions() {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(Array.from(sessions.keys()), null, 2));
}

async function restoreWhatsAppSessions() {
    if (!fs.existsSync(SESSIONS_FILE)) {
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify([], null, 2));
    }

    const activeSessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf-8"));
    
    console.log(`📂 Menemukan ${activeSessions.length} sesi aktif.`);
    
    for (const number of activeSessions) {
        console.log(`🔄 Menghubungkan ulang sesi: ${number}`);
        await startWhatsAppSession(number);
    }
}

// *Memulihkan sesi WhatsApp saat bot restart*

// *Fungsi utama untuk menghubungkan WhatsApp*
async function startWhatsAppSession(number, chatId, messageId = null) {
    try {
        const sessionPath = ensureSessionDir(number);
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        const usePairingCode = true; // Selalu gunakan pairing code

        const waClient = makeWASocket({
            auth: state,
            printQRInTerminal: !usePairingCode,
            logger: pino({ level: "silent" }),
            browser: ["Linux", "Chrome", "121"],
            markOnlineOnConnect: true,
        });

        if (messageId) {
            await bot.telegram.editMessageText(chatId, messageId, undefined, `🔄 Menghubungkan ke WhatsApp: ${number}...`)
                .catch(() => {}); // Hindari error jika pesan tidak ditemukan
        }

        if (usePairingCode && !waClient.authState.creds.registered) {
            try {
                await sleep(3000)
                const code = await waClient.requestPairingCode(number.trim());
                if (!code) throw new Error("Pairing code tidak ditemukan.");

                const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

                if (chatId && messageId) {
                    await bot.telegram.editMessageText(chatId, messageId, undefined, `📲 Kode pairing untuk ${number}: \`${formattedCode}\``, {
                        parse_mode: "Markdown"
                    }).catch(() => {});
                }
            } catch (error) {
                console.error("⚠️ Gagal mendapatkan pairing code:", error);
                if (chatId && messageId) {
                    await bot.telegram.editMessageText(chatId, messageId, undefined, `❌ Gagal mendapatkan pairing code untuk ${number}.`)
                        .catch(() => {});
                }
            }
        }

        waClient.ev.on("connection.update", async (update) => {
    try {
        const { connection, lastDisconnect } = update;

        if (connection === "open") {
            sessions.set(number, waClient);
            updateActiveSessions();
            console.log(`✅ WhatsApp ${number} berhasil terhubung.`);
            if (chatId && messageId) {
                await bot.telegram.editMessageText(chatId, messageId, undefined, `✅ WhatsApp ${number} berhasil terhubung.`)
                    .catch(err => console.error("❌ Gagal edit pesan Telegram:", err));
            }
        } else if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log(`♻️ Mencoba menyambungkan ulang: ${number}...`);
                await startWhatsAppSession(number, chatId, messageId).catch(err => console.error("❌ Reconnect Error:", err));
            } else {
                console.log(`❌ Sesi WhatsApp ${number} terputus.`);
                sessions.delete(number);
                updateActiveSessions();
                if (chatId) {
                    await bot.telegram.sendMessage(chatId, `❌ WhatsApp ${number} terputus.`)
                        .catch(err => console.error("❌ Gagal kirim pesan Telegram:", err));
                }
                fs.rmSync(sessionPath, { recursive: true, force: true });
            }
        } else if (connection === "connecting" && chatId && messageId) {
            await bot.telegram.editMessageText(chatId, messageId, undefined, `🔄 Menghubungkan ke WhatsApp: ${number}...`)
                .catch(err => console.error("❌ Gagal edit pesan Telegram:", err));
        }
    } catch (err) {
        console.error("❌ Unhandled connection update error:", err);
    }
});

        waClient.ev.on("creds.update", saveCreds);
        return waClient;

    } catch (error) {
        console.error(`❌ Gagal menyambungkan WhatsApp ${number}:`, error);
    }
}


module.exports = { sessions, startWhatsAppSession, restoreWhatsAppSessions } 