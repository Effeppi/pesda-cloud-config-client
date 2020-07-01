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

        const test = context.ClientConfiguration.getInstance()

        expect(test.url).toBe('http://localhost:8888/application/default')
        expect(test.clientRequestTimeout).toBe(120000)
        expect(test.retry).toBe(undefined)
    });

});


