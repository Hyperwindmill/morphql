export type LogFormat = "text" | "json";

export interface Logger {
  info(message: string, data?: Record<string, any>): void;
  error(message: string, data?: Record<string, any>): void;
  summary(data: Record<string, any>): void;
}

export function createLogger(format: LogFormat = "text"): Logger {
  const getTimestamp = () => {
    const now = new Date();
    return now.toISOString().split("T")[1].split(".")[0];
  };

  const write = (
    level: "info" | "error",
    message: string,
    data?: Record<string, any>,
  ) => {
    if (format === "json") {
      const logObj = {
        ts: new Date().toISOString(),
        level,
        msg: message,
        ...data,
      };
      process.stderr.write(JSON.stringify(logObj) + "\n");
    } else {
      const ts = getTimestamp();
      let extra = "";
      if (data) {
        if (data.input && data.output) {
          extra = ` ${data.input} → ${data.output}`;
          if (data.duration !== undefined) extra += ` (${data.duration}ms)`;
        } else if (data.processed !== undefined) {
          extra = `: ${data.processed} files processed, ${data.errors || 0} errors`;
          if (data.duration !== undefined) extra += ` in ${data.duration}ms`;
        }
      }
      process.stderr.write(
        `[${ts}] ${level.toUpperCase()}: ${message}${extra}\n`,
      );
    }
  };

  return {
    info(message, data) {
      write("info", message, data);
    },
    error(message, data) {
      write("error", message, data);
    },
    summary(data) {
      write("info", "Summary", data);
    },
  };
}
