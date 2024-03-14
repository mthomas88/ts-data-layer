import { nanoid } from "nanoid";
import getDebugger from "./debugger";

const { debug } = getDebugger();

type ColArgs = {
  colName: string;
  colPrefix?: "pk" | "fk" | "idx";
  colSeparator?: "_" | "." | "-";
  dataType: "number" | "string" | "boolean" | "date" | "identifier";
  size?: number;
  defaultValue?: () => any;
  isUnique?: boolean;
  nullable?: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isPolyKey?: boolean;
  isAutoIncrement?: boolean;
  isIndexed?: boolean;
  isDebug?: boolean;
};

type IdxArgs = {
  idxName: string;
  isUnique: boolean;
  columns: ColArgs[];
  predicate?: () => boolean;
};

type TableArgs = {
  name: string;
  columns: ColArgs[];
  dialect: "postgresl" | "mssql" | "t-sql" | "mysql" | "sqlite";
  debug?: boolean;
  createIfNotExists: boolean;
  prefix?: string;
  prefixSeperator?: "_" | "." | "-";
  isTemporary?: boolean;
  indexes?: IdxArgs[];
};

const table = (args: TableArgs) => {
  const _id = nanoid();

  debug(`created table with id [${_id}]`);

  const _name = args.prefix
    ? `${args.prefix}${args.prefixSeperator}${args.name}`
    : args.name;

  return {
    id: _id,
    name: _name,
    dialect: args.dialect,
    isTmp: args.isTemporary || false,
    isDebug: args.debug || false,
  };
};

export default table;
