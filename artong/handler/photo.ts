import { profile, contents } from '../controllers/photo/index';
import { InternalServerError } from '../utils/error/errors';
import getSecretKeys from '../utils/common/ssmKeys';
import axios from 'axios';

axios.defaults.baseURL = 'https://6tz1h3qch8.execute-api.ap-northeast-2.amazonaws.com/stage/artong/v1';
const setApiKey = async function() {
  const keys = await getSecretKeys();
  console.log(keys)
  axios.defaults.headers.common['x-api-key'] = keys['/apikey/artongApiKeyStage'];
};
let initKeys: any = null;

export async function handler(event: any, context: any, callback: any) {
  console.log(event);

  try {
    if (!initKeys) {
      initKeys = await setApiKey();
    } else {
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
    }
  } catch (err) {
    throw new InternalServerError(err, null);
  }
};