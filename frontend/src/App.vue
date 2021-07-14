<template>
  <div>
    <img alt="Vue logo" src="./assets/achu-coin.png" />
    <div class="dashboard">
      <div class="overview">
        <Wallets v-bind:wallets="wallets" />
      </div>
      <div class="actions"></div>
      <div class="stats">
        <Statistics v-bind:statistics="statistics" />
      </div>
    </div>
  </div>
</template>

<script>
import Wallets from "./components/Wallets.vue";
import Statistics from "./components/Statistics.vue";
import axios from "axios";

export default {
  name: "App",
  components: {
    Wallets, Statistics
  },
  data() {
    return {
      wallets: [],
      statistics: {}
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
    async fetchStatistics() {
      await axios
        .get("/api/stats")
        .then((response) => {
          this.statistics = response.data;
        })
        .catch((error) => {
          console.error(`Could not load stats... ${error}`);
        });
    },
  },
  mounted() {
    this.fetchWallets();
    this.fetchStatistics();
  },
};
</script>

<style>
#app {
  font-family: "Courier New", Courier, monospace;
  text-align: center;
  color: #333;
  margin-top: 30px;
  margin: auto;
}

.dashboard {
  display: flex;
  width: 90%;
  margin: auto;
}
.overview {
  flex: 1;
}
.stats {
  flex: 1;
}
.actions {
  flex: 3;
}
</style>
