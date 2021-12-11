<template>
    <div>
      <div>
        <v-img :src="$auth.user.picture"/>
        <h2>{{ $auth.user.name }}</h2>
        <p>{{ $auth.user.email }}</p>
      </div>

      <div>
        <pre>{{ JSON.stringify($auth.user, null, 2) }}</pre>
      </div>
      <v-btn
          text
          v-text="`Get API Creds`"
          @click="fetchItem"
      />
    </div>
</template>

<script>
import {mapActions} from "vuex";
import Snack from "@/models/Snack";

export default {
  namespaced: true,
  mounted() {
    this.wat()
  },
  methods: {
    ...mapActions('snack', ['add']),
    async wat() {
      const token = await this.$auth.getTokenSilently();
      console.log(token)
    },
    async fetchItem() {
      const token = await this.$auth.getTokenSilently();
      let config = {
        headers: {
          'authorization': `Bearer ${token}`
        }
      }
      console.log(token)
      let url = `https://k02jqq2pn8.execute-api.us-east-1.amazonaws.com/dev/crud?model=coinbase&ids=key`
      this.$http
          .get(url, config)
          .then(result => this.$debug(result))
          .catch(error => {
            this.$debug(error)
            this.add(Snack.Err(error))
          })

    },
  },
}
</script>