import AWS from 'aws-sdk';
import moment from 'moment';

export const uploadBackup = async (event, jsonData) => {
  const s3 = new AWS.S3();
  const BACKUP_NAME = event['S3_DIRECTORY'] + moment().format('YYYY_MM_DD_HH-mm-ss') + '.json';
  const storageClass = event['STORAGE_CLASS'] || 'STANDARD_IA'; // "STANDARD"|"REDUCED_REDUNDANCY"|"STANDARD_IA"|"ONEZONE_IA"|"INTELLIGENT_TIERING"|"GLACIER"|"DEEP_ARCHIVE"
  const params = {
    Bucket: process.env.S3_BUCKET,
    StorageClass: storageClass,
    Key: BACKUP_NAME,
  };

  const response = await s3.putObject({
    ...params,
    Body: JSON.stringify(jsonData),
  }).promise();

  return {
    ...response,
    __metadata: {
      ...params,
    },
  };
};
