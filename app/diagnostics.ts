import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.cli(),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});
