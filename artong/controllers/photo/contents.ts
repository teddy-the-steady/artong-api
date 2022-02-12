import controllerErrorWrapper from '../../utils/error/errorWrapper';
import axios from 'axios';

const createUploadAndContent = async function(s3: any) {
  try {
    const bucket = s3.bucket.name;
    const key = decodeURIComponent(s3.object.key);
    const username = key.split('/')[1];
    const size = s3.object.size;

    await axios.post(`/uploads`, {
      username: username,
      content_url: key,
      thumbnail_url: key,
    });
  } catch (error) {
    controllerErrorWrapper(error);
  }
};

export {
	createUploadAndContent,
};