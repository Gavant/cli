const pkg = require('../package.json');
const nodeMajor = Number(pkg.volta.node.split('.')[0]);

const chalk = require('chalk');

const checkNodeVersion = () => {
    const attemptedVersion = process.version.split('.')?.[0]?.replace('v', '')
    if (parseInt(attemptedVersion) < nodeMajor) {
        console.log(chalk.redBright(`Command failed`))
        console.log(chalk.redBright(`Gavin formally requests you upgrade to Node ${nodeMajor}+ (From v${attemptedVersion})`))
        process.exit(1)
    }
}

module.exports = {
    checkNodeVersion
}