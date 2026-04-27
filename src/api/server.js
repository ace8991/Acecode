import express from 'express';
import { loadSettings } from '../utils/config.js';
import logger from '../utils/logger.js';
import { AIEngine } from '../ai/engine.js';

/**
 * 🦞 Acecode REST API Server
 */
export class ApiServer {
  constructor(settings = null) {
    this.settings = settings || loadSettings();
    this.app = express();
    this.engine = new AIEngine(this.settings.ai);
    this.port = this.settings.interface.port;
    this.host = this.settings.interface.host;

    this._setupMiddleware();
    this._setupRoutes();
  }

  _setupMiddleware() {
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      logger.info(`📥 ${req.method} ${req.path}`);
      next();
    });
  }

  _setupRoutes() {
    // Root page — welcome HTML
    this.app.get('/', (req, res) => {
      res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🦞 Acecode</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      color: #fff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    .logo { font-size: 6rem; margin-bottom: 1rem; }
    h1 { font-size: 3rem; font-weight: 700; margin-bottom: 0.5rem; background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .tagline { font-size: 1.2rem; color: #a0a0c0; margin-bottom: 2rem; }
    .badges { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; margin-bottom: 2.5rem; }
    .badge { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 999px; padding: 0.4rem 1rem; font-size: 0.85rem; color: #ccc; }
    .endpoints { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem 2rem; margin-bottom: 2rem; min-width: 320px; }
    .endpoints h3 { margin-bottom: 1rem; font-size: 1rem; color: #feca57; text-transform: uppercase; letter-spacing: 1px; }
    .endpoint { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .endpoint:last-child { border-bottom: none; }
    .method { font-weight: 700; font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; min-width: 48px; text-align: center; }
    .method.get { background: #00b894; color: #fff; }
    .method.post { background: #6c5ce7; color: #fff; }
    .path { font-family: 'Fira Code', monospace; font-size: 0.9rem; color: #dfe6e9; }
    .desc { font-size: 0.8rem; color: #636e72; margin-left: auto; }
    .footer { margin-top: 2rem; font-size: 0.85rem; color: #636e72; }
    .footer a { color: #48dbfb; text-decoration: none; }
  </style>
</head>
<body>
  <div class="logo">🦞</div>
  <h1>Acecode</h1>
  <p class="tagline">Your personal AI assistant — The Lobster Way</p>
  <div class="badges">
    <span class="badge">v1.0.0</span>
    <span class="badge">⚡ Blazing Fast</span>
    <span class="badge">🔒 Privacy-First</span>
    <span class="badge">🌐 Cross-Platform</span>
  </div>
  <div class="endpoints">
    <h3>📡 API Endpoints</h3>
    <div class="endpoint"><span class="method get">GET</span><span class="path">/health</span><span class="desc">Server status</span></div>
    <div class="endpoint"><span class="method post">POST</span><span class="path">/ask</span><span class="desc">Ask a question</span></div>
    <div class="endpoint"><span class="method post">POST</span><span class="path">/ask/stream</span><span class="desc">Streaming response</span></div>
  </div>
  <div class="footer">
    🦞 <a href="https://github.com/ace8991/Acecode" target="_blank">Acecode</a> &mdash; MIT Licensed
  </div>
</body>
</html>`);
    });

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        version: '1.0.0',
        name: 'Acecode',
        mascot: '🦞',
      });
    });

    // Ask endpoint
    this.app.post('/ask', async (req, res) => {
      try {
        const { prompt, options } = req.body;
        if (!prompt) {
          return res.status(400).json({ error: 'Prompt is required' });
        }

        const response = await this.engine.ask(prompt, options);
        res.json({ response });
      } catch (err) {
        logger.error(`❌ ${err.message}`);
        res.status(500).json({ error: err.message });
      }
    });

    // Stream endpoint
    this.app.post('/ask/stream', async (req, res) => {
      try {
        const { prompt, options } = req.body;
        if (!prompt) {
          return res.status(400).json({ error: 'Prompt is required' });
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of this.engine.stream(prompt, options)) {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        }
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      } catch (err) {
        logger.error(`❌ ${err.message}`);
        res.status(500).json({ error: err.message });
      }
    });

    // Favicon
    this.app.get('/favicon.ico', (req, res) => {
      res.status(204).end();
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({ error: 'Not found', path: req.path });
    });
  }

  async start() {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, this.host, () => {
        logger.success(`🌐 Acecode API running at http://${this.host}:${this.port}`);
        logger.info(`📋 Health check: http://localhost:${this.port}/health`);
        resolve();
      });
    });
  }

  async stop() {
    if (this.server) {
      this.server.close();
      logger.info('🛑 API server stopped');
    }
  }
}

export default ApiServer;
