const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

const getDBKeys = async function(){
  try {
    const keys = await DBKeyPromise.promise();
    return formatKeys(keys.Parameters);
  } catch (error) {
    console.error(error);
  }
}

const DBKeyPromise = ssm.getParameters({
  Names: [
    `/db/${process.env.ENV}/host`,
    `/db/${process.env.ENV}/database`,
    `/db/${process.env.ENV}/user`,
    `/db/${process.env.ENV}/password`,
  ],
  WithDecryption: true
});

const getApiKey = async function(){
  try {
    const keys = await apiKeyPromise.promise();
    return formatKeys(keys.Parameters);
  } catch (error) {
    console.error(error);
  }
}

const apiKeyPromise = ssm.getParameters({
  Names: [
    `/apikey/${process.env.ENV}/artong`,
  ],
  WithDecryption: true
});

const getNftStorageKey = async function(){
  try {
    const keys = await nftStorageKeyPromise.promise();
    return formatKeys(keys.Parameters);
  } catch (error) {
    console.error(error);
  }
}

const nftStorageKeyPromise = ssm.getParameters({
  Names: [
    `/nftStorage/${process.env.ENV}/apikey`,
  ],
  WithDecryption: true
});

const getSmtpKeys = async function(){
  try {
    const keys = await smtpKeyPromise.promise();
    return formatKeys(keys.Parameters);
  } catch (error) {
    console.error(error);
  }
}

const smtpKeyPromise = ssm.getParameters({
  Names: [
    `/email/${process.env.ENV}/user`,
    `/email/${process.env.ENV}/pass`,
  ],
  WithDecryption: true
});

const formatKeys = function(keys: Array<any>) {
  return keys.reduce((acc, cur) => {
    acc[cur.Name] = cur.Value;
    return acc;
  }, {});
}

export {
  getDBKeys,
  getApiKey,
  getNftStorageKey,
  getSmtpKeys,
}