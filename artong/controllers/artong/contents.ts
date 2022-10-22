import { Contents, Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import getSecretKeys from '../../utils/common/ssmKeys';
import { PoolClient } from 'pg';
import { getS3ObjectInBuffer, getS3ObjectHead } from '../../utils/common/commonFunc';
import { S3Client } from '@aws-sdk/client-s3';
import { NFTStorage } from 'nft.storage';
import { File } from '@web-std/file';
import axios from 'axios';

const postContent = async function(body: any, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const contentModel = new Contents({
      member_id: member.id,
      project_address: body.project_address,
      content_s3key: body.content_s3key,
    }, conn);

    const result = await contentModel.createContent(
      contentModel.member_id,
      contentModel.project_address,
      contentModel.content_s3key
    );
    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const uploadToNftStorageAndUpdateContent = async function(body: any) {
  const conn: PoolClient = await db.getConnection();

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

    const realMetadata = await axios.get(`https://ipfs.io/ipfs/${metadata.ipnft}/metadata.json`);
    if (realMetadata && realMetadata.data && realMetadata.data.image) {
      result.content_url = realMetadata.data.image;
    }

    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const patchContent = async function(pathParameters: any, body: any) {
  const conn: PoolClient = await db.getConnection();

  try {
    const contentModel = new Contents({
      id: pathParameters.id,
      token_id: body.tokenId,
      voucher: body.voucher,
      is_redeemed: body.isRedeemed,
    }, conn);

    const result = await contentModel.updateContent(
      contentModel.id,
      contentModel.ipfs_url,
      contentModel.token_id,
      contentModel.voucher,
      contentModel.is_redeemed,
    );
    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const getContent = async function(pathParameters: any) {
  const conn: PoolClient = await db.getConnection();

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