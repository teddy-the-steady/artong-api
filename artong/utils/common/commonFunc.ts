import {
    S3Client,
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectCommand
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { ethers } from 'ethers';
import { InternalServerError } from '../error/errors';
import { AWSError } from '../error/errorCodes';

const getTotalRows = function(list: any[]) {
    if (typeof list !== 'undefined' && list.length > 0) {
        return list[0].TotalRows
    } else {
        return 0
    }
};

const extractTotalRows = function(list: any[]) {
    if (typeof list !== 'undefined' && list.length > 0) {
        for (let i in list) {
            if (list[i].hasOwnProperty('TotalRows')) {
                delete list[i].TotalRows;
            }
        }
        return list
    } else {
        return {}
    }
};

const hasBOPermission = function(memberGroups?: string[]) {
    const permissionGroups = ['manager'];
    if (memberGroups) {
        return permissionGroups.some(r => memberGroups.includes(r));
    }
    return false
};

const replaceAll = function(str: string, searchStr: string, replaceStr: string) {
    return str.split(searchStr).join(replaceStr);
};

const getS3ObjectInBuffer = function(
    client: S3Client,
    bucket: string|undefined,
    key: string
): Promise<Buffer> {
    const option: any = {
        Bucket: bucket,
        Key: key
    };

    return new Promise(async (resolve, reject) => {
        const getObjectCommand = new GetObjectCommand(option);

        try {
            const response = await client.send(getObjectCommand);
            const body = response.Body as Readable;

            let responseDataChunks: any[] = [];

            body.once('error', err => reject(err));
            body.on('data', chunk => responseDataChunks.push(chunk));
            body.once('end', () => resolve(Buffer.concat(responseDataChunks)));
        } catch (err) {
            return reject(err);
        }
    })
}

const getS3ObjectHead = async function(
    client: S3Client,
    bucket: string|undefined,
    key: string
) {
    const option: any = {
        Bucket: bucket,
        Key: key
    };

    try {
        const command = new HeadObjectCommand(option);
        const response = await client.send(command);
        return response
    } catch (error) {
        throw new InternalServerError(error, AWSError);
    }
}

const putS3Object = async function(
    client: S3Client,
    bucket: string|undefined,
    key: string,
    body: Buffer
) {
    try {
        const data = await client.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
        }));
        return data
    } catch (error) {
        throw new InternalServerError(error, AWSError);
    }
}

const calculateMinusBetweenTowSetsById = function(setA: [], setB: []): any[] {
    return setA.filter(
        (a: { id: string }) => setB.every((b: { id: string }) => a.id !== b.id)
    );
}

const isAddress = function(value: string) {
    return ethers.utils.isAddress(value);
}

const generateRandom = function (min: number, max: number) {
    const ranNum = Math.floor(Math.random()*(max-min+1)) + min;
    return ranNum;
}

export {
    getTotalRows,
    extractTotalRows,
    hasBOPermission,
    replaceAll,
    getS3ObjectInBuffer,
    getS3ObjectHead,
    putS3Object,
    calculateMinusBetweenTowSetsById,
    isAddress,
    generateRandom,
};