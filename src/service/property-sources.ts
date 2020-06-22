import axios, { AxiosRequestConfig } from 'axios'
import { of, Observable } from 'rxjs';
import { retryWhen, map, catchError, take } from 'rxjs/operators';
import { SpringCloudConfigServerResponse, PropertySources } from '../model';
import { ClientConfiguration, Logger } from '.';
import { retryStrategy } from '../util/retry-strategy';


export class PropertySourcesContext {

    private static _instance: PropertySourcesContext;
    private _propertySources: PropertySources[] = [];
    private _interceptors: ((req: AxiosRequestConfig) => AxiosRequestConfig)[] = [];

    private constructor(interceptors?: ((req: AxiosRequestConfig) => AxiosRequestConfig)[]) {
        this._interceptors = interceptors ? interceptors : [];
    }


    static getInstance(interceptors?: ((req: AxiosRequestConfig) => AxiosRequestConfig)[]): PropertySourcesContext {
        if (!this._instance) {

            this._instance = new PropertySourcesContext(interceptors)
        }

        return this._instance;
    }


    get propertySources() {
        return this._propertySources;
    }

    public load(): Observable<PropertySources[]> {

        const LOGGER = Logger.getLogger();

        const options = ClientConfiguration.getInstance();

        const url = options.url


        const axiosInstance = axios.create()

        this._interceptors.forEach(interceptor => {
            axiosInstance.interceptors.request.use(interceptor)
        })

        const observable$ = new Observable<SpringCloudConfigServerResponse>(subscriber => {

            axiosInstance.request<SpringCloudConfigServerResponse>({ baseURL: url })
                .then(v => subscriber.next(v.data), err => subscriber.error(err))
                .catch(reason => console.log(reason))
        })

        let observableResult$: Observable<PropertySources[]>;

        if (options.retry) {
            observableResult$ = observable$.pipe(
                retryWhen(retryStrategy(options.retry)),
                take(1),
                map(v => {
                    let result: PropertySources[] = [];
                    if (v) {
                        const observableResult = v.propertySources.reverse()

                        this._propertySources = observableResult;
                        observableResult.forEach(value => {
                            const source = value.source;

                            Object.keys(source).forEach((sourceValue) => {
                                process.env[sourceValue] = source[sourceValue];
                            })
                        })

                    }

                    return result;
                })

            )

        } else {
            observableResult$ = observable$.pipe(
                catchError(error => {
                    console.log(process.env['NSCCC_LOGGER_LEVEL'])
                    LOGGER.debug(`${error}. You see this error because failFast property is set to false. `)
                    return of(undefined)
                }),
                take(1),
                map(v => {
                    let result: PropertySources[] = [];
                    if (v) {
                        const observableResult = v.propertySources.reverse()

                        this._propertySources = observableResult;
                        observableResult.forEach(value => {
                            const source = value.source;

                            Object.keys(source).forEach((sourceValue) => {
                                process.env[sourceValue] = source[sourceValue];
                            })
                        })

                    }

                    return result;
                })
            )
        }

        return observableResult$;
    }

}


