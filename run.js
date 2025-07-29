const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { sessions } = require("./src/lib/connectwa");

async function start() {
    console.log('hallo')

    let args = [path.join(__dirname, './index.js'), ...process.argv.slice(2)];
    console.log([process.argv[0], ...args].join('\n'));

    let p = spawn(process.argv[0], ['--no-deprecation', ...args], {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    })
    .on('message', data => {
        if (data == 'reset') {
            console.log('🔄 Restarting Bot...');
            p.kill();
            start();
            delete p;
        }
    })
    .on('exit', code => {
        console.error('🚫 Bot berhenti dengan kode:', code);
        if (code == 0 || code == 1) start();
    });
}

start();