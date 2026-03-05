import "reflect-metadata";
import express from "express";
import cors from "cors";
import { env } from 'process';
import "dotenv/config";
import router from './api/index';
import logger from './services/logger';

import { AppDataSource } from "./data-source";

declare global {
  var host: string;
  var port: number;
}

global.host = env.HOST || "0.0.0.0";
global.port = Number(env.PORT) || 20001;

logger.info('UQL Starting... tag:0.1')


const app = express();

app.use(express.json());
app.use(cors());

app.use('', router.uql);
app.use('/v1.0/quantize', router.quantize);

async function startServer() {
  try {
    await AppDataSource.initialize();
    logger.info("Database initialized successfully");

    app.listen(global.port, global.host, () => {
      logger.info(`Server is running on http://${global.host}:${global.port}`);
    });
  } catch (error) {
    logger.error(error, "Error starting server");
    process.exit(1);
  }
}

startServer();

process.on('SIGINT', () => {
    logger.info('\n - UQL stopped');
    process.exit(0);
});
