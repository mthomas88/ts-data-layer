import net from "net";
import getDebugger from "./debugger";
import crypto from "crypto";
import { stringify } from "querystring";

const { debug } = getDebugger();

const loginStruct = {
  username: "postgres",
  database: "postgres",
  password: "mysecretpassword",
};

const getPostgresLoginBuf = () => {
  const bufs = [
    Buffer.from([0x00, 0x00, 0x00, 0x08]), // Length of the message (in bytes)
    Buffer.from([0x04, 0xd2, 0x16, 0x2f]), // PostgreSQL protocol version number (196608)
    Buffer.from(`user=${loginStruct.username}\0`),
    Buffer.from(`database=${loginStruct.database}\0`),
    Buffer.from(`password=${loginStruct.password}\0`),
    Buffer.from(""),
  ];

  return Buffer.concat(bufs);
};

const convertToHex = (value: number) => {
  return `0x` + value.toString(16);
};

export const connectToPostgresql = async () => {
  const client = new net.Socket();
  const message_queue: {
    id: ReturnType<typeof crypto.randomUUID>;
    hex_code: string;
    hex_type: string;
    raw_code: number;
    raw_type: number;
    message: Buffer;
    received_at: Date;
  }[] = [];

  const parseMessage = (message: Buffer) => {
    const _id = crypto.randomUUID();

    const struct = {
      id: _id,
      message,
      received_at: new Date(),
    };

    let ret = {
      raw_type: -1,
      _id,
      raw_code: -1,
      hex_type: "",
      hex_code: "",
    };

    const typeByte = message.readUInt8(0);
    const codeByte = message.readUInt32BE(1);

    ret.hex_type = convertToHex(typeByte);
    ret.hex_code = convertToHex(codeByte);

    message_queue.push({
      ...struct,
      raw_code: codeByte,
      raw_type: typeByte,
      hex_type: ret.hex_type,
      hex_code: ret.hex_code,
    });

    debug(
      `message [queue_length=${message_queue.length}][id=${ret._id}][raw_type_byte=${ret.raw_type}][raw_code_byte=${ret.raw_code}][hex_type=${ret.hex_type}][hex_code=${ret.hex_code}]`
    );
    debug(`message ${message.toString("utf-8")}`);
  };

  const ret = {
    ready: true,
    client,
  };

  const result = new Promise<{
    ready: boolean;
    client: net.Socket;
  }>((resolve, reject) => {
    client.connect({
      port: 5432,
      host: "localhost",
    });

    client.on("data", parseMessage);

    client.on("ready", () => {
      client.write(getPostgresLoginBuf());
      resolve(ret);
    });

    client.on("error", (error) => reject(error));
  });

  return result;
};
