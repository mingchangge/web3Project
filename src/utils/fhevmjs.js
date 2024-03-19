import { AbiCoder } from 'ethers'
import { initFhevm, createInstance, getPublicKeyCallParams } from 'fhevmjs'

export const init = async () => {
  await initFhevm()
}

export const createFhevmInstance = async provider => {
  const network = await provider.getNetwork()
  const chainId = +network.chainId.toString()
  const ret = await provider.call(getPublicKeyCallParams())
  const decoded = AbiCoder.defaultAbiCoder().decode(['bytes'], ret)
  const publicKey = decoded[0]
  return await createInstance({ chainId, publicKey })
}

export const generatePublicKey = async (instance, contractAddress, signer) => {
  if (!instance.hasKeypair(contractAddress)) {
    const { eip712 } = instance.generatePublicKey({
      verifyingContract: contractAddress
    })
    const signature = await signer.signTypedData(
      eip712.domain,
      { Reencrypt: eip712.types.Reencrypt }, // Need to remove EIP712Domain from types
      eip712.message
    )
    instance.setSignature(contractAddress, signature)
  }
}
