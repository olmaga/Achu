<template>
  <div>
    <h1>Statistics:</h1>
    <div v-if="Object.keys(statistics).length === 0">No stats so far...</div>
    <div v-if="Object.keys(statistics).length > 0">
        <b>Blocks:</b> {{statistics.blocks}}<br/>
        <b>Open transactions:</b> {{statistics.transactions}}<br/>
        <b>Total crypto:</b> {{statistics.totalCrypto}}<br/>
    </div>
  </div>
</template>

<script>

export default {
  name: "Statistics",
  components: {
  },
  props: {
    statistics: Object
  }
};
</script>

<style scoped>
</style>
