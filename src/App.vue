<script setup></script>

<template>
  <header>
    <div class="wrapperBox">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="25" height="25" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/web3">web3</RouterLink>
        <RouterLink to="/excelTable">excelTable</RouterLink>
        <RouterLink to="/EncryptedERC20">EncryptedERC20合约</RouterLink>
        <RouterLink to="/EncryptedERC20-simple">EncryptedERC20合约-优化版</RouterLink>
      </nav>
    </div>
  </header>
  <div style="width: 100%">
    <RouterView />
  </div>
</template>

<style scoped>
.wrapperBox {
  display: flex;
  align-items: center;
  margin: 2rem 0;
}
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 16px;
  text-align: left;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
