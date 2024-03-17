import { describe, expect, test } from "vitest";
import { getPostgresqlHandle } from "./connector";

describe("datasource connector test suite", () => {
  test("it can connect to a postgresql database running inside a docker container", async () => {
    const result = await getPostgresqlHandle({
      username: "postgres",
      ssl: true,
      database: "postgres",
      hostname: "localhost",
      password: "mysecretpassword",
      port: 5432,
      type: "tsdm-pgsql",
    });
    expect(typeof result).toBe("object");
  });
});
