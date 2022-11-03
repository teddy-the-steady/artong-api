import axios from 'axios';
import sharp from 'sharp';
import { S3Client } from '@aws-sdk/client-s3';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import { getS3ObjectInBuffer, putS3Object } from '../../utils/common/commonFunc';

const updateContentThumbnail = async function(s3: any) {
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
    if (imageType != 'jpg' && imageType != 'jpeg' && imageType != 'png') {
      console.log(`Unsupported image type: ${imageType}`);
      return
    }

    const client = new S3Client({ region: 'ap-northeast-2' });
    const image = await getS3ObjectInBuffer(client, bucket, srcKey);

    const width = 200;

    const buffer = await sharp(image)
      .resize(width)
      .withMetadata()
      .toBuffer();

    await putS3Object(client, bucket, dstKey, buffer);

    await axios.patch(`/members/${srcKey.split('/')[2]}/profile_thumbnail_s3key`, {
      profile_thumbnail_s3key: dstKey
    });
  } catch (error) {
    controllerErrorWrapper(error);
  }
};

const makeDstKeyWithResizedFileName = function(srcKey: string) {
  const items = srcKey.split('/');
  let fileName = items[items.length - 1];
  fileName = 'resized-' + fileName;
  items[items.length - 1] = fileName;

  return `${items[0]}/nft/${items[1]}/${items[2]}/${items[3]}`
}

export {
	updateContentThumbnail,
};