import { Contents, Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import getSecretKeys from '../../utils/common/ssmKeys';
import { Client } from 'pg';
import { getS3ObjectInBuffer, getS3ObjectHead } from '../../utils/common/commonFunc';
import { S3Client } from '@aws-sdk/client-s3';
import { NFTStorage } from 'nft.storage';
import { File } from '@web-std/file';

const postContent = async function(body: any, member: Member) {
  const conn: Client = await db.getConnection();

  try {
    const contentModel = new Contents({
      member_id: member.id,
      project_address: body.project_address,
      content_url: body.content_url,
    }, conn);

    const result = await contentModel.createContent(
      contentModel.member_id,
      contentModel.project_address,
      contentModel.content_url
    );
    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const uploadToNftStorageAndUpdateContent = async function(body: any) {
  const conn: Client = await db.getConnection();

  try {
    const client = new S3Client({ region: 'ap-northeast-2' });
    const image = await getS3ObjectInBuffer(client, process.env.S3_BUCKET, body.imageKey);
    const head = await getS3ObjectHead(client, process.env.S3_BUCKET, body.imageKey);

    const fileName = body.imageKey.substring(body.imageKey.lastIndexOf('/') + 1, body.imageKey.length)
    const file = new File([image], fileName, { type: head.ContentType })

    const keys = await getSecretKeys();
    const nftStorageApiKey = keys[`/nftStorage/${process.env.ENV}/apikey`];

    const storage = new NFTStorage({ token: nftStorageApiKey });
    const metadata = await storage.store({
      name: body.name,
      description: body.description,
      image: file
    });

    const contentModel = new Contents({
      id: body.content_id,
      ipfs_url: metadata.url,
    }, conn);

    const result = await contentModel.updateContent(
      contentModel.id,
      contentModel.ipfs_url,
    );

    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const patchContent = async function(pathParameters: any, body: any) {
  const conn: Client = await db.getConnection();

  try {
    const contentModel = new Contents({
      id: pathParameters.id,
      token_id: body.tokenId,
      voucher: body.voucher,
    }, conn);

    const result = await contentModel.updateContent(
      contentModel.id,
      contentModel.ipfs_url,
      contentModel.token_id,
      contentModel.voucher,
    );
    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const getContent = async function(pathParameters: any) {
  const conn: Client = await db.getConnection();

  try {
    const contentModel = new Contents({
      id: pathParameters.id,
    }, conn);

    const result = await contentModel.getContent(
      contentModel.id,
    );
    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

export {
	postContent,
  uploadToNftStorageAndUpdateContent,
  patchContent,
  getContent,
};