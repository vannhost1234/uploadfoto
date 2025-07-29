const fs = require('fs');

function addBilling(srvid, userId, username, command) {
    const durasi = 2592000; 
    let panelData = [];
    const filePath = './database/panel-billing.json';

    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
        panelData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    const newBilling = {
        id: srvid,
        userId: userId,
        username: username,
        command: command,
        duration: durasi
    };

    panelData.push(newBilling);

    fs.writeFileSync(filePath, JSON.stringify(panelData, null, 2));
    console.log(`✅ Billing baru ditambahkan untuk Server ID: ${srvid} dengan durasi 30 hari.`);
}

module.exports = { addBilling };