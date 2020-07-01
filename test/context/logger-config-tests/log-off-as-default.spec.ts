import * as context from '../../../src/context'

describe('Logger config', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        process.env = {}
        
    });
    
    afterEach(() => {
        jest.resetModuleRegistry()
        process.env = OLD_ENV;
    });


    test('Check log is disabled as default', () => {

        const test = context.LogConfiguration.getInstance()

        expect(test.options.enabled).toBe(false)

        expect(test.options.level).toBe('error')
    });

});


