<template>
  <div>
    <img alt="Vue logo" src="./assets/achu-coin.png" />
    <Wallets v-bind:wallets="wallets" />
  </div>
</template>

<script>
import Wallets from "./components/Wallets.vue";
import axios from 'axios'

export default {
  name: "App",
  components: {
    Wallets,
  },
  data() {
    return {
      wallets: [],
    };
  },
  methods: {
    async fetchWallets() {
      await axios
        .get("/api/wallets")
        .then((response) => {
          this.wallets = response.data;
        })
        .catch((error) => {
          console.error(`Could not load wallets... ${error}`);
        });
    },
  },
  mounted() {
    this.fetchWallets();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
