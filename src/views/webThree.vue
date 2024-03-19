<template>
  <button v-if="!connected" @click="connectHandler">连接钱包</button>
  <button v-else @click="callConnect">调用合约</button>
  <div>{{ contractResult }}</div>
</template>

<script setup>
import { ref } from 'vue'
import Web3 from 'web3'

let connected = ref(false)
let contractResult = ref('')
function connectHandler() {
  if (window.ethereum) {
    window.ethereum.request({ method: 'eth_requestAccounts' }).then(() => {
      connected.value = true
    })
  } else {
    console.log('window.ethereum 不存在')
  }
}

function callConnect() {
  let web3 = new Web3(window.ethereum)
  let contractAddress = '0xC0B2D76aB95B7E31E241ce713ea1C72d0a50588e'
  let abi = JSON.parse(
    `[{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"inputs": [],"name": "greet","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"}]`
  )
  let contract = new web3.eth.Contract(abi, contractAddress)
  contract.methods
    .greet()
    .call()
    .then((result) => (contractResult.value = result))
}
</script>

<style></style>
