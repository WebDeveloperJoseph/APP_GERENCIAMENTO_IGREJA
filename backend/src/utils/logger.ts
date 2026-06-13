type LogLevel = "info" | "warn" | "error";
type LogDetails = Record<string, unknown>;

function writeLog(level: LogLevel, event: string, details: LogDetails = {}) {
  const message = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...details,
  });

  if (level === "error") {
    console.error(message);
  } else if (level === "warn") {
    console.warn(message);
  } else {
    console.info(message);
  }
}

export const logger = {
  info: (event: string, details?: LogDetails) =>
    writeLog("info", event, details),
  warn: (event: string, details?: LogDetails) =>
    writeLog("warn", event, details),
  error: (event: string, details?: LogDetails) =>
    writeLog("error", event, details),
};
