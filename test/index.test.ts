import { expect, test } from "vitest";
import data_layer from "../src";

const app = data_layer({
  logger: {
    info: () => {},
    debug: () => {},
    error: () => {},
    warn: () => {},
    trace: () => {},
    config: {
      level: "debug",
    },
  },
  settings: {
    datasource: "postgresql",
  },
});

test("has logger ctx", () => {
  expect(app.ctx.logger).toBeTruthy();
});

test("has settings ctx", () => {
  expect(app.ctx.settings).toBeTruthy();
});

test("logger has appropriate level", () => {
  expect(app.ctx.logger.config.level).toBe("debug");
});
