import { expect, test } from "vitest";
import { makeTableWithPrefix } from "./helpers";
import { column } from "./table";

test("table with prefix", () => {
  const t = makeTableWithPrefix();

  expect(t.id.length).toEqual(21);
  expect(t.name).toEqual("tbl.test");
  expect(t.isTmp).toEqual(false);
  expect(t.isDebug).toEqual(true);
  expect(t.dialect).toEqual("postgresl");
});


test("column definition", () => {
  const t= makeTableWithPrefix();
  const c = column({
    dataType: 'boolean',
    name: 'myColumn',
    defaultValue: () => 0,
  }, t)

  expect(c.id.length).toEqual(21);
  expect(c.name).toEqual("myColumn");
  
  if (t.isDebug) {
    expect(c.isDebug).toBe(true);
  } else {
    expect(c.isDebug).toBe(false);
  }
})