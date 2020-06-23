import { Observable, throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { RetryStrategyConfig } from '../model';
import { Logger } from '../util';

export const retryStrategy = (cfg: RetryStrategyConfig) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const LOGGER = Logger.getLogger();


      const retryAttempt = i + 1;
      LOGGER.error('Error during keep configuration from cloud config server')

      LOGGER.error(`Path: ${error.config.baseURL}`)

      
      if (retryAttempt > cfg.maxRetryAttempts) {
        LOGGER.error(`Max retry attempt.`)
        return throwError(error);
      }

      const waitFor = retryAttempt * cfg.scalingDuration;

      LOGGER.info(`The system will retry other ${cfg.maxRetryAttempts - i} times before fail. `)

      LOGGER.info(`Waiting before retry: ${waitFor} ms`)

      return timer(waitFor);
    })
    // finalize(() => console.log(`Max retry attempt ${cfg.maxRetryAttempts} expired. `))
  );
};