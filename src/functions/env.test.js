describe('ENV', () => {
  test('should contain expected ENV var SERVICE', async () => {
    expect(process.env.SERVICE).toEqual('airtable-backups-demo');
  });
});
