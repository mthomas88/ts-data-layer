import minimist from 'minimist';
import os from 'os';

const VERSION = '0.0.1 - alpha' as const;

type Color = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white';

const colored = (message: string, args?: {
    stream?: 'stdout' | 'stderr';
    color?: Color;
    background?: Color;
}) => {
    const stream_name = args?.stream || 'stdout';

    const color_map = {
        none: '',
        reset: '\u001b[0m',
        black: '\u001b[30m',
        red: '\u001b[31m',
        green: '\u001b[32m',
        yellow: '\u001b[33m',
        blue: '\u001b[34m',
        magenta: '\u001b[35m',
        cyan: '\u001b[36m',
        white: '\u001b[37m'
    } as const;

    const bg_map = {
        none: '',
        reset: '\u001b[0m',
        black: '\u001b[40m',
        red: '\u001b[41m',
        green: '\u001b[42m',
        yellow: '\u001b[43m',
        blue: '\u001b[44m',
        magenta: '\u001b[45m',
        cyan: '\u001b[46m',
        white: '\u001b[47m'
    } as const;

    const layer = {
        bg: args?.background || 'none' as const,
        c: args?.color || 'none' as const,
    }

    if (message === '\n') {
        process[stream_name].write(message);
        return;
    }

    process[stream_name].write(`${bg_map[layer.bg]}${color_map[layer.c]}${message}${bg_map.reset}${color_map.reset}`)
    return;
}

const succeeded = () => process.exit(0);

const failed = () => process.exit(1);

type Stream = 'stdout' | 'stderr';


const default_stream = 'stdout' as const;

const newLine = (numLines = 1, stream: Stream = default_stream) => {
    let lines = '\n';

    if (numLines === 1) {
        process[stream].write(lines);
        return;
    }

    Array.from({ length: numLines }).forEach(() => lines += '\n');

    process[stream].write(lines);
    return;
};


type Arguments = ReturnType<typeof minimist>;
const parseArgs = (): Arguments => minimist(process.argv.slice(2)) as Arguments;

const green = (message: string, nl = true, stream_name: Stream = 'stdout') => {
    colored(message, { color: 'green', stream: stream_name });
    if (nl) {
        newLine();
    }
}

const red = (message: string, nl = true, stream_name: Stream = 'stdout') => {
    colored(message, { color: 'red', stream: stream_name });
    if (nl) {
        newLine();
    }
}

const yellow = (message: string, nl = true, stream_name: Stream = 'stdout') => {
    colored(message, { color: 'yellow', stream: stream_name });
    if (nl) {
        newLine();
    }
}

const cyan = (message: string, nl = true, stream_name: Stream = 'stdout') => {
    colored(message, { color: 'cyan', stream: stream_name });
    if (nl) {
        newLine();
    }
}

const white = (message: string, nl = true, stream_name: Stream = 'stdout') => {
    colored(message, { color: 'white', stream: stream_name });
    if (nl) {
        newLine();
    }
}

const logError = (e: unknown) => {
    if (e instanceof Error) {
        red(`ERROR: [${e.name}] - ${e.message}`, true, 'stderr');
    } else {
        red(`ERROR: [unhandled] - ${JSON.stringify(e)}`, true, 'stderr');
    }
}

type Flag = { type: 'short' | 'long' | 'both', name: string, datatype: 'boolean' | 'string' | 'number', shortKey: string, longKey: string }

type Command<T extends Function = Function> = {
    name: string;
    key: string;
    description: string;
    cmd: T;
    flags?: Flag[];
}

const commands: Command[] = [
    {
        name: 'Introspect Datasource',
        key: 'introspect',
        description: 'Introspect your datasource to generate typesafe models for your workspace',
        cmd: () => {
            console.log('Am command!');
        }
    }
]
const whitespace = (x?: () => void, spaces = 4) => process.stdout.write(`${Array.from({ length: spaces }).reduce<string>((a) => a += ` `, '')}${!!x ? x() : new String()}`);

const outputCommandList = (commands: Command[]) => {
    newLine();

    white(`Usage: `);

    commands.forEach((command) => {
        whitespace();
        whitespace(() => cyan(`${command.key}`, false));
        whitespace(() => yellow(`${command.name}:`, false));
        white(` ${command.description}`);
    });

    newLine();
}

const outputSpecs = () => {
    white(`node: ${process.version}`);
    white(`type: ${os.type()}`);
    white(`release: ${os.release()}`);
    white(`platform: ${os.platform()}`);
    white(`current directory: ${__dirname.toString()}`);
    white(`current time: ${new Date()}`);
    white(`connected datasources: `, false)
    cyan(`[none]`)

    separator();
}

const separator = () => white(`${Array.from({ length: process.stdout.columns }).reduce((a, b) => a += '-', '')}`);

(async () => {
    try {
        const args = parseArgs();

        green(`Welcome to the ts-sql-layer cli`)
        green(`Version: ${VERSION}`);
        newLine();
        separator();

        outputSpecs();

        outputCommandList(commands);

        succeeded();
    } catch (e) {
        logError(e);

        failed();
    }
})();