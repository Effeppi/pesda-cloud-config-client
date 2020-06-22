import { ServerConfiguration, ErrorConfiguration, RetryStrategyConfig } from "../model";
import { Environment } from "./env-enum";
import { isURL } from "../util";
import { Logger } from "./log";

export class ClientConfiguration {

    private static _instance: ClientConfiguration;
    private _server: ServerConfiguration = { applicationName: 'application', baseUri: 'http://localhost:8888', profile: 'default' };
    private _error: ErrorConfiguration = { failFast: false };
    private readonly LOGGER = Logger.getLogger();
    
    private constructor() {
        this.propertiesFromEnvironment();
        this.validate();
    }

    static getInstance(): ClientConfiguration {
        if (!this._instance) {
            this._instance = new ClientConfiguration();
        }

        return this._instance;
    }

    get retry() {
        const retryStrategy: RetryStrategyConfig = {
            maxRetryAttempts: this._error.maxRetryAttempts || 6,
            scalingDuration: this._error.scalingDuration || 1000,
        }
        return this._error.failFast ? retryStrategy : undefined;
    }

    get url() {
        let result = '';
        if (this._server.baseUri.endsWith('/')) {
            result = this._server.baseUri.substr(0, this._server.baseUri.length - 1)
        } else {
            result = this._server.baseUri
        }

        result = `${result}/${this._server.applicationName}`;


        result = `${result}/${this._server.profile}`

        if (this._server.label) {
            result = `${result}/${this._server.label}`
        }

        return result;
    }

    private validate() {
        if(!isURL(this._server.baseUri)) {
            this.throwInvalidURIError('baseUri', this._server.baseUri)
        }
    }

    private propertiesFromEnvironment() {
        const applicationName = process.env[Environment.APPLICATION_NAME]

        const baseUri = process.env[Environment.BASE_URI];

        const profile = process.env[Environment.PROFILE];

        const label = process.env[Environment.LABEL];

        const NSCCC_FAIL_FAST = process.env[Environment.FAIL_FAST];

        const NSCCC_MAX_RETRY_ATTEMPTS = process.env[Environment.MAX_RETRY_ATTEMPTS];

        const NSCCC_SCALING_DURATION = process.env[Environment.SCALING_DURATION];

        if (applicationName) {
            this._server = { ...this._server, applicationName }
        }

        if (baseUri) {
            this._server = { ...this._server, baseUri}
        }

        if (profile) {
            this._server = { ...this._server, profile: profile }
        }

        if (label) {
            this._server = { ...this._server, label: label }

        }

        if (NSCCC_FAIL_FAST) {
            const failFast = NSCCC_FAIL_FAST.toLowerCase() === 'true' ?
                true :
                false;

            this._error = { ...this._error, failFast }
        }


        if (this._error.failFast && NSCCC_MAX_RETRY_ATTEMPTS) {
            const maxRetryAttemptParsed = parseInt(NSCCC_MAX_RETRY_ATTEMPTS);
            this._error = { ...this._error, maxRetryAttempts: maxRetryAttemptParsed }
        }

        if (this._error.failFast && NSCCC_SCALING_DURATION) {
            const scalingDurationParsed = parseInt(NSCCC_SCALING_DURATION);
            this._error = { ...this._error, scalingDuration: scalingDurationParsed }
        }

    }




    // private throwMissingFieldError(key: string, value?: string) {
    //     throw new Error(`${key} has incorrect value: ${value}`);

    // }

    private throwInvalidURIError(key: string, value?: string) {
        const msg = `${key} is not a valid url: ${value}`;
        this.LOGGER.error(msg)
        throw new Error(msg);

    }



}