const express = require('express');
const axios = require('axios');
const fs = require('fs');
const crypto = require("crypto");
const QRCode = require('qrcode');
const { ImageUploadService } = require('node-upload-images');

const app = express();
app.use(express.json());

// Helper functions
function convertCRC16(str) {
    let crc = 0xFFFF;
    const strlen = str.length;
    for (let c = 0; c < strlen; c++) {
        crc ^= str.charCodeAt(c) << 8;
        for (let i = 0; i < 8; i++) {
            crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
        }
    }
    return ("000" + (crc & 0xFFFF).toString(16).toUpperCase()).slice(-4);
}

function generateTransactionId() {
    return `VANN HOSTING - ${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
}

function generateExpirationTime() {
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 30);
    return expirationTime;
}

async function uploadQRImage(buffer) {
    const service = new ImageUploadService('pixhost.to');
    const { directLink } = await service.uploadFromBinary(buffer, 'qris.png');
    return directLink;
}

async function createQRIS(amount, codeqr) {
    let qrisData = codeqr.slice(0, -4);
    const step1 = qrisData.replace("010211", "010212");
    const step2 = step1.split("5802ID");

    amount = amount.toString();
    let uang = "54" + ("0" + amount.length).slice(-2) + amount;
    uang += "5802ID";

    const result = step2[0] + uang + step2[1] + convertCRC16(step2[0] + uang + step2[1]);
    const buffer = await QRCode.toBuffer(result);
    const uploadedFile = await uploadQRImage(buffer);

    return {
        idtransaksi: generateTransactionId(),
        jumlah: amount,
        expired: generateExpirationTime(),
        imageqris: { url: uploadedFile }
    };
}

async function checkQRISStatus(merchant, keyorkut) {
    const apiUrl = `https://gateway.okeconnect.com/api/mutasi/qris/${merchant}/${keyorkut}`;
    const response = await axios.get(apiUrl);
    const result = response.data;
    const latestTransaction = result.data && result.data.length > 0 ? result.data[0] : null;
    return latestTransaction || null;
}

// ====================== QiosPay / OrderKuota Endpoints ======================

// QiosPay: Create Payment
app.get('/qiospay/createpayment', async (req, res) => {
    const { apikey, amount, codeqr } = req.query;
    if (!apikey || !amount || !codeqr) return res.status(400).json({ status: false, error: "apikey, amount, codeqr wajib" });

    try {
        const qrData = await createQRIS(amount, codeqr);
        res.status(200).json({ status: true, result: qrData });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

// QiosPay: Check Status
app.get('/qiospay/cekstatus', async (req, res) => {
    const { merchant, keyorkut, apikey } = req.query;
    if (!apikey || !merchant || !keyorkut) return res.status(400).json({ status: false, error: "apikey, merchant, keyorkut wajib" });

    try {
        const latestTransaction = await checkQRISStatus(merchant, keyorkut);
        if (latestTransaction) {
            res.json({ status: true, result: latestTransaction });
        } else {
            res.json({ status: false, message: "No transactions found." });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

// OrderKuota: Create Payment (sama logikanya dengan QiosPay)
app.get('/orderkuota/createpayment', async (req, res) => {
    const { apikey, amount, codeqr } = req.query;
    if (!apikey || !amount || !codeqr) return res.status(400).json({ status: false, error: "apikey, amount, codeqr wajib" });

    try {
        const qrData = await createQRIS(amount, codeqr);
        res.status(200).json({ status: true, result: qrData });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

// OrderKuota: Check Status
app.get('/orderkuota/cekstatus', async (req, res) => {
    const { merchant, keyorkut, apikey } = req.query;
    if (!apikey || !merchant || !keyorkut) return res.status(400).json({ status: false, error: "apikey, merchant, keyorkut wajib" });

    try {
        const latestTransaction = await checkQRISStatus(merchant, keyorkut);
        if (latestTransaction) {
            res.json({ status: true, result: latestTransaction });
        } else {
            res.json({ status: false, message: "No transactions found." });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

};