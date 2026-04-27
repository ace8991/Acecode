import { loadSettings } from '../utils/config.js';
import logger from '../utils/logger.js';

/**
 * 🦞 Acecode AI Engine
 * Connects to various AI providers.
 */
export class AIEngine {
  constructor(settings = null) {
    this.settings = settings || loadSettings().ai;
    this.provider = this.settings.provider;
    this.model = this.settings.model;
    this.temperature = this.settings.temperature;
    this.maxTokens = this.settings.max_tokens;
  }

  /**
   * Send a prompt to the AI and get a response.
   * @param {string} prompt - The user's prompt
   * @param {object} options - Additional options
   * @returns {Promise<string>} The AI response
   */
  async ask(prompt, options = {}) {
    const provider = options.provider || this.provider;

    logger.info(`🤖 Asking ${provider} (${this.model})...`);

    switch (provider) {
      case 'openai':
        return this._askOpenAI(prompt);
      case 'anthropic':
        return this._askAnthropic(prompt);
      case 'ollama':
        return this._askOllama(prompt);
      case 'local':
        return this._askLocal(prompt);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  async _askOpenAI(prompt) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return this._simulateResponse(prompt, 'OpenAI');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async _askAnthropic(prompt) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      return this._simulateResponse(prompt, 'Anthropic');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async _askOllama(prompt) {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: this.temperature,
            num_predict: this.maxTokens,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (err) {
      logger.warn(`⚠️  Ollama not available (${err.message}), using simulation mode.`);
      return this._simulateResponse(prompt, 'Ollama (local)');
    }
  }

  async _askLocal(prompt) {
    // Placeholder for local model inference
    logger.info('🏠 Running in local mode (offline)');
    return this._simulateResponse(prompt, 'Local Model');
  }

  _simulateResponse(prompt, providerName) {
    const responses = [
      `🦞 **Acecode (${providerName})** here! I've analyzed your request.\n\n> "${prompt.slice(0, 80)}${prompt.length > 80 ? '...' : ''}"\n\nI'm running in **demo/simulation mode** because no valid API key was configured for ${providerName}.\n\nTo connect me to a real AI provider:\n1. Copy \`.env.example\` to \`.env\`\n2. Set your \`${providerName === 'OpenAI' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY'}\`\n3. Restart Acecode\n\nStay claw-some! 🦞`,
    ];
    return responses[0];
  }

  async *stream(prompt, options = {}) {
    const simulated = this._simulateResponse(prompt, this.provider);
    for (const word of simulated.split(' ')) {
      yield word + ' ';
      await new Promise((r) => setTimeout(r, 30));
    }
  }
}

export default AIEngine;
