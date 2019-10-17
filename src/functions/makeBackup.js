import {fetchDataFromAirtable} from "../utils/airtableParser";
import {uploadBackup} from "../utils/backup";
import Epsagon from "epsagon";

export const handler = async (event, context, callback) => {
    if (!event.hasOwnProperty('AIRTABLE_BASE') || !event.hasOwnProperty('AIRTABLE_TABLES') || !event.hasOwnProperty('S3_DIRECTORY')) {
        const err = Error(`Can't access to AIRTABLE_BASE or AIRTABLE_TABLES or S3_DIRECTORY in the event variable`);
        Epsagon.setError(err);
        throw err;
    }
    const tables = event["AIRTABLE_TABLES"].split(";");
    const airtableContent = await fetchDataFromAirtable(event, tables);
    try {
        await uploadBackup(event, airtableContent);
    } catch (e) {
        Epsagon.setError(e);
        return {
            statusCode: 500,
            body: JSON.stringify({
                "error": e,
                "humanReadableError": "Error while uploding data to S3"
            })
        };
    }
    return {
        statusCode: 200,
        body: "Successfully created backup"
    };
};
