const {
  Telegraf,
  Markup
} = require('telegraf');
const fs = require('fs');
const path = require('path');
const tokenPath = path.join(__dirname, './src/database/token.json');

function getBotToken() {
  if (fs.existsSync(tokenPath)) {
    try {
      let data = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
      if (data.token && data.token.trim() !== '') {
        return data.token.trim();
      }
    } catch (err) {
      console.error('⚠️ Gagal membaca token.json, pastikan formatnya benar!');
      process.exit(1);
    }
  } else {
    console.error('❌ Token tidak ditemukan! Jalankan ulang bot dan masukkan token.');
    process.exit(1);
  }
}

const botToken = getBotToken();
const bot = new Telegraf(botToken);

module.exports = bot

