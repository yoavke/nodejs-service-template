const { createResponse } = require('../../logics/common/utils');

const testInput = { status: 200, message: 'test message' };

test('create user defined table (MSSQL)', () => {
    const obj = createResponse(200, 'test message');

    expect(obj).toEqual(testInput);
});