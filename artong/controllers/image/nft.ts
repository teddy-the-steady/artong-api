import controllerErrorWrapper from '../../utils/error/errorWrapper';
import axios from 'axios';

const insertNft = async function(s3: any) {
  try {
    const key = decodeURIComponent(s3.object.key);
    const id = key.split('/')[2];
    
    await axios.post(`/nft`, {
      member_id: id,
      content_url: key,
    });
  } catch (error) {
    controllerErrorWrapper(error);
  }
};

export {
	insertNft,
};