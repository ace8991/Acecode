#!/usr/bin/env node

import { loadSettings } from './utils/config.js';
import logger from './utils/logger.js';
import { CLI } from './cli/cli.js';
import { ApiServer } from './api/server.js';

/**
 * 🦞 Acecode - Main entry point
 */
async function main() {
  const settings = loadSettings();
  const mode = settings.interface.mode;

  logger.success('🦞 Acecode v1.0.0 — The Lobster Way');
  logger.info(`⚙️  Mode: ${mode}`);

  switch (mode) {
    case 'cli':
      await startCLI(settings);
      break;

    case 'api':
      await startAPI(settings);
      break;

    default:
      logger.error(`❌ Unknown interface mode: ${mode}`);
      logger.info('💡 Set INTERFACE_MODE in .env to "cli" or "api"');
      process.exit(1);
  }
}

async function startCLI(settings) {
  const cli = new CLI(settings);
  await cli.startInteractive();
}

async function startAPI(settings) {
  const server = new ApiServer(settings);
  await server.start();
}

main().catch((err) => {
  logger.error(`❌ Fatal error: ${err.message}`);
  process.exit(1);
});
