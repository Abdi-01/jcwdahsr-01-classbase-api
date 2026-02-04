import path from "path";
import { createLogger, format, transports } from "winston";

const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logFilter = (level: string) => {
  return format((info) => {
    return info.level === level ? info : false;
  })();
};

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.json(),
    logFormat,
  ),
  transports: [
    new transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      format: format.combine(logFilter("error")),
    }),
    new transports.File({
      filename: path.join(__dirname, "../../logs/info.log"),
      format: format.combine(logFilter("info")),
    }),
  ],
});

export default logger;
