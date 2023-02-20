import { ethers } from 'ethers'

class InfuraProvider {
  provider: any

  constructor() {
    this.provider = new ethers.providers.InfuraProvider(
      process.env.ENV === 'prod'? 'homestead' : 'goerli',
      process.env.ENV === 'prod'? 'ae3e3f39ab144c7b9a0ef19d3ff80aa9' : 'c60789555fff407eabc1c2bfa1330684',
    )
  }
}

export default new InfuraProvider()