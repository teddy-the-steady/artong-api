import { profile } from '../controllers/photo/index';
import { InternalServerError } from '../utils/error/errors';

// TODO] axios baseUrl setting 여기서?
// x-api-key ssm에서 가져오기?
export async function handler(event: any, context: any, callback: any) {
  console.log(event);

  try {
    const key = decodeURIComponent(event.Records[0].s3.object.key);
    const type = key.split('/')[2];

    switch (type) {
      case 'profile':
        await profile.updateProfilePic(event.Records[0].s3);
        break;
      default:
        break;
    }
    return {'data': 'success'};
  } catch (err) {
    throw new InternalServerError(err, null);
  }
};