<template>
  <div class="wrapper">
    <h1 style="margin: 10px 0 20px">区块链测试</h1>
    <el-container style="height: 600px; border: 1px solid #eee">
      <el-aside width="200px" style="padding: 10px; background-color: rgb(238 241 246)">
        <el-steps direction="vertical" :process-status="processStatus" :active="active">
          <el-step title="部署合约" @click="clickFn(1)"></el-step>
          <el-step title="铸币" @click="clickFn(2)"></el-step>
          <el-step title="转账和查询" @click="clickFn(3)"></el-step>
        </el-steps>
      </el-aside>
      <el-container>
        <el-main>
          <!-- 合约部署 -->
          <div
            v-show="active == 0 || active == 1"
            v-loading="loading"
            element-loading-text="合约部署中"
          >
            <el-alert
              v-show="!loading && active == 1"
              title="发送者合约部署成功"
              type="success"
              :closable="false"
            />
            <p style="margin: 20px 0">合约地址: {{ contractAddress }}</p>
            <!-- 不再需要重新部署合约
              <el-button type="primary" @click="deploy('Deposit', 'RMB')"> 重新部署合约 </el-button>
            -->
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
            <p>总供应量: {{ totalSupply }}</p>
          </div>
          <!-- 查询 -->
          <div v-show="active == 3">
            <div style="margin: 20px 0">已连接钱包：{{ walletAddress }}</div>
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
import { Mnemonic, Wallet, HDNodeWallet } from 'ethers'
import ContractInvoker from '@/utils/ContractInvoker'
// Only Node requries Buffer module
import { Buffer } from 'buffer'
globalThis.Buffer = Buffer

//常量
const url = 'http://192.168.20.124:8545'

//变量
let loading = ref(false)
let active = ref(undefined)
let processStatus = ref('process')
//发送者
let senderInvoker
let contractAddress = ref('')
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
let totalSupply = ref(0)
//接收者
let receiverInvoker
let receiverBalance = ref(0)
let walletAddress = ref(undefined)

//方法
onMounted(async () => {
  try {
    loading.value = true
    await connectSenderContract()
    loading.value = false
  } catch (e) {
    loading.value = false
    console.log('合约链接初始化错误：', e)
  }
})
let clickFn = (index) => {
  active.value = index
}
let connectSenderContract = async () => {
  //发送者-初始化
  const mnemonic = Mnemonic.fromPhrase(
    'adapt mosquito move limb mobile illegal tree voyage juice mosquito burger raise father hope layer'
  )
  let senderSigner = await HDNodeWallet.fromMnemonic(mnemonic)
  senderInvoker = new ContractInvoker(url, EncryptedERC20, senderSigner)
  //接收者-初始化
  let receiverSigner
  const isKey = sessionStorage.getItem('keysInfo')
  if (isKey) {
    const keysInfo = JSON.parse(isKey)
    receiverSigner = new Wallet(keysInfo.sk)
  } else {
    const privateKey = 'dff417ab5c4f72ec787cfdb7fe16311591769af1c928e01f01b070cc68a227e5'
    receiverSigner = new Wallet(privateKey)
  }
  walletAddress.value = receiverSigner.address
  transferForm.address = walletAddress.value
  receiverInvoker = new ContractInvoker(url, EncryptedERC20, receiverSigner)
  //判断是否需要部署合约
  let contractAPI = localStorage.getItem('contractTarget')
  if (contractAPI) {
    senderInvoker.connect(contractAPI)
    receiverInvoker.connect(contractAPI)
    contractAddress.value = contractAPI
    active.value = 1
  } else {
    active.value = 0
    //部署合约
    await deploy('Deposit', 'RMB')
  }
}
let deploy = async (...args) => {
  try {
    loading.value = true
    await senderInvoker.deploy(...args)
    contractAddress.value = senderInvoker.target
    receiverInvoker.connect(contractAddress.value)
    active.value = 1
    // 保存到localStorage
    localStorage.setItem('contractTarget', contractAddress.value)
    loading.value = false
  } catch (error) {
    active.value = 0
    processStatus.value = 'error'
    loading.value = false
    console.log('deployError:' + error)
  }
}
let mint = async (amount) => {
  minting.value = true
  const tx = await senderInvoker.mint(amount)
  await tx.wait()
  totalSupply.value = await senderInvoker.totalSupply()
  minting.value = false
  active.value = 3
}
let deposit = async (amount, address) => {
  transferring.value = true
  amount = typeof amount === 'string' ? Number(amount) : amount
  const eAmount = await senderInvoker.encrypt64(amount)
  /**
   *  转账
   *  abi中存在transfer(address,bytes)方法和transfer(address,uint256)方法
   *  js中没有重载，所以需要使用['transfer(address,bytes)']来调用
   */
  const tx = await senderInvoker['transfer(address,bytes)'](address, eAmount)
  await tx.wait()
  transferring.value = false
  //获取发送者最新余额
  getSenderBalance()
  //查看接收者余额
  getReceiverBalance()
}
//查询接收者余额
let getSenderBalance = async () => {
  const eBalance = await senderInvoker.balanceOf(
    senderInvoker.signer,
    senderInvoker.token.publicKey,
    senderInvoker.token.signature
  )
  senderBalance.value = senderInvoker.decrypt(eBalance)
}
//查询接收者余额
let getReceiverBalance = async () => {
  const eBalance = await receiverInvoker.balanceOf(
    receiverInvoker.signer,
    receiverInvoker.token.publicKey,
    receiverInvoker.token.signature
  )
  receiverBalance.value = receiverInvoker.decrypt(eBalance)
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
