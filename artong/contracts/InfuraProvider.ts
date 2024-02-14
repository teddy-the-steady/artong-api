import { ethers } from 'ethers'
import { getInfuraKey } from '../utils/common/ssmKeys';
import { InternalServerError } from '../utils/error/errors';
import { RequiredConditionInsufficient } from '../utils/error/errorCodes';

export default class InfuraProvider {
  provider: any

  constructor(infuraKey: string | undefined) {
    if (!infuraKey) {
      throw new InternalServerError(
        'Infura key not provided',
        RequiredConditionInsufficient
      )
    }

    this.provider = new ethers.providers.InfuraProvider(
      process.env.ENV === 'prod'? 'homestead' : 'goerli',
      infuraKey
    )
  }
}
