import { profile, contents } from '../controllers/photo/index';
import { InternalServerError } from '../utils/error/errors';
import axios from 'axios';

axios.defaults.baseURL = 'https://6tz1h3qch8.execute-api.ap-northeast-2.amazonaws.com/stage/artong/v1';
axios.defaults.headers.common['x-api-key'] = 'KElcrjWSUR42A0zxhkUmP3UqGaJxQ8b2GlsuCOTa';

export async function handler(event: any, context: any, callback: any) {
  console.log(event);

  try {
    const key = decodeURIComponent(event.Records[0].s3.object.key);
    const type = key.split('/')[2];

    switch (type) {
      case 'profile':
        await profile.updateProfilePic(event.Records[0].s3);
        break;
      case 'contents':
        await contents.createUploadAndContent(event.Records[0].s3);
        break;
      default:
        break;
    }
    return {'data': 'success'};
  } catch (err) {
    throw new InternalServerError(err, null);
  }
};