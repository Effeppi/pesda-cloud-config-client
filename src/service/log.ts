import { LoggerConfig, LoggerLevel } from "../model";
import { Environment } from "./env-enum";

enum LogColor {
    error = '\x1b[31m%s\x1b[0m',
    debug = '\x1b[36m%s\x1b[0m',
    info = "\x1b[0m%s\x1b[0m"
}

interface LogConfig {
    label: string,
    color: LogColor
}

const PROJECT_NAME = 'node-spring-cloud-config-client'

export class Logger {
    private readonly LOG_CONSOLE_CONFIG = {
        error: { label: 'ERROR', color: LogColor.error },
        info: { label: 'INFO', color: LogColor.info },
        debug: { label: 'DEBUG', color: LogColor.debug }
    }

    private static _instance: Logger;
    private _options: LoggerConfig = { enabled: false };

    private constructor(opt?: LoggerConfig) {
        if (opt) this._options = opt;
    this.parseEnvironmentValue()
    }

    static getLogger(loggerOptions?: LoggerConfig): Logger {
        if (!this._instance) {

            this._instance = new Logger(loggerOptions);
        }


        return this._instance;
    }

    private parseEnvironmentValue() {
        const enabled = process.env[Environment.LOGGER_ENABLED]

        const level = process.env[Environment.LOGGER_LEVEL];

        if(enabled) {
            const enabledParsed = enabled.toLowerCase() === 'true' ? true : false
            this._options = {
                ...this._options, enabled: enabledParsed
            }
        }

        if(level === LoggerLevel.debug.toString() || level === LoggerLevel.info.toString() ) {
            this._options = {
                ...this._options, level
            }
        } else {
            this._options = {
                ...this._options, level: LoggerLevel.error.toString()
            }

        }

    }

    debug(msg: string) {
        if (this._options.level === LoggerLevel.debug.toString())
            this.log(msg, this.LOG_CONSOLE_CONFIG.debug);
    }

    info(msg: string) {
        if (this._options.level === LoggerLevel.debug.toString()
        || this._options.level === LoggerLevel.info.toString())

        this.log(msg, this.LOG_CONSOLE_CONFIG.info);
    }

    error(msg: string) {
        this.log(msg, this.LOG_CONSOLE_CONFIG.error);
    }


    private log(msg: string, level: LogConfig) {
        console.log(this._options.enabled)
        if (this._options.enabled) {

            console.log(
                level.color,
                `${(new Date()).toISOString()} [ PID:${process.pid} ] [${PROJECT_NAME}] [${level.label}] - ${msg}`
            )
        }
    }
}




