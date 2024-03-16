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

const cmdFunc = (x: string, b: number) => console.log(x);

const commands = {
    introspect: {
        name: 'Introspect Datasource',
        description: 'Introspect your datasource to generate typesafe models for your workspace',
        cmd: cmdFunc
    }
} as const;

type CommandKeys = keyof typeof commands;

const whitespace = (x?: () => void, spaces = 4) => {
    const spc = Array.from({ length: spaces }).reduce<string>((a) => a += ` `, '');
    process.stdout.write(`${spc}`);

    if (x) {
        x();
    }
};

const unpad = (s: string) => s.trim();

const outputCommandList = (cmds: typeof commands) => {
    newLine();

    white(`Usage: `);

    whitespace();

    whitespace(() => white(`[command]`, false));

    whitespace(() => {
        white(' [name]', false);
        white('  ', false);
    });

    Array.from({ length: 4 }).forEach(() => whitespace());

    white('[description]');

    Object.entries(cmds).forEach(([key, command]) => {
        whitespace();
        whitespace(() => cyan(`${unpad(key)}`, false));
        whitespace(() => {
            yellow(unpad(command.name), false);
            white('  ', false);
        });
        white(unpad(command.description));
    })

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

class CliError extends Error { };

const separator = () => white(`${Array.from({ length: process.stdout.columns }).reduce((a, b) => a += '-', '')}`);

const validateIsCommand = (cmd: unknown): cmd is CommandKeys => {
    const keys = Object.keys(commands) as [CommandKeys];

    if (typeof cmd !== 'string') {
        return false;
    }

    const hasKey = keys.some(x => x === cmd);

    if (!hasKey) {
        return false;
    }

    for (let v of keys) {
        if (cmd === v) {
            return true;
        }
    }

    return false;
}

const getParametersForArgs = <TArg = CommandKeys>(key: TArg) => {
    const _arguments = parseArgs();

    if (key === 'introspect') {
        return ['hello', 1] as [string, number];
    }

    throw new CliError('no valid resolver for command');
}

const _commandRouter = (cmd: CommandKeys | unknown) => {
    if (!validateIsCommand(cmd)) {
        throw new CliError(`invalid cmd ${cmd}`);
    }

    const command = commands[cmd];
    const command_arguments = getParametersForArgs(cmd);

    try {
        command.cmd(...command_arguments);
        return 0;
    } catch (e) {
        return 1;
    }
}

(async () => {
    try {
        const args = parseArgs();



        newLine();
        green(`Welcome to the ts-sql-layer cli`)
        green(`Version: ${VERSION}`);
        green(`Authored by Michael Thomas: <mickey.ftw@gmail.com>`)
        newLine();
        separator();

        outputSpecs();

        if (!args._.length) {
            outputCommandList(commands);
        } else {
            const commandKey = args._[0];
            const result = _commandRouter(commandKey)

            if (result === 0) {
                green(`command ${commandKey} success`);
            } else {
                red(`command ${commandKey} failed`);
            }
        }

        succeeded();
    } catch (e) {
        logError(e);


        failed();
    }
})();