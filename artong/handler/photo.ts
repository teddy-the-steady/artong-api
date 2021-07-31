import 'reflect-metadata';
import * as init from '../init';
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

export async function handler(event: any, context: any, callback: any) {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const params = {
    Bucket: bucket,
    Key: key,
  }; 
  try {
    const { ContentType } = await s3.getObject(params).promise();
    console.log('CONTENT TYPE:', ContentType);
    return ContentType;
  } catch (err) {
    console.log(err);
    const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    console.log(message);
    throw new Error(message);
  }
};