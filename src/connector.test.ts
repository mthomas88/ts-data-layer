import { describe, expect, test } from 'vitest';
import { connectToPostgresql } from './connector';


describe('datasource connector test suite', () => {
    test('it can connect to a postgresql database running inside a docker container', async () => {
        const result = await connectToPostgresql();
        expect(typeof result).toBe('object');
    });
});