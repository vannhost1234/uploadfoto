const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

// Import file helper (jika ada efek global)
require("./helpers.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.enable("trust proxy");
app.set("json spaces", 2);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Static files
app.use('/', express.static(path.join(__dirname, '/')));
app.use('/', express.static(path.join(__dirname, 'ui')));
app.use('/api', express.static(path.join(__dirname, 'api')));

// Load settings.json
const settingsPath = path.join(__dirname, './settings.json');
let settings = {};
try {
  settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
} catch (err) {
  console.error(chalk.red(`Error loading settings.json: ${err.message}`));
  settings = { creator: "Created Using Vann", apikey: null };
}

global.apikey = settings.apikey || null;
global.totalreq = 0;

// Middleware untuk logging dan format JSON
app.use((req, res, next) => {
  console.log(chalk.bgHex('#FFFF99').hex('#333').bold(` Request Route: ${req.path} `));
  global.totalreq += 1;

  const originalJson = res.json;
  res.json = function (data) {
    if (data && typeof data === 'object') {
      const responseData = {
        status: data.status,
        creator: settings.creator || "Created Using Vann",
        ...data
      };
      return originalJson.call(this, responseData);
    }
    return originalJson.call(this, data);
  };

  next();
});

// Load dynamic routes dari folder api
let totalRoutes = 0;
const apiFolder = path.join(__dirname, './api');

if (fs.existsSync(apiFolder)) {
  fs.readdirSync(apiFolder).forEach((subfolder) => {
    const subfolderPath = path.join(apiFolder, subfolder);
    if (fs.statSync(subfolderPath).isDirectory()) {
      fs.readdirSync(subfolderPath).forEach((file) => {
        const filePath = path.join(subfolderPath, file);
        if (path.extname(file) === '.js') {
          require(filePath)(app);
          totalRoutes++;
          console.log(chalk.bgHex('#FFFF99').hex('#333').bold(` Loaded Route: ${path.basename(file)} `));
        }
      });
    }
  });
}

console.log(chalk.bgHex('#90EE90').hex('#333').bold(' Load Complete! ✓ '));
console.log(chalk.bgHex('#90EE90').hex('#333').bold(` Total Routes Loaded: ${totalRoutes} `));

// Default home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// ===== Mode Lokal vs Vercel =====
if (process.env.VERCEL) {
  // Export untuk Vercel serverless
  module.exports = app;
} else {
  // Jalankan server lokal
  app.listen(PORT, () => {
    console.log(chalk.bgHex('#90EE90').hex('#333').bold(` Server is running on port ${PORT} `));
  });
}