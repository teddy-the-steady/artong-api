import controllerErrorWrapper from '../../utils/error/errorWrapper';
import axios from 'axios';
axios.defaults.baseURL = 'https://6tz1h3qch8.execute-api.ap-northeast-2.amazonaws.com/stage/artong/v1';

const updateProfilePic = async function(s3: any) {
  try {
    console.log('in updateProfilePic:', s3)
    const bucket = s3.bucket.name;
    const key = decodeURIComponent(s3.object.key);
    const username = key.split('/')[1];
    const size = s3.object.size;

    const config = {
      headers: {
        'x-api-key': 'KElcrjWSUR42A0zxhkUmP3UqGaJxQ8b2GlsuCOTa1',
      }
    }
    
    const member = await axios.patch(`/member/${username}/profilePic`, {
      profile_pic: key
    }, config);
    console.log('PATCH /member/:username/profilePic', member);
  } catch (error) {
    controllerErrorWrapper(error);
  }
};

export {
	updateProfilePic,
};