import * as clientConfig from '../../../src/context'


describe('Client config', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules()
        process.env = {}

    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    test('Set logger to true', () => {
        process.env[clientConfig.Environment.LOGGER_ENABLED] = 'true';

        const test = clientConfig.LogConfiguration.getInstance()

        expect(test.options.enabled).toBe(true)
        expect(test.options.level).toBe('error')
    });
  

});