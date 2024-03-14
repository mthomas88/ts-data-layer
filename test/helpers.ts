import table from "../src/table";

export const makeTableWithPrefix = () =>
  table({
    debug: true,
    name: "test",
    prefix: "tbl",
    dialect: "postgresl",
    prefixSeperator: ".",
    createIfNotExists: true,
    columns: [
      {
        colName: "testColumn",
        dataType: "number",
        nullable: true,
        colPrefix: "pk",
      },
      {
        colName: "testColumn",
        dataType: "string",
        nullable: false,
        colPrefix: "fk",
      },
    ],
  });
