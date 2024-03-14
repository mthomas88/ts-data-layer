// ts-data-mapper core

type Logger = {
  info: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  trace: (message: string, ...args: unknown[]) => void;
  config: {
    level: "debug" | "trace" | "info" | "error" | "warn";
  };
};

type Settings = {
  datasource: "postgresql" | "mysql" | "mssql" | "sqlite";
};

const data_layer = (_args: { logger: Logger; settings: Settings }) => {
  const ctx = {
    logger: _args.logger,
    settings: _args.settings,
  };

  ctx.logger.info("Data layer initialized");

  return {
    ctx,
  };
};

export default data_layer;
