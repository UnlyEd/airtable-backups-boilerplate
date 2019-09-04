import { handler } from './status';

describe('functions/status.js', () => {
  const event = {
    queryStringParameters: {},
  };

  test('should return expected JSON', async () => {
    const data = await handler(event);

    expect(data.body).toBeDefined();
    expect(data.statusCode).toEqual(200);

    const parseBody = JSON.parse(data.body);

    expect(parseBody).toHaveProperty('status');
    expect(parseBody.status).toBe('OK');
  });
});
