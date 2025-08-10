const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

// Pastikan helper terload tanpa error
try {
  require("./helpers.js");
} catch (err) {
  console.error(chalk.red(`Error loading helpers.js: ${err.message}`));
}

// Init
const app = express();
const PORT = process.env.PORT || 5000;

app.enable("trust proxy");
app.set("json spaces", 2);

// Middleware parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Static file serving (Vercel umumnya pakai /public)
app.use('/', express.static(path.join(__dirname, '/')));
app.use('/', express.static(path.join(__dirname, 'ui')));
app.use('/api', express.static(path.join(__dirname, 'api')));

// Load settings.json
const settingsPath = path.join(__dirname, 'settings.json');
let settings = {};
try {
  settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
} catch (err) {
  console.error(chalk.red(`Error loading settings.json: ${err.message}`));
  settings = { apikey: [], creator: "Unknown" };
}

global.apikey = settings.apikey || [];
global.totalreq = 0;

// Middleware log + JSON response wrapper
app.use((req, res, next) => {
  console.log(chalk.bgHex('#FFFF99').hex('#333').bold(` Request Route: ${req.path} `));
  global.totalreq += 1;

  const originalJson = res.json;
  res.json = function (data) {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      data = {
        status: data.status ?? true,
        creator: settings.creator || "Created Using Vann",
        ...data
      };
    }
    return originalJson.call(this, data);
  };

  next();
});

// Load API routes dinamis
let totalRoutes = 0;
const apiFolder = path.join(__dirname, 'api');
if (fs.existsSync(apiFolder)) {
  fs.readdirSync(apiFolder).forEach((subfolder) => {
    const subfolderPath = path.join(apiFolder, subfolder);
    if (fs.statSync(subfolderPath).isDirectory()) {
      fs.readdirSync(subfolderPath).forEach((file) => {
        const filePath = path.join(subfolderPath, file);
        if (path.extname(file) === '.js') {
          try {
            require(filePath)(app);
            totalRoutes++;
            console.log(chalk.bgHex('#FFFF99').hex('#333').bold(` Loaded Route: ${path.basename(file)} `));
          } catch (err) {
            console.error(chalk.red(`Error loading route ${file}: ${err.message}`));
          }
        }
      });
    }
  });
}

console.log(chalk.bgHex('#90EE90').hex('#333').bold(' Load Complete! ✓ '));
console.log(chalk.bgHex('#90EE90').hex('#333').bold(` Total Routes Loaded: ${totalRoutes} `));

// Default home
app.get('/', (req, res) => {
  const homePath = path.join(__dirname, 'index.html');
  if (fs.existsSync(homePath)) {
    res.sendFile(homePath);
  } else {
    res.send(`<h1>${settings.apititle || "API Server"}</h1>`);
  }
});

// 404 handler
app.use((req, res) => {
  const notFoundPath = path.join(__dirname, '404.html');
  if (fs.existsSync(notFoundPath)) {
    res.status(404).sendFile(notFoundPath);
  } else {
    res.status(404).json({ status: false, message: 'Not Found' });
  }
});

// Start server (lokal saja)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(chalk.bgHex('#90EE90').hex('#333').bold(` Server running on port ${PORT} `));
  });
}

module.exports = app;