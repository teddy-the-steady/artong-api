import axios from 'axios';
import sharp from 'sharp';
import { S3Client } from '@aws-sdk/client-s3';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import { getS3ObjectInBuffer, putS3Object } from '../../utils/common/commonFunc';

const updateProfileThumbnail = async function(s3: any) {
  try {
    const bucket = s3.bucket.name;
    const srcKey = decodeURIComponent(s3.object.key.replace(/\+/g, ' '));
    const dstKey = makeDstKeyWithResizedFileName(srcKey);

    const typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
      console.log('Could not determine the image type.');
      return
    }

    const imageType = typeMatch[1].toLowerCase();
    if (imageType != 'jpg' && imageType != 'png') {
      console.log(`Unsupported image type: ${imageType}`);
      return
    }

    const client = new S3Client({ region: 'ap-northeast-2' });
    const image = await getS3ObjectInBuffer(client, bucket, srcKey);

    const width = 200;

    const buffer = await sharp(image).resize(width).toBuffer();

    await putS3Object(client, bucket, dstKey, buffer);

    await axios.patch(`/members/${srcKey.split('/')[2]}/profile_thumbnail_s3key`, {
      profile_thumbnail_s3key: dstKey
    });
  } catch (error) {
    controllerErrorWrapper(error);
  }
};

const makeDstKeyWithResizedFileName = function(srcKey: string) {
  const srcKeyItems = srcKey.split('/');
  let fileName = srcKeyItems[srcKeyItems.length - 1];
  fileName = 'resized-' + fileName;
  srcKeyItems[srcKeyItems.length - 1] = fileName;

  return srcKeyItems.join('/')
}

export {
	updateProfileThumbnail,
};