import { readFileSync, existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import YAML from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

// Load .env file
const envPath = join(ROOT, '.env');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config({ path: join(ROOT, '.env.example') });
}

/**
 * Load settings from YAML config file
 */
export function loadSettings() {
  const configPath = join(ROOT, 'config', 'settings.yaml');
  try {
    const raw = readFileSync(configPath, 'utf-8');
    return YAML.parse(raw);
  } catch (err) {
    console.warn('⚠️  Could not load config/settings.yaml, using defaults.');
    return getDefaultSettings();
  }
}

function getDefaultSettings() {
  return {
    ai: {
      provider: process.env.AI_PROVIDER || 'openai',
      model: process.env.AI_MODEL || 'gpt-4o',
      temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
      max_tokens: parseInt(process.env.AI_MAX_TOKENS || '4096', 10),
    },
    interface: {
      mode: process.env.INTERFACE_MODE || 'cli',
      port: parseInt(process.env.API_PORT || '8080', 10),
      host: process.env.API_HOST || '0.0.0.0',
    },
    privacy: {
      local_mode: process.env.LOCAL_MODE === 'true',
      log_conversations: process.env.LOG_CONVERSATIONS === 'true',
    },
    plugins: {
      enabled: [],
    },
  };
}

export function getRoot() {
  return ROOT;
}

export default { loadSettings, getRoot };
