import { SSMClient, GetParametersCommand, Parameter } from '@aws-sdk/client-ssm'
const ssm = new SSMClient();

const getDBKeys = async function(){
  const getDBKeysCommand = new GetParametersCommand({
    Names: [
      `/db/${process.env.ENV}/host`,
      `/db/${process.env.ENV}/database`,
      `/db/${process.env.ENV}/user`,
      `/db/${process.env.ENV}/password`,
    ],
    WithDecryption: true
  });

  try {
    const keys = await ssm.send(getDBKeysCommand);
    return formatKeys(keys.Parameters);
  } catch (error) {
    console.error(error);
  }
}

const getApiKey = async function(){
  const getApiKeysCommand = new GetParametersCommand({
    Names: [
      `/apikey/${process.env.ENV}/artong`,
    ],
    WithDecryption: true
  });

  try {
    const keys = await ssm.send(getApiKeysCommand);
    return formatKeys(keys.Parameters);
  } catch (error) {
    console.error(error);
  }
}

const getNftStorageKey = async function(){
  const getStorageKeysCommand = new GetParametersCommand({
    Names: [
      `/nftStorage/${process.env.ENV}/apikey`,
    ],
    WithDecryption: true
  });

  try {
    const keys = await ssm.send(getStorageKeysCommand);
    return formatKeys(keys.Parameters);
  } catch (error) {
    console.error(error);
  }
}

const getSmtpKeys = async function(){
  const getSmtpKeysCommand = new GetParametersCommand({
    Names: [
      `/email/${process.env.ENV}/user`,
      `/email/${process.env.ENV}/pass`,
    ],
    WithDecryption: true
  });

  try {
    const keys = await ssm.send(getSmtpKeysCommand);
    return formatKeys(keys.Parameters);
  } catch (error) {
    console.error(error);
  }
}

const getInfuraKey = async function(){
  const getInfuraKeysCommand = new GetParametersCommand({
    Names: [
      `/infura/${process.env.ENV}/key`,
    ],
    WithDecryption: true
  });

  try {
    const keys = await ssm.send(getInfuraKeysCommand);
    return formatKeys(keys.Parameters);
  } catch (error) {
    console.error(error);
  }
}


interface Ikeys {
  [key: string]: string | undefined;
}
const formatKeys = function(keys: Parameter[] | undefined) {
  if (!keys) return {}

  return keys.reduce((acc: Ikeys, cur) => {
    if (!cur.Name) return acc
    acc[cur.Name] = cur.Value;
    return acc;
  }, {});
}

export {
  getDBKeys,
  getApiKey,
  getNftStorageKey,
  getSmtpKeys,
  getInfuraKey,
}