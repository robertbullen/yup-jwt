module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.test.json',
        },
    },
    preset: 'ts-jest',
    testMatch: null,
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
};
