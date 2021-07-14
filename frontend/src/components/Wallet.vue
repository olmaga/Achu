<template>
  <div class="wallet">
    <div class="wallet-name"><b>Name: </b>{{ wallet.name || "unnamed" }}</div>
    <div class="wallet-public-key">
      <b>PublicKey: </b>{{ wallet.publicKey.substring(0, 10) }}...
    </div>
    <div class="wallet-balance">
      <b>Balance: </b>{{ wallet.balance }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Wallet",
  props: {
    wallet: String,
  },
};
</script>

<style scoped>
.wallet {
  display: inline-flex;
  flex-flow: row wrap;
  text-align: left;
  width: 100%;
  margin-bottom: 15px;
}
.wallet-name {
  flex: 0 0 100%;
  margin-bottom: 3px;
}
.wallet-public-key {
  flex: 2;
  flex-shrink: 50%;
}
.wallet-balance {
  flex: 1;
}
</style>
