import Epsagon from "epsagon";
import airtable from "airtable";

if (!process.env.AIRTABLE_TABLES) {
    const err = Error("Could not find AIRTABLE_TABLES as environment variable. Exiting...");
    Epsagon.setError(err);
    throw err;
}

airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_TOKEN
});
const base = airtable.base(process.env.AIRTABLE_BASE);

export const fetchDataFromAirtable = async (tables) => {
    let jsonRecords = {};
    for (let i = 0; i < tables.length; i++) {
        let el = tables[i];
        try {
            await base(el).select().all().then(async (records) => {
                jsonRecords[el] = (records.map((record) => record._rawJson));
            });
        } catch (e) {
            const err = Error(`Can't find Airtable table ${el} with provided base`);
            Epsagon.setError(err);
            throw err;
        }
    }
    return jsonRecords;
};