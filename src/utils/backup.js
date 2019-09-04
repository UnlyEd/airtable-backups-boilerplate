import AWS from 'aws-sdk';
import moment from 'moment';

export const uploadBackup = async (event, jsonData) => {
  const s3 = new AWS.S3();
  const BACKUP_NAME = event['S3_DIRECTORY'] + moment().format('YYYY_MM_DD_HH-mm-ss') + '.json';

  return await s3.putObject({
    Bucket: process.env.S3_BUCKET,
    Key: BACKUP_NAME,
    Body: JSON.stringify(jsonData),
  }).promise();
};
