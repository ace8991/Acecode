import chalk from 'chalk';

const PREFIX = '🦞';

export function info(message) {
  console.log(`${chalk.cyan(PREFIX)} ${chalk.white(message)}`);
}

export function success(message) {
  console.log(`${chalk.green(PREFIX)} ${chalk.greenBright(message)}`);
}

export function warn(message) {
  console.log(`${chalk.yellow(PREFIX)} ${chalk.yellowBright(message)}`);
}

export function error(message) {
  console.error(`${chalk.red(PREFIX)} ${chalk.redBright(message)}`);
}

export function highlight(message) {
  console.log(`${chalk.magenta(PREFIX)} ${chalk.magentaBright(message)}`);
}

export function divider() {
  console.log(chalk.gray('─'.repeat(50)));
}

export default { info, success, warn, error, highlight, divider };
