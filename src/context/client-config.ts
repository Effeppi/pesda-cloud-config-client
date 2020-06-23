import { ServerConfiguration, ErrorConfiguration, RetryStrategyConfig } from "../model";
import { Environment } from "./env-enum";
import { isURL } from "../util";

export class ClientConfiguration {

    private readonly DEFAULT_MAX_RETRY_ATTEMPTS = 6;
    private readonly DEFAULT_SCALING_DURATION = 1000;

    private static _instance: ClientConfiguration;
    private _server: ServerConfiguration = { applicationName: 'application', baseUri: 'http://localhost:8888', profile: 'default' };
    private _error: ErrorConfiguration = { failFast: false };

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
        const maxRetryAttempts = (typeof this._error.maxRetryAttempts === 'number'
            && !isNaN(this._error.maxRetryAttempts))
            ? this._error.maxRetryAttempts
            : this.DEFAULT_MAX_RETRY_ATTEMPTS


        const scalingDuration = (typeof this._error.scalingDuration === 'number'
            && !isNaN(this._error.scalingDuration))
            ? this._error.scalingDuration
            : this.DEFAULT_SCALING_DURATION

        const retryStrategy: RetryStrategyConfig = { maxRetryAttempts, scalingDuration }

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
        if (!isURL(this._server.baseUri)) {
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
            this._server = { ...this._server, baseUri }
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


        if (this._error.failFast && typeof NSCCC_MAX_RETRY_ATTEMPTS !== 'undefined') {
            const maxRetryAttempts = parseInt(NSCCC_MAX_RETRY_ATTEMPTS);
            this._error = { ...this._error, maxRetryAttempts }
        }

        if (this._error.failFast && typeof NSCCC_SCALING_DURATION !== 'undefined') {
            const scalingDuration = parseInt(NSCCC_SCALING_DURATION);
            this._error = { ...this._error, scalingDuration }
        }

    }




    // private throwMissingFieldError(key: string, value?: string) {
    //     throw new Error(`${key} has incorrect value: ${value}`);

    // }

    private throwInvalidURIError(key: string, value?: string) {
        const msg = `${key} is not a valid url: ${value}`;
        throw new TypeError(msg);

    }



}