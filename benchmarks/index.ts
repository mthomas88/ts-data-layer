import b, { suite } from "benny";
import { makeTableWithPrefix } from "../test/helpers";

b.suite(
  "ts-data-mapper-benchmark-uite",
  b.add("create new prefixed table", () => {
    const t = makeTableWithPrefix();
  }),
  b.cycle(),
  b.complete()
);
