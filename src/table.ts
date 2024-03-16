import { nanoid } from "nanoid";
import getDebugger from "./debugger";

const BASE_SIGNATURE = "table";

const { debug } = getDebugger();

const mapArguments = <TArg>(acclimator: TArg, arg: unknown, idx: number) => {
  return {
    ...acclimator,
    [`arg${idx}`]: {
      jsType: typeof arg,
      contents: arg
    }
  }
}

const writeDebug = (message: string, signature: string, ...objects: unknown[]) => {
  const logMessage = {
    msg: message,
    signature: `${BASE_SIGNATURE}.${signature}`,
    debugData: objects.reduce<Record<string, any>>(mapArguments<Record<string, any>>, {}) || {}
  };

  debug(JSON.stringify(logMessage));
}

type ColArgs = {
  name: string;
  dataType: "number" | "string" | "boolean" | "date" | "identifier";
  prefix?: string;
  prefixSeperator?: "_" | "." | "-";
  size?: number;
  isUnique?: boolean;
  nullable?: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isPolyKey?: boolean;
  isAutoIncrement?: boolean;
  isIndexed?: boolean;
  isDebug?: boolean;
  defaultValue?: () => any;
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
  createIfNotExists: boolean;
  debug?: boolean;
  prefix?: string;
  prefixSeperator?: "_" | "." | "-";
  isTemporary?: boolean;
  indexes?: IdxArgs[];
};

const genId = () => nanoid()

const genPrefix = (args: TableArgs | ColArgs) => {
  const prefix = args.prefix
  ? `${args.prefix}${args.prefixSeperator}${args.name}`
  : args.name;

  return prefix;
}

const tblSig = 'ts_table';
const table = (args: TableArgs) => {
  writeDebug(`table arguments`, tblSig, args);

  const _id = genId();

  writeDebug(`created table with id [${_id}]`, tblSig);

  const _name = genPrefix(args);

  writeDebug(`created prefix [${_name}]`, tblSig);

  const ret = {
    id: _id,
    name: _name,
    dialect: args.dialect,
    isTmp: args.isTemporary || false,
    isDebug: args.debug || false,
  };

  writeDebug(`generated table`, tblSig, ret);

  return ret;
};

const colSig = 'ts_column';
const column = (args: ColArgs, tbl: ReturnType<typeof table>) => {
  writeDebug(`column args`, colSig, args, tbl);
  
  const _id = genId();
  
  writeDebug(`created column with id [${_id}]`, colSig);

  const _name = genPrefix(args);

  writeDebug(`created prefix [${_name}]`, colSig);

  const ret = {
    id: _id,
    name: _name,
    dialect: tbl.dialect,
    isTmp: tbl.isTmp,
    isDebug: args.isDebug || tbl.isDebug || false,
  }

  writeDebug(`generated table`, colSig, ret);

  return ret;
}

export { table, column };

export default table;
