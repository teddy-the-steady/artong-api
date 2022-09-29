import controllerErrorWrapper from '../../utils/error/errorWrapper';
import axios from 'axios';

const insertNft = async function(s3: any) {
  try {
    const key = decodeURIComponent(s3.object.key);
    const keyItems = key.split('/');
    
    await axios.post(`/nft`, {
      member_id: keyItems[3],
      project_address: keyItems[2],
      content_url: key,
    });
  } catch (error) {
    controllerErrorWrapper(error);
  }
};

export {
	insertNft,
};