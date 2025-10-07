import { createLogger, format, transports } from "winston";
import util from "util";
import path from "path";
import sourceMapSupport from "source-map-support";
import { blue, green, magenta, red, yellow } from "colorette";
import "winston-mongodb";

// Enable source-map support for better stack traces
sourceMapSupport.install();

// Load ENV config (example)
const ENV = process.env.NODE_ENV || "development";
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "myapp";

// ✅ Colorize log levels for console
const colorizeLevel = (level) => {
  switch (level) {
    case "ERROR":
      return red(level);
    case "INFO":
      return blue(level);
    case "WARN":
      return yellow(level);
    default:
      return level;
  }
};

// ✅ Console Log Format
const consoleLogFormat = format.printf((info) => {
  const { level, message, timestamp, meta = {} } = info;

  const customLevel = colorizeLevel(level.toUpperCase());
  const customTimeStamp = green(timestamp);
  const customMessage =
    typeof message === "object" ? JSON.stringify(message) : message;

  const customMeta = util.inspect(meta, {
    showHidden: false,
    depth: null,
    colors: true,
  });

  return `${customLevel} [${customTimeStamp}]\nmessage: ${customMessage}\n${magenta(
    "META"
  )} ${customMeta}\n`;
});

// ✅ Console Transport (only in DEV)
const consoleTransport = () => {
  if (ENV === "development") {
    return [
      new transports.Console({
        level: "info",
        format: format.combine(format.timestamp(), consoleLogFormat),
      }),
    ];
  }
  return [];
};

// ✅ File Log Format
const fileLogFormat = format.printf((info) => {
  const { level, message, timestamp, meta = {} } = info;
  const logMeta = {};

  if (meta && typeof meta === "object") {
    for (const [key, value] of Object.entries(meta)) {
      if (value instanceof Error) {
        logMeta[key] = {
          name: value.name,
          message: value.message,
          trace: value.stack || "",
        };
      } else {
        logMeta[key] = value;
      }
    }
  }

  return JSON.stringify(
    {
      level: level.toUpperCase(),
      message,
      timestamp,
      meta: logMeta,
    },
    null,
    4
  );
});

// ✅ File Transports
const infoFileTransport = () =>
  new transports.File({
    level: "info",
    format: format.combine(format.timestamp(), fileLogFormat),
    filename: path.join("logs", `${ENV}-info.log`),
  });

const errorFileTransport = () =>
  new transports.File({
    level: "error",
    format: format.combine(format.timestamp(), fileLogFormat),
    filename: path.join("logs", `${ENV}-error.log`),
  });

// ✅ MongoDB Transport
const mongodbTransport = () => [
  new transports.MongoDB({
    level: "info",
    metaKey: "meta",
    collection: "application-logs",
    db: `${MONGODB_URL}/${DB_NAME}`,
    expireAfterSeconds: 3600 * 24 * 30, // 30 days
  }),
];

// ✅ Final Logger
const logger = createLogger({
  defaultMeta: { meta: {} },
  transports: [
    infoFileTransport(),
    errorFileTransport(),
    ...mongodbTransport(),
    ...consoleTransport(),
  ],
});

export default logger;
