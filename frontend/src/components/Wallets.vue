<template>
  <div>
    <h1>Wallets:</h1>
    <div v-if="!wallets.length">No wallets so far...</div>
    <div v-if="wallets.length" class="wallets">
      <Wallet v-for="wallet in wallets" v-bind:key="wallet" v-bind:wallet="wallet"></Wallet>
    </div>
  </div>
</template>

<script>
import Wallet from "./Wallet.vue";

export default {
  name: "Wallets",
  components: {
    Wallet
  },
  props: {
    wallets: Array
  }
};
</script>

<style scoped>
.wallets {
  display: flex;
  flex-wrap: wrap;
}
</style>
