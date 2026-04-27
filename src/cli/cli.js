#!/usr/bin/env node

import { createInterface } from 'readline';
import { loadSettings } from '../utils/config.js';
import logger from '../utils/logger.js';
import { AIEngine } from '../ai/engine.js';

/**
 * 🦞 Acecode CLI Interface
 */
export class CLI {
  constructor(settings = null) {
    this.settings = settings || loadSettings();
    this.engine = new AIEngine(this.settings.ai);
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '🦞 Acecode> ',
    });
  }

  showBanner() {
    logger.divider();
    logger.highlight('  🦞  ACECODE  v1.0.0  ');
    logger.info('  Your personal AI assistant — The Lobster Way');
    logger.divider();
    logger.info(`  Provider : ${this.settings.ai.provider}`);
    logger.info(`  Model    : ${this.settings.ai.model}`);
    logger.info(`  Mode     : ${this.settings.interface.mode}`);
    logger.divider();
    console.log('');
  }

  async askOnce(prompt) {
    try {
      const response = await this.engine.ask(prompt);
      console.log('');
      logger.divider();
      console.log(response);
      logger.divider();
      console.log('');
    } catch (err) {
      logger.error(`❌ Error: ${err.message}`);
    }
  }

  async startInteractive() {
    this.showBanner();
    logger.info('💬 Interactive mode. Type your questions below.');
    logger.info('⌨️  Type "exit" or "quit" to leave, "help" for options.');
    console.log('');

    this.rl.prompt();

    this.rl.on('line', async (line) => {
      const input = line.trim();

      if (!input) {
        this.rl.prompt();
        return;
      }

      if (['exit', 'quit', 'q'].includes(input.toLowerCase())) {
        logger.success('👋 Goodbye! Stay claw-some! 🦞');
        this.rl.close();
        return;
      }

      if (input.toLowerCase() === 'help') {
        console.log('');
        logger.info('📖 Available commands:');
        console.log('  ask <question>  - Ask Acecode a question');
        console.log('  help           - Show this help message');
        console.log('  exit / quit / q - Exit Acecode');
        console.log('');
        this.rl.prompt();
        return;
      }

      await this.askOnce(input);
      this.rl.prompt();
    });

    this.rl.on('close', () => {
      process.exit(0);
    });
  }
}

/**
 * CLI entry point for bin script
 */
async function main() {
  const args = process.argv.slice(2);
  const cli = new CLI();

  if (args.length === 0) {
    // No args → interactive mode
    await cli.startInteractive();
  } else if (args[0] === '--interactive' || args[0] === '-i') {
    await cli.startInteractive();
  } else if (args[0] === '--file' || args[0] === '-f') {
    // File mode: acecode --file ./path "question"
    const { readFileSync } = await import('fs');
    const filePath = args[1];
    const question = args.slice(2).join(' ') || 'What does this code do?';
    try {
      const code = readFileSync(filePath, 'utf-8');
      const prompt = `File: ${filePath}\n\`\`\`\n${code}\n\`\`\`\n\n${question}`;
      await cli.askOnce(prompt);
    } catch (err) {
      logger.error(`❌ Cannot read file: ${filePath}`);
      process.exit(1);
    }
  } else {
    // Direct prompt
    const prompt = args.join(' ');
    await cli.askOnce(prompt);
  }
}

main().catch((err) => {
  logger.error(`❌ Fatal error: ${err.message}`);
  process.exit(1);
});
