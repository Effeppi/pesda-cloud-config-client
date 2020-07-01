import * as context from '../../../src/context'


describe('Logger config', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules()
        process.env = {}

    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    test('Set logger to true', () => {
        process.env[context.Environment.LOGGER_ENABLED] = 'false';

        const test = context.LogConfiguration.getInstance()

        expect(test.options.enabled).toBe(false)
        expect(test.options.level).toBe('error')
    });
  

});