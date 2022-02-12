const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

const getSecretKeys = async function(){
  try {
    const keys = await secretKeyPromise.promise();
    return formatKeys(keys.Parameters);
  } catch (error) {
    console.error(error);
  }
}

const secretKeyPromise = ssm.getParameters({
  Names: [
    '/db/host',
    '/db/stage/database',
    '/db/user',
    '/db/password',
    '/apikey/artongApiKeyProd',
  ],
  WithDecryption: true
});

const formatKeys = function(keys: Array<any>) {
  return keys.reduce((acc, cur) => {
    acc[cur.Name] = cur.Value;
    return acc;
  }, {});
}

export default getSecretKeys;