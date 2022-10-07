import controllerErrorWrapper from '../../utils/error/errorWrapper';
import axios from 'axios';

const updateProfileThumbnail = async function(s3: any) {
  try {
    // TODO]
    // 1. 이미지 다운로드
    // 2. 썸네일 생성
    // 3. PATCH /members/{id}/profile_thumbnail
    
    // const key = decodeURIComponent(s3.object.key);
    // const id = key.split('/')[2];
    
    // await axios.patch(`/members/${id}/profile_thumbnail`, {
    //   thumbnail_url: key
    // });
  } catch (error) {
    controllerErrorWrapper(error);
  }
};

export {
	updateProfileThumbnail,
};