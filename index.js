const TelegramBot = require('node-telegram-bot-api');
const { Client } = require('ssh2');

const settings = require('./config');
const botToken = settings.token;
const bot = new TelegramBot(botToken, { polling: true });
const sendMessage = (chatId, text) => bot.sendMessage(chatId, text);
function generateRandomPassword() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%^&*';
  const length = 10;
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Command Handler 'start'
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const startTime = Date.now();
    const menuText = `
╭── ❏「 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧 」❏
├ 𝙊𝙒𝙉𝙀𝙍 = @vannhost
├ 𝙋𝙀𝙈𝙄𝙇𝙄𝙆 = @vannhost
╰── ❏「 𝙑𝘼𝙉𝙉 𝙃𝙊𝙎𝙏 🚀  」❏

┏━━━━━[ 𝙈𝙀𝙉𝙐 𝙄𝙉𝙎𝙏𝘼𝙇𝙇 𝙋𝘼𝙉𝙀𝙇 ]━━━━━
┃❑ /installpanel ( 20 )
┃❑ /installpanelv2 ( 22 & 24 )
┃❑ /startwings
┃❑ /uninstallthema
┃❑ /uninstallpanel
┃━━━━━[ 𝙈𝙀𝙉𝙐 𝙄𝙉𝙎𝙏𝘼𝙇𝙇 𝙏𝙃𝙀𝙈𝘼 ]━━━━━
┃❑ /stellar ( STELLAR )
┃━━━━━[ 𝙑𝘼𝙉𝙉 𝙃𝙊𝙎𝙏 🚀 ]━━━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
// Event listener for button 'My Profil'
bot.on('callback_query', (callbackQuery) => {
  if (callbackQuery.data === 'myprofil') {
    bot.answerCallbackQuery(callbackQuery.id);
    bot.sendMessage(callbackQuery.from.id, 'Hallo, saya adalah My Profil. Bot Ini Milik @vannhost');
  }
});
// Event listener for button 'Start'
bot.on('callback_query', (callbackQuery) => {
    if (callbackQuery.data === 'start') {
        const chatId = callbackQuery.message.chat.id;
        const startTime = Date.now();

        const menuText = `
╭── ❏「 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧 」❏
├ 𝙊𝙒𝙉𝙀𝙍 = @vannhost
├ 𝙋𝙀𝙈𝙄𝙇𝙄𝙆 = @vannhost
╰── ❏「 𝙑𝘼𝙉𝙉 𝙃𝙊𝙎𝙏 🚀  」❏

┏━━━━━[ 𝙈𝙀𝙉𝙐 𝙄𝙉𝙎𝙏𝘼𝙇𝙇 𝙋𝘼𝙉𝙀𝙇 ]━━━━━
┃❑ /installpanel ( 20 )
┃❑ /installpanelv2 ( 22 & 24 )
┃❑ /startwings
┃❑ /uninstallthema
┃❑ /uninstallpanel
┃━━━━━[ 𝙈𝙀𝙉𝙐 𝙄𝙉𝙎𝙏𝘼𝙇𝙇 𝙏𝙃𝙀𝙈𝘼 ]━━━━━
┃❑ /stellar ( STELLAR )
┃━━━━━[ 𝙑𝘼𝙉𝙉 𝙃𝙊𝙎𝙏 🚀 ]━━━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
  const message = menuText;
 const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'VANN HOST', callback_data: 'ramlist' }, { text: '🙋‍♂️ My Profil', callback_data: 'myprofil' }],

                ]
            }
        };
        bot.answerCallbackQuery(callbackQuery.id);
        bot.editMessageText(message, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: keyboard,
            parse_mode: 'Markdown'
        });
    }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// ramlist2
