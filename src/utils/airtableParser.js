import airtable from 'airtable';
import Epsagon from 'epsagon';

export const fetchDataFromAirtable = async (event, tables) => {
  airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_TOKEN,
  });

  const base = airtable.base(event['AIRTABLE_BASE']);

  let jsonRecords = {};
  for (let i = 0; i < tables.length; i++) {
    let el = tables[i];
    try {
      await base(el).select().all().then(async (records) => {
        jsonRecords[el] = (records.map((record) => record._rawJson));
      });
    } catch (e) {
      const err = Error(`Can't find Airtable table ${el} with provided base ${event['AIRTABLE_BASE']}, original error: ${e}`);
      Epsagon.setError(err);
      throw err;
    }
  }
  return jsonRecords;
};
