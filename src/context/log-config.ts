import { LoggerConfig, LoggerLevel } from "../model";
import { Environment } from "./env-enum";

export class LogConfiguration {

    private static _instance: LogConfiguration;
    private _options: LoggerConfig = { enabled: false };
    
    private constructor() {
        this.parseEnvironmentValue()
    }

    static getInstance(): LogConfiguration {
        if (!this._instance) {
            this._instance = new LogConfiguration();
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

    get options () {
        return this._options;
    }
}