const message = menuText;
const keyboard = {
  reply_markup: {
  inline_keyboard: [
  [{ text: 'VANN HOST', callback_data: 'ramlist' }, { text: '🙋‍♂️ My Profil', callback_data: 'myprofil' }],

            ]
        }
    }; 
    bot.sendMessage(chatId, message, keyboard);
});
bot.on('callback_query', (callbackQuery) => {
  if (callbackQuery.data === 'ramlist') {
    bot.answerCallbackQuery(callbackQuery.id);
    const ramListMessage = "▭▬▭( 𝐑𝐀𝐌 𝐘𝐀𝐍𝐆 𝐓𝐄𝐑𝐒𝐄𝐃𝐈𝐀 )▭▬▭\n• 1GB ( PREMIUM ) ✅\n• 2GB ( PREMIUM ) ✅\n• 3GB ( PREMIUM ) ✅\n• 4GB ( PREMIUM ) ✅\n• 5GB ( PREMIUM ) ✅\n• 6GB ( PREMIUM ) ✅\n• 7GB ( PREMIUM ) ✅\n• 8GB ( PREMIUM ) ✅\n• 9GB ( PREMIUM ) ✅\n• 10GB ( PREMIUM ) ✅\n• UNLI( PREMIUM ) ✅\n- /menupanel\n- /panel\n🛑 JOIN RESELLER CUMA 10K BANG 😁\nPowered By @vannhost";
    bot.editMessageText(ramListMessage, {
      chat_id: callbackQuery.message.chat.id,
      message_id: callbackQuery.message.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Kembali ke Menu Start', callback_data: 'start' }]
        ]
      }
    });
  }
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// Command Handler 'installpanel'
// INSTALL PANEL VPS VERSI 20.04.4
bot.onText(/^(\.|\#|\/)installpanel$/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Format salah!\nPenggunaan: /installpanel ipvps,password,domainpnl,domainnode,ramvps ( contoh : 80000 = ram 8)\nOwner @vannhost`);
  });
