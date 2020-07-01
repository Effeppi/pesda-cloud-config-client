/* istanbul ignore file */


import { LoggerConfig, LoggerLevel } from "../model";
import { LogConfiguration } from '../context';

enum LogColor {
    error = '\x1b[31m%s\x1b[0m',
    debug = '\x1b[36m%s\x1b[0m',
    info = "\x1b[0m%s\x1b[0m"
}

interface LogConfig {
    label: string,
    color: LogColor
}

const PROJECT_NAME = 'pesda-cloud-config-client'

export class Logger {
    private readonly LOG_CONSOLE_CONFIG = {
        error: { label: 'ERROR', color: LogColor.error },
        info: { label: 'INFO', color: LogColor.info },
        debug: { label: 'DEBUG', color: LogColor.debug }
    }

    private static _instance: Logger;
    private _options: LoggerConfig = LogConfiguration.getInstance().options;

    private constructor() {

    }

    static getLogger(): Logger {
        if (!this._instance) {

            this._instance = new Logger();
        }


        return this._instance;
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
        if (this._options.enabled) {

            console.log(
                level.color,
                `${(new Date()).toISOString()} [ PID:${process.pid} ] [${PROJECT_NAME}] [${level.label}] - ${msg}`
            )
        }
    }
}




