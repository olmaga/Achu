<template>
  <div class="my-wallet">
    <h1>My wallet:</h1>
    <div>
      <div class="balance"><b>Balance:</b> {{ wallet.balance }}</div>
      <div class="public-key"><b>Public Key:</b> {{ wallet.publicKey }}</div>
    </div>

    <h2>Actions</h2>
    
    <h3>Mine!</h3>
    <button v-on:click="mine()">Mine!</button>

    <h3>Setting a Nickname</h3>
    <div name="name-form">
      Name: <input type="text" v-model="name" />
      <button v-on:click="setName()">Save</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MyWallet",
  data() {
    return {
      name: "Oli?",
    };
  },
  components: {},
  props: {
    wallet: Object,
  },
  methods: {
    async mine() {
        console.log('Trying to mine...');

      await axios
        .post("/api/miner/transactions")
        .then((response) => {
          console.log(`Found a valid hash after ${response.data.nonce} tries. Found hash: ${response.data.hash}`);
        })
        .catch((error) => {
          console.error(`Error while mining... ${error}`);
        });
    },
    async setName() {
      console.log(
        `Setting name with ${JSON.stringify({
          action: "name",
          publicKey: this.wallet.publicKey,
          name: this.name,
        })}`
      );
      await axios
        .post("/api/miner/add", {
          data: [
            {
              action: "name",
              publicKey: this.wallet.publicKey,
              name: this.name,
            },
          ],
        })
        .then(() => {
          console.log("Successfully set name");
        })
        .catch((error) => {
          console.error(`Could not change name of wallet... ${error}`);
        });
    },
  },
};
</script>

<style scoped>
.my-wallet {
  background: #eee;
  padding: 30px;
}

.public-key {
  margin-top: 15px;
  word-break: break-all;
}
</style>
