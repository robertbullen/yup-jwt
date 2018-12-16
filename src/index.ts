import * as jwt from 'jsonwebtoken';
import * as yup from 'yup';

// Declare a `jwt()` method on the `StringSchema` interface via module augmentation.
declare module 'yup' {
    export type JwtMode = 'regex' | 'decode' | 'verify';

    export type JwtKey = string | Buffer;

    export interface StringSchema {
        jwt(mode: 'regex' | 'decode', message?: string): StringSchema;
        jwt(mode: 'verify', key: JwtKey, message?: string): StringSchema;
    }
}

// tslint:disable-next-line:no-invalid-template-strings
export const defaultMessage: string = '${path} must be a parsable JSON web token';

// Implement the `StringSchema.jwt()` method.
yup.addMethod(yup.string, 'jwt', function(
    this: yup.StringSchema,
    mode: yup.JwtMode,
    maybeKeyOrMessage: string | yup.JwtKey | undefined,
    maybeMessage: string | undefined,
): yup.StringSchema {
    const checkMessageOrThrow = (value: string | yup.JwtKey | undefined): string => {
        if (!(value === undefined || typeof value === 'string')) {
            throw new TypeError(
                `Invalid argument: 'message' must be a string or undefined but was "${value}"`,
            );
        }
        return value || defaultMessage;
    };

    const checkKeyOrThrow = (value: string | yup.JwtKey | undefined): yup.JwtKey => {
        if (!(typeof value === 'string' || Buffer.isBuffer(value))) {
            throw new TypeError(
                "Invalid argument: 'key' must be a string, Buffer, or callback function",
            );
        }
        return value;
    };

    let message: string;
    let key: yup.JwtKey;
    switch (mode) {
        case 'regex':
        case 'decode':
            message = checkMessageOrThrow(maybeKeyOrMessage);
            break;

        case 'verify':
            key = checkKeyOrThrow(maybeKeyOrMessage);
            message = checkMessageOrThrow(maybeMessage);
            break;

        default:
            throw new TypeError(`Invalid argument: 'mode' is `);
    }

    return this.test({
        exclusive: true,
        message,
        name: 'jwt',
        test(this: yup.TestContext, value: string): boolean {
            switch (mode) {
                case 'regex':
                    return /^[0-9a-z\-_]+?\.[0-9a-z\-_]+?\.([0-9a-z\-_]+)?$/i.test(value);

                case 'decode':
                    return !!jwt.decode(value);

                case 'verify':
                    return !!jwt.verify(value, key);

                default:
                    throw new Error('Unreachable code detected');
            }
        },
    });
});
