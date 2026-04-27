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
