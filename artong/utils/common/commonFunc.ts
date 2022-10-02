import { S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

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

    const command = new HeadObjectCommand(option);
    const response = await client.send(command);
    return response
}

export {
    getTotalRows,
    extractTotalRows,
    hasBOPermission,
    replaceAll,
    getS3ObjectInBuffer,
    getS3ObjectHead,
};