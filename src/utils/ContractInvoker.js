import { JsonRpcProvider, Contract, ContractFactory } from 'ethers'
import FhevmInstance from './fhevmclassjs.js'

class ContractInvoker {
  /**
   *
   * @param {*} url - 以太坊节点地址
   * @param {*} contract - 合约abi和bytecode
   * @param {*} wallet - 钱包地址
   * @returns
   */
  constructor(url, contract, wallet) {
    this.provider = new JsonRpcProvider(url)
    this.contract = contract
    this.wallet = wallet
    this.signerAddress = wallet.address
    // 代理实例, 用于实现属性代理, 使得可以直接访问合约实例的属性
    return new Proxy(this, {
      get(target, prop) {
        if (!target.instance) {
          return target[prop]
        }
        return prop in target ? target[prop] : target.instance[prop]
      }
    })
  }

  /**
   * 连接到已部署的合约
   * @param {*} contractAddress
   */
  async connect(contractAddress) {
    this.contractAddress = contractAddress
    this.signer = await this.wallet.connect(this.provider)
    this.instance = new Contract(contractAddress, this.contract.abi, this.signer)
    await this.fhevmInit(contractAddress)
  }
  /**
   * 部署合约
   * @param  {...any} args
   */
  async deploy(...args) {
    if (this.instance) {
      throw new Error('instance is already deployed')
    }
    this.signer = await this.wallet.connect(this.provider)
    const factory = new ContractFactory(this.contract.abi, this.contract.bytecode, this.signer)
    let deploy = await factory.deploy(...args)
    this.instance = await deploy.waitForDeployment()
    this.contractAddress = this.instance.target
    await this.fhevmInit(this.instance.target)
  }
  /**
   * fhevmInit
   * @param {*} contractAddress
   */
  async fhevmInit(contractAddress) {
    this.fhevmInstance = new FhevmInstance(this.provider, contractAddress, this.signer)
    await this.fhevmInstance.init()
    this.token = this.fhevmInstance.getPublicKey(this.instance.target)
  }

  /**
   * 加密金额
   * @param {*} amount
   * @returns
   */
  encrypt32(amount) {
    return this.fhevmInstance.instance.encrypt32(amount)
  }
  encrypt64(amount) {
    return this.fhevmInstance.instance.encrypt64(amount)
  }

  /**
   * 解密重加密后的金额密文
   * @param {*} eAmount
   * @returns
   */
  decrypt(eAmount) {
    console.log('this.contractAddress', this.fhevmInstance, this.fhevmInstance.instance)
    return this.fhevmInstance.instance.decrypt(this.contractAddress, eAmount)
  }
}
export default ContractInvoker
