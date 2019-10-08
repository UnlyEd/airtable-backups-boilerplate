import moment from "moment";
import AWS from "aws-sdk";
import {getOrganisationVariable} from "./environment";

const BACKUP_NAME = getOrganisationVariable("S3_DIRECTORY") + moment().format('YYYY_MM_DD_HH-mm-ss') + ".json";

export const uploadBackup = async (jsonData) => {
    const s3 = new AWS.S3();

    return await s3.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: BACKUP_NAME,
        Body: JSON.stringify(jsonData),
    }).promise();
};