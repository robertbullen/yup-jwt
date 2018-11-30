import * as jwt from 'jsonwebtoken';
import * as yup from 'yup';

// Declare a `jwt()` method on the `StringSchema` interface via module augmentation.
declare module 'yup' {
    export interface StringSchema {
        jwt(message?: string): StringSchema;
    }
}

// tslint:disable-next-line:no-invalid-template-strings
export const defaultMessage: string = '${path} must be a parsable JSON web token';

// Implement the `StringSchema.jwt()` method.
yup.addMethod(yup.string, 'jwt', function(this: yup.StringSchema, message: string = defaultMessage): yup.StringSchema {
    return this.test({
        exclusive: true,
        message,
        name: 'jwt',
        test(this: yup.TestContext, value: string): boolean {
            return !!jwt.decode(value);
        },
    });
});