bot.onText(/\/installpanel(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];
  const t = text.split(',');
  if (settings.adminId.includes(String(msg.from.id))) {
  if (t.length < 5) {
    return bot.sendMessage(chatId, 'Format salah!\nPenggunaan: /installpanel ipvps,password,domainpnl,domainnode,ramvps ( contoh : 80000 = ram 8)\nOwner @vannhost');
  }
  const ipvps = t[0];
  const passwd = t[1];
  const subdomain = t[2];
  const domainnode = t[3];
  const ramvps = t[4];
  const connSettings = {
    host: ipvps,
    port: 22,
    username: 'root',
    password: passwd
  };
 let password = generateRandomPassword();
 const command = 'bash <(curl -s https://pterodactyl-installer.se)';
 const commandWings = 'bash <(curl -s https://pterodactyl-installer.se)';  
 const conn = new Client();

  conn.on('ready', () => {
    sendMessage(chatId, `PROSES PENGINSTALLAN SEDANG BERLANGSUNG MOHON TUNGGU 5-10MENIT\nscript by @vannhost`);
    conn.exec(command, (err, stream) => {
      if (err) throw err;

      stream.on('close', (code, signal) => {
        console.log(`Stream closed with code ${code} and signal ${signal}`);
        installWings(conn, domainnode, subdomain, password, ramvps);
      }).on('data', (data) => {
        handlePanelInstallationInput(data, stream, subdomain, password);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }).connect(connSettings);
  
  async function installWings(conn, domainnode, subdomain, password, ramvps) {
        sendMessage(chatId, `PROSES PENGINSTALLAN WINGS SEDANG BERLANGSUNG MOHON TUNGGU 5 MENIT\nscript by @vannhost`);
        conn.exec(commandWings, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Wings installation stream closed with code ${code} and signal ${signal}');
                createNode(conn, domainnode, ramvps, subdomain, password);
            }).on('data', (data) => {
                handleWingsInstallationInput(data, stream, domainnode, subdomain);
        }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }

    async function createNode(conn, domainnode, ramvps, subdomain, password) {
        const command = 'bash <(curl https://raw.githubusercontent.com/zerodevxc/revan/refs/heads/main/install.sh)';
        sendMessage(chatId, `MEMULAI CREATE NODE & LOCATION\nscript by @vannhost`);     
        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Node creation stream closed with code ${code} and ${signal} signal');
                conn.end();
                sendPanelData(subdomain, password);
            }).on('data', (data) => {
                handleNodeCreationInput(data, stream, domainnode, ramvps);
        }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }
        
   // Func Handler 'sendPanelData' 
    function sendPanelData(subdomain, password) {
        sendMessage(chatId,`DATA PANEL ANDA\n\nUSERNAME: adm\nPASSWORD: ${password}\nLOGIN: ${subdomain}\n\nNote: Semua Instalasi Telah Selesai Silahkan Create Allocation Di Node Yang Di buat Oleh Bot Dan Ambil Token Configuration dan ketik .startwings (token) \nNote: HARAP TUNGGU 1-5MENIT BIAR WEB BISA DI BUKA\nscript by @vannhost`);
    }
    
   // Func Handler 'handlePanelInstallationInput' 
   function handlePanelInstallationInput(data, stream, subdomain, password) {
        if (data.toString().includes('Input')) {
            stream.write('0\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('1248\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('Asia/Jakarta\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('admin@gmail.com\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('admin@gmail.com\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('adm\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('adm\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('adm\n');
        }
        if (data.toString().includes('Input')) {
            stream.write(`${password}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write(`${subdomain}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('yes\n');
        }
        if (data.toString().includes('Please read the Terms of Service')) {
            stream.write('A\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('1\n');
        }
        console.log('STDOUT: ' + data);
    }
    
    // Func Handler 'handleWingsInstallationInput'
    function handleWingsInstallationInput(data, stream, domainnode, subdomain) {
        if (data.toString().includes('Input')) {
            stream.write('1\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write(`${subdomain}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('user\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('1248\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write(`${domainnode}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('admin@gmail.com\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        console.log('STDOUT: ' + data);
    }

    function handleNodeCreationInput(data, stream, domainnode, ramvps) {
        stream.write('NODE\n');
        stream.write('4\n');
        stream.write('NODE\n');
        stream.write('SC INSTALL PANEL BY VANN HOST 🚀\n');
        stream.write(`${domainnode}\n`);
        stream.write('NODES\n');
        stream.write(`${ramvps}\n`);
        stream.write(`${ramvps}\n`);
        stream.write('1\n');
        console.log('STDOUT: ' + data);
    }
  } else {
      bot.sendMessage(chatId, 'Fitur Ini Khusus Owner Saya!!!');
    }
});
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INSTALL PANEL VPS VERSI 22.04.4 & 24.04.4
bot.onText(/^(\.|\#|\/)installpanelv2$/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Format salah!\nPenggunaan: /installpanelv2 ipvps,password,domainpnl,domainnode,ramvps ( contoh : 80000 = ram 8)\nOwner @vannhost`);
  });
bot.onText(/\/installpanelv2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];
  const t = text.split(',');
  if (settings.adminId.includes(String(msg.from.id))) {
  if (t.length < 5) {
    return bot.sendMessage(chatId, 'Format salah!\nPenggunaan: /installpanelv2 ipvps,password,domainpnl,domainnode,ramvps ( contoh : 80000 = ram 8)\nOwner @vannhost');
  }
  const ipvps = t[0];
  const passwd = t[1];
  const subdomain = t[2];
  const domainnode = t[3];
  const ramvps = t[4];
  const connSettings = {
    host: ipvps,
    port: 22,
    username: 'root',
    password: passwd
  };
 let password = generateRandomPassword();
 const command = 'bash <(curl -s https://pterodactyl-installer.se)';
 const commandWings = 'bash <(curl -s https://pterodactyl-installer.se)';  
 const conn = new Client();

  conn.on('ready', () => {
    sendMessage(chatId, `PROSES PENGINSTALLAN SEDANG BERLANGSUNG MOHON TUNGGU 5-10MENIT\nscript by @vannhost`);
    conn.exec(command, (err, stream) => {
      if (err) throw err;

      stream.on('close', (code, signal) => {
        console.log(`Stream closed with code ${code} and signal ${signal}`);
        installWings(conn, domainnode, subdomain, password, ramvps);
      }).on('data', (data) => {
        handlePanelInstallationInput(data, stream, subdomain, password);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }).connect(connSettings);
  
  async function installWings(conn, domainnode, subdomain, password, ramvps) {
        sendMessage(chatId, `PROSES PENGINSTALLAN WINGS SEDANG BERLANGSUNG MOHON TUNGGU 5 MENIT\nscript by @vannhost`);
        conn.exec(commandWings, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Wings installation stream closed with code ${code} and signal ${signal}');
                createNode(conn, domainnode, ramvps, subdomain, password);
            }).on('data', (data) => {
                handleWingsInstallationInput(data, stream, domainnode, subdomain);
        }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }

    async function createNode(conn, domainnode, ramvps, subdomain, password) {
        const command = 'bash <(curl https://raw.githubusercontent.com/zerodevxc/revan/refs/heads/main/install.sh)';
        sendMessage(chatId, `MEMULAI CREATE NODE & LOCATION\nscript by @vannhost`);     
        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Node creation stream closed with code ${code} and ${signal} signal');
                conn.end();
                sendPanelData(subdomain, password);
            }).on('data', (data) => {
                handleNodeCreationInput(data, stream, domainnode, ramvps);
        }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }
        
   // Func Handler 'sendPanelData' 
    function sendPanelData(subdomain, password) {
        sendMessage(chatId,`DATA PANEL ANDA\n\nUSERNAME: vannhost\nPASSWORD: ${password}\nLOGIN: ${subdomain}\n\nNote: Semua Instalasi Telah Selesai Silahkan Create Allocation Di Node Yang Di buat Oleh Bot Dan Ambil Token Configuration dan ketik .startwings (token) \nNote: HARAP TUNGGU 1-5MENIT BIAR WEB BISA DI BUKA\nscript by @vannhost`);
    }
    
   // Func Handler 'handlePanelInstallationInput' 
   function handlePanelInstallationInput(data, stream, subdomain, password) {
        if (data.toString().includes('Input')) {
            stream.write('0\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('1248\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('Asia/Jakarta\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('admin@gmail.com\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('admin@gmail.com\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('adm\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('adm\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('adm\n');
        }
        if (data.toString().includes('Input')) {
            stream.write(`${password}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write(`${subdomain}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('yes\n');
        }
        if (data.toString().includes('Please read the Terms of Service')) {
            stream.write('Y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('1\n');
        }
        console.log('STDOUT: ' + data);
    }
    
    // Func Handler 'handleWingsInstallationInput'
    function handleWingsInstallationInput(data, stream, domainnode, subdomain) {
        if (data.toString().includes('Input')) {
            stream.write('1\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write(`${subdomain}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('user\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('1248\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write(`${domainnode}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('admin@gmail.com\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        console.log('STDOUT: ' + data);
    }


    function handleNodeCreationInput(data, stream, domainnode, ramvps) {
                stream.write('revan\n'); //ini gk ush di ubah gblk
        stream.write('4\n');
        stream.write('SGP\n');
        stream.write('SC INSTALL PANEL BY VANN HOST 🚀\n');
        stream.write(`${domainnode}\n`);
        stream.write('NODES\n');
        stream.write(`${ramvps}\n`);
        stream.write(`${ramvps}\n`);
        stream.write('1\n');
        console.log('STDOUT: ' + data);
    }
  } else {
      bot.sendMessage(chatId, 'Fitur Ini Khusus Owner Saya!!!');
    }
});
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// START WINGS PANEL
bot.onText(/^(\.|\#|\/)startwings$/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Format salah!\nPenggunaan: /startwings ipvps,password,token\nOWNER @vannhost`);
  });
bot.onText(/\/startwings (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];
  const t = text.split(',');
  if (settings.adminId.includes(String(msg.from.id))) {
  if (t.length < 3) {
    return bot.sendMessage(chatId, 'Format salah!\nPenggunaan: /startwings ipvps,password,token\nOWNER @vannhost');
  }
  const ipvps = t[0];
  const passwd = t[1];
  const token = t[2];
  const connSettings = {
    host: ipvps,
    port: 22,
    username: 'root',
    password: passwd
  };
    const conn = new Client();
    const command = 'bash <(curl https://raw.githubusercontent.com/zerodevxc/revan/refs/heads/main/install.sh)'
 
    conn.on('ready', () => {
        isSuccess = true; // Set flag menjadi true jika koneksi berhasil
        sendMessage(chatId,' PROSES CONFIGURE WINGS\nscript by @vannhost')
        
        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Stream closed with code ${code} and ${signal} signal');
         sendMessage(chatId, 'SUCCES START WINGS DI PANEL ANDA COBA CEK PASTI IJO😁\nscript by @vannhost');
                conn.end();
            }).on('data', (data) => {
            stream.write('revan\n');
                stream.write('3\n');
                stream.write(`${token}\n`)
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }).on('error', (err) => {
        console.log('Connection Error: ' + err);
        sendMessage(chatId, 'Katasandi atau IP tidak valid');
    }).connect(connSettings);
     } else {
      bot.sendMessage(chatId, 'Fitur Ini Khusus Owner Saya!!!');
    }
});
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// UNINSTALL PANEL
bot.onText(/^(\.|\#|\/)uninstallpanel$/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Format salah!\nPenggunaan: /uninstallpanel ipvps,password\nOWNER @vannhost`);
  });
bot.onText(/\/uninstallpanel (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];
  const t = text.split(',');
  if (settings.adminId.includes(String(msg.from.id))) {
  if (t.length < 2) {
    return bot.sendMessage(chatId, 'Format salah!\nPenggunaan: /uninstallpanel ipvps,password\nOWNER @vannhost');
  }
  const ipvps = t[0];
  const passwd = t[1];
  const connSettings = {
    host: ipvps,
    port: 22,
    username: 'root',
    password: passwd
  };
    const conn = new Client();
    const command = 'bash <(curl https://raw.githubusercontent.com/zerodevxc/revan/refs/heads/main/install.sh)'
 
    conn.on('ready', () => {
        isSuccess = true; // Set flag menjadi true jika koneksi berhasil
        sendMessage(chatId,'PROSES UNINSTALLPANEL\nBy @vannhost')
        
        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Stream closed with code ${code} and ${signal} signal');
         sendMessage(chatId, 'CEK OM UDAH MOKAD BELUM?\nBy @vannhost');
                conn.end();
            }).on('data', (data) => {
            stream.write('revan\n');
                stream.write('5\n');
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }).on('error', (err) => {
        console.log('Connection Error: ' + err);
        sendMessage(chatId, 'Katasandi atau IP tidak valid');
    }).connect(connSettings);
     } else {
      bot.sendMessage(chatId, 'Fitur Ini Khusus Owner Saya!!!');
    }
});
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// UNINSTALL THEMA
bot.onText(/^(\.|\#|\/)uninstallthema$/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Format salah!\nPenggunaan: /uninstallthema ipvps,password\nOWNER @vannhost`);
  });
bot.onText(/\/uninstallthema (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];
  const t = text.split(',');
  if (settings.adminId.includes(String(msg.from.id))) {
  if (t.length < 2) {
    return bot.sendMessage(chatId, 'Format salah!\nPenggunaan: /uninstallthema ipvps,password\nOWNER @vannhost');
  }
  const ipvps = t[0];
  const passwd = t[1];
  const connSettings = {
    host: ipvps,
    port: 22,
    username: 'root',
    password: passwd
  };
    const conn = new Client();
    const command = 'bash <(curl https://raw.githubusercontent.com/zerodevxc/revan/refs/heads/main/install.sh)'
 
    conn.on('ready', () => {
        isSuccess = true; // Set flag menjadi true jika koneksi berhasil
        sendMessage(chatId,'PROSES UNINSTALLTHEMA\nBy @vannhost')
        
        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Stream closed with code ${code} and ${signal} signal');
         sendMessage(chatId, 'CEK OM UDAH MOKAD BELUM?\nBy @vannhost');
                conn.end();
            }).on('data', (data) => {
                stream.write('revan\n');
                stream.write('2\n');
                stream.write('y\n');
                stream.write('yes\n');
                stream.write('x\n');
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }).on('error', (err) => {
        console.log('Connection Error: ' + err);
        sendMessage(chatId, 'Katasandi atau IP tidak valid');
    }).connect(connSettings);
     } else {
      bot.sendMessage(chatId, 'Fitur Ini Khusus Owner Saya!!!');
    }
});
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\

// INSTALL THEMA INSTELLAR
bot.onText(/^(\.|\#|\/)stellar$/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Format salah!\nPenggunaan: /stellar ipvps,password\nOWNER @vannhost`);
  });
bot.onText(/\/stellar (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];
  const t = text.split(',');
  if (settings.adminId.includes(String(msg.from.id))) {
  if (t.length < 2) {
    return bot.sendMessage(chatId, 'Format salah!\nPenggunaan: /tema1 ipvps,password\nOWNER @vannhost');
  }
  const ipvps = t[0];
  const passwd = t[1];
  const connSettings = {
    host: ipvps,
    port: 22,
    username: 'root',
    password: passwd
  };
    const conn = new Client();
    const command = 'bash <(curl https://raw.githubusercontent.com/zerodevxc/revan/refs/heads/main/install.sh)'
 
    conn.on('ready', () => {
        isSuccess = true; // Set flag menjadi true jika koneksi berhasil
        sendMessage(chatId,'PROSES INSTALL THEMA OM\nBy @vannhost')
        
        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Stream closed with code ${code} and ${signal} signal');
         sendMessage(chatId, 'CEK OM UDAH KE INSTALL BELUM TEMANYA?\nBy @vannhost');
                conn.end();
            }).on('data', (data) => {
stream.write('revan\n');
                stream.write('1\n');
                stream.write('1\n');
                stream.write('y\n');
                stream.write('x\n');
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }).on('error', (err) => {
        console.log('Connection Error: ' + err);
        sendMessage(chatId, 'Katasandi atau IP tidak valid');
    }).connect(connSettings);
     } else {
      bot.sendMessage(chatId, 'Fitur Ini Khusus Owner Saya!!!');
    }
});