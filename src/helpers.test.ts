import { expect, test } from 'vitest';
import { makeTableWithPrefix } from './helpers';
import table from './table';

test("helpers.ts", () => {
    const t = makeTableWithPrefix();
    expect(t.name).toBe("tbl.test");
    expect(t.isDebug).toBeTruthy();
});