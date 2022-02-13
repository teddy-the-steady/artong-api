import { profile, contents } from '../controllers/photo/index';
import { InternalServerError } from '../utils/error/errors';
import getSecretKeys from '../utils/common/ssmKeys';
import axios from 'axios';

axios.defaults.baseURL = `https://api.4rtong.com/${process.env.ENV}/artong/v1`;
const setApiKey = async function() {
  const keys = await getSecretKeys();
  axios.defaults.headers.common['x-api-key'] = keys[`/apikey/${process.env.ENV}/artongApiKey`];
};
let initKeys: any = null; // TODO] 핸들러 밖에서 초기화가 잘 안되는듯.. 핸들러 밖에 변수 선언했음에도 매 요청마다 if(!initKeys) 타는 이슈

export async function handler(event: any, context: any, callback: any) {
  console.log(event);

  try {
    if (!initKeys) {
      initKeys = await setApiKey();
    } 
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