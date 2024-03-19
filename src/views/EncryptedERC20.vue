<template>
  <div class="wrapper">
    <h1 style="margin: 10px 0 20px">区块链测试</h1>
    <el-container style="height: 600px; border: 1px solid #eee">
      <el-aside width="200px" style="padding: 10px; background-color: rgb(238 241 246)">
        <el-steps direction="vertical" :active="active">
          <el-step title="部署合约" @click="clickFn(1)"></el-step>
          <el-step title="铸币" @click="clickFn(2)"></el-step>
          <el-step title="转账和查询" @click="clickFn(3)"></el-step>
        </el-steps>
      </el-aside>
      <el-container>
        <el-main>
          <!-- 合约部署 -->
          <div v-show="active == 1" v-loading="loading" element-loading-text="合约部署中">
            <el-alert
              v-show="!loading"
              title="发送者合约部署成功"
              type="success"
              :closable="false"
            />
          </div>
          <!-- 铸币 -->
          <div v-show="active == 2">
            <el-form inline label-width="80px" :model="mintForm">
              <el-form-item label="转账金额">
                <el-input v-model="mintForm.amount" placeholder="请输入转账金额"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button :loading="minting" type="primary" @click="mint(mintForm.amount)">
                  铸币
                </el-button>
              </el-form-item>
            </el-form>
            <p>发送者现存余额: {{ senderBalance }}</p>
          </div>
          <!-- 查询 -->
          <div v-show="active == 3">
            <el-row>
              <el-col :span="24">
                <el-form inline label-width="80px" :model="transferForm">
                  <el-form-item label="转账">
                    <el-input v-model="transferForm.amount" placeholder="请输入转账金额"></el-input>
                  </el-form-item>
                  <el-form-item label="地址">
                    <el-input v-model="transferForm.address" placeholder="请输入地址"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      :loading="transferring"
                      type="primary"
                      @click="deposit(transferForm.amount, transferForm.address)"
                    >
                      转账
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="24"> 发送者现存余额:{{ senderBalance }} </el-col>
              <el-col :span="24"> 接收者余额:{{ receiverBalance }} </el-col>
            </el-row>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import EncryptedERC20 from '../../contracts/EncryptedERC20.json'
import { JsonRpcProvider, Mnemonic, HDNodeWallet, ContractFactory, Contract } from 'ethers'
import { init, createFhevmInstance, generatePublicKey } from '@/utils/fhevmjs'
// Only Node requries Buffer module
import { Buffer } from 'buffer'
globalThis.Buffer = Buffer
///////////////////////////////
//常量
const url = 'http://192.168.20.124:8545'
const provider = new JsonRpcProvider(url)

let loading = ref(false)
let active = ref(undefined)
//发送者
let senderSigner
let senderInstance
let contract
let minting = ref(false)
let mintForm = reactive({
  amount: 1000
})
let senderBalance = ref(0)
let transferForm = reactive({
  amount: 50,
  address: '0x864eAADAffc661fa46c2F11f9d937E9b8FEA25D0'
})
let transferring = ref(false)
//接收者
let receiverSigner
let receiverInstance
let receiverBalance = ref(0)
let contract2
//方法
onMounted(() => {
  try {
    loading.value = true
    connectSenderContract()
    loading.value = false
  } catch (e) {
    loading.value = false
    console.log(e)
  }
})
let clickFn = (index) => {
  active.value = index
}
let connectSenderContract = async () => {
  //发送者
  const mnemonic = Mnemonic.fromPhrase(
    'adapt mosquito move limb mobile illegal tree voyage juice mosquito burger raise father hope layer'
  )
  senderSigner = await HDNodeWallet.fromMnemonic(mnemonic).connect(provider)
  await init()
  senderInstance = await createFhevmInstance(provider)
  //判断是否部署合约
  let contractAPI = localStorage.getItem('contract')
  if (contractAPI !== null) {
    let contractObj = JSON.parse(contractAPI)
    contract = new Contract(contractObj.target, EncryptedERC20.abi, senderSigner)
    active.value = 2
  } else {
    active.value = 0
    //部署合约
    await deployContract('Deposit', 'RMB')
    active.value = 2
  }
  //生成公钥
  await generatePublicKey(senderInstance, contract.target.toString(), senderSigner)
}
let deployContract = async (...args) => {
  const contractFactory = new ContractFactory(
    EncryptedERC20.abi,
    EncryptedERC20.bytecode,
    senderSigner
  )
  contract = await contractFactory.deploy(...args)
  await contract.waitForDeployment()
  // 保存到localStorage
  localStorage.setItem('contract', JSON.stringify(contract))
}
let mint = async (amount) => {
  minting.value = true
  const tx = await contract.mint(amount)
  await tx.wait()
  senderBalance.value = await contract.totalSupply()
  minting.value = false
  active.value = 3
}
let deposit = async (amount, address) => {
  transferring.value = true
  amount = typeof amount === 'string' ? Number(amount) : amount
  const eAmount = await senderInstance.encrypt64(amount)
  const tx = await contract['transfer(address,bytes)'](address, eAmount)
  await tx.wait()
  transferring.value = false
  //获取发送者最新余额
  const token = senderInstance.getPublicKey(contract.target.toString())
  const balance = await contract.balanceOf(senderSigner, token?.publicKey, token?.signature)
  senderBalance.value = senderInstance.decrypt(contract.target.toString(), balance)
  //查看接收者余额
  getReceiverBalance()
}
let getReceiverBalance = async () => {
  //接收者
  const mnemonic = Mnemonic.fromPhrase(
    'guilt suit debris huge because glass skate clay review enforce hungry rescue'
  )
  receiverSigner = await HDNodeWallet.fromMnemonic(mnemonic).connect(provider)
  await init()
  receiverInstance = await createFhevmInstance(provider)
  contract2 = new Contract(contract.target, EncryptedERC20.abi, receiverSigner)
  //生成公钥
  await generatePublicKey(receiverInstance, contract.target.toString(), receiverSigner)
  const token = receiverInstance.getPublicKey(contract2.target.toString())
  const balance = await contract2.balanceOf(receiverSigner, token?.publicKey, token?.signature)
  receiverBalance.value = receiverInstance.decrypt(contract2.target.toString(), balance)
}
</script>

<style scoped>
.wrapper {
  min-height: 400px;
  padding: 20px;
}
.el-col {
  margin: 10px 0;
}
</style>
