import airtable from 'airtable';
import { fetchDataFromAirtable } from './airtableParser';

if (!process.env.AIRTABLE_TABLES) {
  throw Error('Could not find AIRTABLE_TABLES as environment variable. Exiting...');
}

airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_TOKEN,
});
const event = require('../../mocks/test-event');

describe('utils/airtableParser.js', () => {
  describe('fetchDataFromAirtable should return data', () => {
    test('when the table(s) provided are corrects', async () => {
      const dataFromAirtable = await fetchDataFromAirtable(event, process.env.AIRTABLE_TABLES.split(';'));
      expect(dataFromAirtable).toBeObject();
      expect(JSON.stringify(dataFromAirtable).length).toBePositive();
    });
  });

  describe('fetchDataFromAirtable should throw an error', () => {
    test('when the table(s) provided are not corrects', async () => {
      await expect(fetchDataFromAirtable(event, ['no-name-for-this-table', 'I-need-an-error-please']))
        .rejects
        .toThrow();
    });
  });
});
