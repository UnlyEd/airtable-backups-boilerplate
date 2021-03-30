import Epsagon from 'epsagon';
import { fetchDataFromAirtable } from '../utils/airtableParser';
import { uploadBackup } from '../utils/backup';

export const handler = async (event, context, callback) => {
  if (!Object.prototype.hasOwnProperty.call(event, 'AIRTABLE_BASE') || !Object.hasOwnProperty.call(event, 'AIRTABLE_TABLES') || !Object.hasOwnProperty.call(event, 'S3_DIRECTORY')) {
    const err = Error(`Can't access to AIRTABLE_BASE or AIRTABLE_TABLES or S3_DIRECTORY in the event variable`);
    Epsagon.setError(err);
    throw err;
  }

  const tables = event['AIRTABLE_TABLES'].split(';');
  const airtableContent = await fetchDataFromAirtable(event, tables);

  try {
    const response = await uploadBackup(event, airtableContent);

    try {
      const {
        __metadata: {
          Bucket: bucketName,
          StorageClass: storageClass,
          Key: backupName,
        },
      } = response;
      console.log(`Backup "${backupName}" successfully uploaded to bucket "${bucketName}" (using storage class: "${storageClass}")`);

      return {
        statusCode: 200,
        body: 'Successfully created backup',
      };

    } catch (e) {
      console.error(e);
      Epsagon.setError(e);

      return {
        statusCode: 500,
        body: JSON.stringify({
          'error': e,
          'humanReadableError': 'Error while uploading data to S3',
        }),
      };
    }
  } catch (e) {
    console.error(e);
    Epsagon.setError(e);

    return {
      statusCode: 500,
      body: JSON.stringify({
        'error': e,
        'humanReadableError': 'Error while uploading data to S3',
      }),
    };
  }
};
