import controllerErrorWrapper from '../../utils/error/errorWrapper';
import axios from 'axios';

const updateProfilePic = async function(s3: any) {
  try {
    const key = decodeURIComponent(s3.object.key);
    const username = key.split('/')[1];
    
    await axios.patch(`/profilePic/${username}`, {
      profile_pic: key
    });
  } catch (error) {
    controllerErrorWrapper(error);
  }
};

export {
	updateProfilePic,
};