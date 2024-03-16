import table from "./table";

export const makeTableWithPrefix = () => {
  const t = table({
    debug: true,
    name: "test",
    prefix: "tbl",
    dialect: "postgresl",
    prefixSeperator: ".",
    createIfNotExists: true,
    columns: [
      {
        name: "testColumn",
        dataType: "number",
        nullable: true,
        prefix: "pk",
      },
      {
        name: "testColumn",
        dataType: "string",
        nullable: false,
        prefix: "fk",
      },
    ],
  });

  return t;
}
  
