<template>
  <div>
    PublicKey: {{ wallet.substring(0,10) }}...
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
</style>
