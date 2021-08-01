import controllerErrorWrapper from '../../utils/error/errorWrapper';
// import axios from 'axios';
// axios.defaults.baseURL = 'https://6tz1h3qch8.execute-api.ap-northeast-2.amazonaws.com/stage/artong/v1';

const updateProfilePic = async function(s3: any) {
  try {    
    const bucket = s3.bucket.name;
    const key = decodeURIComponent(s3.object.key);
    const username = key.split('/')[1];
    const size = s3.object.size;

    // const member = await axios.get(`/member?username=${username}`);
    // console.log('GET /member?username', member);
  } catch (error) {
    controllerErrorWrapper(error);
  }
};

export {
	updateProfilePic,
};