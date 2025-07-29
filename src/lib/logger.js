const chalk = require('chalk');

function formatLog(command, args, userName, userId, isGroup, groupName, groupId) {
    return `${chalk.black(chalk.bgWhite('[ CMD ]'))} ` +
        `${chalk.black(chalk.bgGreen(new Date().toLocaleString()))}\n` +
        `${chalk.black(chalk.bgBlue(`/${command} ${args}`))}\n` +
        `${chalk.magenta('=> From')} ${chalk.green(userName)} (${chalk.cyan(userId)})\n` +
        `${chalk.blueBright('=> In')} ${chalk.green(isGroup ? `${groupName} (${groupId})` : 'Private Chat')}`;
}

module.exports = {
  formatLog
}