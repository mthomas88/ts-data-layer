import net from "net";
import getDebugger from "./debugger";
import crypto from "crypto";
import { EventEmitter } from "stream";
import { convertToHex } from "./utils";

const { debug } = getDebugger();

export type SQLConnector = PostgreSQL;

type PostgreSQL = {
  type: "tsdm-pgsql";
  hostname: string;
  username: string;
  password: string;
  ssl: boolean;
  database: string;
  port: number;
};

const getPostgresLoginBuf = (args: {
  username: string;
  password: string;
  database: string;
}) => {
  const bufs = [
    Buffer.from([0x00, 0x00, 0x00, 0x08]), // Length of the message (in bytes)
    Buffer.from([0x04, 0xd2, 0x16, 0x2f]), // PostgreSQL protocol version number (196608)
    Buffer.from(`user=${args.username}\0`),
    Buffer.from(`database=${args.database}\0`),
    Buffer.from(`password=${args.password}\0`),
    Buffer.from(""),
  ];

  return Buffer.concat(bufs);
};

/**
 * This will parse the message buffer and return the CODE of the message.
 * @param message {Buffer} the message returned from the postgresql server
 * @returns {number} the number bytecode of the particiular position in the buffer
 */
const getMessageCode = (message: Buffer): number => message.readUInt32BE(1);

/**
 * This will parse the message buffer and return the TYPE of the message.
 * @param message {Buffer} the message returned from the postgresql server
 * @returns {number} the number bytecode of the particiular position in the buffer
 */
const getMessageType = (message: Buffer): number => message.readUInt8(0);

/**
 * Parse the message incoming from the postgres server
 * @param message
 */
const parseMessage = (message: Buffer) => {
  const _id = crypto.randomUUID();

  const ret = {
    id: _id,
    raw_type: -1,
    raw_code: -1,
  };

  const struct = {
    id: _id,
    message,
    received_at: new Date(),
  };

  const typeByte = getMessageType(message);
  const codeByte = getMessageCode(message);

  debug(
    `message [id=${ret.id}][raw_type_byte=${ret.raw_type}][raw_code_byte=${
      ret.raw_code
    }][hex_type=${convertToHex(ret.raw_type)}][hex_code=${convertToHex(
      ret.raw_code
    )}]`
  );

  debug(`message ${message.toString("utf-8")}`);

  return {
    ...struct,
    code: codeByte,
    type: typeByte,
  };
};

type TQueueEntry = {
  id: ReturnType<typeof crypto.randomUUID>;
  code: number;
  type: number;
  message: Buffer;
  received_at: Date;
};

type PgClient = {
  ready: boolean;
  client: net.Socket;
  messageQueue: TQueueEntry[];
  login: (username: string, password: string) => void;
};

type EventMap = {
  "login.start": [{ username: string; password: string }];
  "login.error": [Error];
};

export const getPostgresqlHandle = async (args: PostgreSQL) => {
  const client = new net.Socket();
  const messageQueue: TQueueEntry[] = [];
  const $emit = new EventEmitter<EventMap>();

  const handleLoginRequest = (login_args: {
    username: string;
    password: string;
  }) => {
    const authBuffer = getPostgresLoginBuf({ ...login_args, ...args });
    client.write(authBuffer);
  };

  /**
   * Initiate a login to the postgres server.
   */
  $emit.on("login.start", handleLoginRequest);

  /**
   * Handle an error being emitted.
   */
  $emit.on("login.error", (err) =>
    debug(`ERROR: [${err.name}] - ${err.message} - ${err.stack}`)
  );

  /**
   * BUild the connection result to beb returned to the user.
   */

  return new Promise<PgClient>((resolve, reject) => {
    client.connect({
      port: args.port,
      host: args.hostname,
    });

    client.on("data", parseMessage);

    client.on("ready", () => {
      resolve({
        ready: true,
        client,
        messageQueue,
        login: (username: string, password: string) => {
          $emit.emit("login.start", { username, password });
        },
      });
    });

    client.on("error", (error) => reject(error));
  });
};
