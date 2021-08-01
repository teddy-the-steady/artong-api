import { profile } from '../controllers/photo/index';

export async function handler(event: any, context: any, callback: any) {
  try {
    const key = decodeURIComponent(event.Records[0].s3.object.key);
    const folder = key.split('/')[2];

    switch (folder) {
      case 'pofile':
        await profile.updateProfilePic(event.Records[0].s3);
        break;
      default:
        break;
    }
    return {'data': 'success'};
  } catch (err: any) {
    console.log(err);
    throw new Error(err);
  }
};