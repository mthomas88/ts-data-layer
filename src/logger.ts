import { nanoid } from "nanoid";
import { EventEmitter } from "stream";

const makeEmitter = <TLog>(name: string, logger?: TLog) => {
    const _id = nanoid();

    const emitter = new EventEmitter();

    return {
        id: _id,
        name,
        emitter,
    };
}

const LogEventEmitter = makeEmitter('logs');

export default LogEventEmitter;