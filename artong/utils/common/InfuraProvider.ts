import { ethers } from 'ethers'

class InfuraProvider {
  provider: any

  constructor() {
    this.provider = new ethers.providers.InfuraProvider(
      'homestead',
      'c60789555fff407eabc1c2bfa1330684'
    )
  }
}

export default new InfuraProvider()