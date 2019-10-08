import Epsagon from "epsagon";
import airtable from "airtable";
import {getOrganisationVariable} from "./environment";

airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_TOKEN
});

const base = airtable.base(getOrganisationVariable("AIRTABLE_BASE"));

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