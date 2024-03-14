import { expect, test } from "vitest";
import { makeTableWithPrefix } from "./helpers";

test("table with prefix", () => {
  const t = makeTableWithPrefix();

  expect(t.id.length).toEqual(21);
  expect(t.name).toEqual("tbl.test");
  expect(t.isTmp).toEqual(false);
  expect(t.isDebug).toEqual(true);
  expect(t.dialect).toEqual("postgresl");
});
