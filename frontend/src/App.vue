<template>
  <div>
    <img alt="Vue logo" src="./assets/achu-coin.png" />
    <div class="dashboard">
      <div class="overview">
        <Wallets v-bind:wallets="wallets" />
      </div>
      <div class="actions">
        <MyWallet v-bind:wallet="wallet" v-if="!this.viewerNode"/>
        <div v-if="this.viewerNode">Sorry - this is a viewer peer only. <br/><br/>
        Go clone your own peer on <a href='https://github.com/olmaga/Achu'>https://github.com/olmaga/Achu</a></div>
      </div>
      <div class="stats">
        <Statistics v-bind:statistics="statistics" />
      </div>
    </div>
  </div>
</template>

<script>
import Wallets from "./components/Wallets.vue";
import Statistics from "./components/Statistics.vue";
import MyWallet from "./components/MyWallet.vue";
import axios from "axios";

export default {
  name: "App",
  components: {
    Wallets, 
    Statistics,
    MyWallet
  },
  data() {
    return {
      wallets: [],
      wallet: {},
      statistics: {},
      viewerNode: true
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
    async fetchMyWallet() {
      await axios
        .get("/api/wallets/my/balance")
        .then((response) => {
          this.wallet = response.data;
        })
        .catch((error) => {
          console.error(`Could not load my wallet... ${error}`);
        });
    },
  },
  mounted() {
    this.fetchWallets();
    this.fetchStatistics();
    this.fetchMyWallet();

    this.viewerNode = !!process.env.VUE_APP_VIEWER_NODE
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
  flex: 2;
}
</style>
