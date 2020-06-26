export interface Configuration {
    serverConfig: ServerConfiguration,
    errorConfig: ErrorConfiguration, 
    loggerConfig: LoggerConfig,
}

export interface ServerConfiguration {
    applicationName: string,
    baseUri: string,
    profile?: string,
    label?: string,
    clientRequestTimeout: number,
}

export interface ErrorConfiguration {
    failFast: boolean,
    maxRetryAttempts?: number,
    scalingDuration?: number,
}

export interface RetryStrategyConfig {
    maxRetryAttempts: number,
    scalingDuration: number,
}

export interface LoggerConfig {
    enabled?: boolean,
    level?: string,
}

export enum LoggerLevel {
    'debug'= 'debug',
    'info' = 'info',
    'error' = 'error'
}