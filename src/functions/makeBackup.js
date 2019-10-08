import {fetchDataFromAirtable} from "../utils/airtableParser";
import {uploadBackup} from "../utils/backup";
import Epsagon from "epsagon";
import {getOrganisationVariable} from "../utils/environment";

export const handler = async (event, context, callback) => {
    const tables = getOrganisationVariable("AIRTABLE_TABLES").split(";");
    const airtableContent = await fetchDataFromAirtable(tables);
    try {
        await uploadBackup(airtableContent);
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
