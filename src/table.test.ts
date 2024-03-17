import { expect, test, suite, describe, beforeEach } from "vitest";
import { makeTableWithPrefix } from "./helpers";
import table, { column } from "./table";

suite("table.ts", () => {
  describe("basic table functionality", () => {
    const stubs: {
      c: ReturnType<typeof column> | null;
      t: ReturnType<typeof table> | null;
    } = {
      c: null,
      t: null,
    };

    beforeEach(() => {
      stubs.t = makeTableWithPrefix();
      stubs.c = column(
        {
          dataType: "boolean",
          name: "myColumn",
          defaultValue: () => 0,
        },
        stubs.t
      );
    });

    test("table with prefix", () => {
      if (!stubs.t) {
        throw new Error("no stubs");
      }

      expect(stubs.t.id.length).toEqual(21);
      expect(stubs.t.name).toEqual("tbl.test");
      expect(stubs.t.isTmp).toEqual(false);
      expect(stubs.t.isDebug).toEqual(true);
      expect(stubs.t.dialect).toEqual("postgresl");
    });

    test("column definition", () => {
      if (!stubs.c || !stubs.t) {
        throw new Error("no stubs");
      }

      expect(stubs.c.id.length).toEqual(21);
      expect(stubs.c.name).toEqual("myColumn");

      if (stubs.t.isDebug) {
        expect(stubs.c.isDebug).toBe(true);
      } else {
        expect(stubs.c.isDebug).toBe(false);
      }
    });
  });
});
