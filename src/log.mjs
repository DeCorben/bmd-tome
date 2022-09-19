import winston from 'winston';

const { combine, timestamp, json } = winston.format;

const log = winston.createLogger({
  level: process.env.LOGLEVEL || 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console(),
  ],
});

export default log;
