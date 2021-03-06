import 'jest';
import * as jwt from 'jsonwebtoken';
import * as yup from 'yup';

import '../src/index';

const modes: Array<'regex' | 'decode'> = ['regex', 'decode'];
for (const mode of modes) {
    describe(`yup.string().jwt('${mode}')`, () => {
        const schema: yup.StringSchema = yup.string().jwt(mode);

        const nonsenseToken: string = 'qwerty12345';

        describe('isValidSync()', () => {
            const stringPayload: string = 'payload';
            const objectPayload: object = { stringPayload };
            const secret: string = 'secret';

            describe('returns true', () => {
                it('when testing a valid token with a string payload', () => {
                    const token: string = jwt.sign(stringPayload, secret);
                    expect(schema.isValidSync(token)).toBe(true);
                });

                it('when testing a valid token with an object payload', () => {
                    const token: string = jwt.sign(objectPayload, secret);
                    expect(schema.isValidSync(token)).toBe(true);
                });

                it('when testing a valid token that has expired', () => {
                    const payload = { stringPayload, exp: Math.floor(Date.now() / 1000) - 30 };
                    const token: string = jwt.sign(payload, secret);
                    expect(schema.isValidSync(token)).toBe(true);
                });
            });

            describe('returns false', () => {
                it('when testing an nonsense token', () => {
                    expect(schema.isValidSync(nonsenseToken)).toBe(false);
                });

                it('when testing a corrupted token', () => {
                    const token: string = jwt.sign(stringPayload, secret);
                    const corruptedToken: string = token + '#';
                    expect(schema.isValidSync(corruptedToken)).toBe(false);
                });
            });
        });

        describe('validateSync()', () => {
            describe('throws an error', () => {
                it('with the default message when no custom message is supplied', () => {
                    expect(() => schema.validateSync(nonsenseToken)).toThrowErrorMatchingSnapshot();
                });

                it('with a custom message when one is supplied', () => {
                    const customMessage: string = 'custom message';
                    const customMessageSchema: yup.StringSchema = yup
                        .string()
                        .jwt(mode, customMessage);
                    expect(() => customMessageSchema.validateSync(nonsenseToken)).toThrowError(
                        customMessage,
                    );
                });
            });
        });
    });
}
