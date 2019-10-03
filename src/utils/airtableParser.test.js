import airtable from "airtable";
import {fetchDataFromAirtable} from "./airtableParser";

if (!process.env.AIRTABLE_TABLES || !process.env.AIRTABLE_TABLES_CONTENT) {
    throw Error("Could not find AIRTABLE_TABLES or AIRTABLE_TABLES_CONTENT as environment variable. Exiting...");
}

airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_TOKEN
});
const base = airtable.base(process.env.AIRTABLE_BASE);

describe('utils/airtableParser.js', () => {
    describe('fetchDataFromAirtable should return data', () => {
        test('when the table(s) provided are corrects', async () => {
            const dataFromAirtable = await fetchDataFromAirtable(process.env.AIRTABLE_TABLES.split(";"));
            expect(dataFromAirtable).toBeObject();
            expect(JSON.stringify(dataFromAirtable)).toEqual(process.env.AIRTABLE_TABLES_CONTENT);
        });
    });
    describe('fetchDataFromAirtable should throw an error', () => {
        test('when the table(s) provided are not corrects', async () => {
            await expect(fetchDataFromAirtable(['no-name-for-this-table', 'I-need-an-error-please']))
                .rejects
                .toThrow();
        });
    });
});
