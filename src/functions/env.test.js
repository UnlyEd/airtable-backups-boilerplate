describe('ENV', () => {
  test('should contain expected ENV var SERVICE', async () => {
    expect(process.env.SERVICE).toEqual('PROJECT-NAME');
  });

  test('should contain expected ENV var EXAMPLE_ENV_VAR', async () => {
    expect(process.env.EXAMPLE_ENV_VAR).toEqual('example');
  });

  test('should contain expected ENV var EXAMPLE_ENV_VAR_TEST_ENV_ONLY', async () => {
    expect(process.env.EXAMPLE_ENV_VAR_TEST_ENV_ONLY).toEqual('1');
  });
});
