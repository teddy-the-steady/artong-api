import controllerErrorWrapper from '../../utils/error/errorWrapper';
import axios from 'axios'

const subgraph = async function(body: any) {

  try {
    const result = await axios({
      url: '/query/36284/artong-test/v0.0.11',
      baseURL: 'https://api.studio.thegraph.com',
      method: 'POST',
      data: body
    });

    return {'data': result.data.data}
  } catch (error) {
    throw controllerErrorWrapper(error);
  }
}

export {
	subgraph,
};