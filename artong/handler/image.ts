import { profile, content, project } from '../controllers/image/index';
import { InternalServerError } from '../utils/error/errors';
import { getApiKey } from '../utils/common/ssmKeys';
import axios from 'axios';

axios.defaults.baseURL = `https://api.4rtong.com/${process.env.ENV}/artong/v1`;
const setApiKey = async function() {
  return await getApiKey();
};
let initKeys: any = null;

export async function handler(event: any, context: any, callback: any) {
  console.log(event);
  console.log(event.Records[0].s3.object);

  try {
    if (!initKeys) {
      initKeys = await setApiKey();
      axios.defaults.headers.common['x-api-key'] = initKeys[`/apikey/${process.env.ENV}/artong`];
    } 
    const key = decodeURIComponent(event.Records[0].s3.object.key);
    const type = key.split('/')[1]; // INFO] ex) public/profile/315/monkey.png

    switch (type) {
      case 'profile':
        await profile.updateProfileThumbnail(event.Records[0].s3);
        break;
      case 'nft':
        await content.updateContentThumbnail(event.Records[0].s3);
        break;
      case 'project':
        await project.updateProjectThumbnail(event.Records[0].s3);
        break;
      default:
        break;
    }
    return {data: 'success'};
  } catch (err) {
    throw new InternalServerError(err, null);
  }
};