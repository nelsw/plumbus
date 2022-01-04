<template>
  <v-data-table
      dense
      multi-sort
      :items="items"
      :loading="loading"
      :headers="[
          {text: 'ID',  value: 'campaign_id', width: 150},
          {text: 'UTM',  value: 'campaign_utm', width: 150},
          {text: 'Name', value: 'campaign_name'},
          {text: 'Spend', value: 'spend'},
          {text: 'Revenue', value: 'revenue'},
          {text: 'Profit', value: 'profit'},
          {text: 'Created', value: 'created', sortable: false},
          {text: 'Updated', value: 'updated', sortable: false},
          {text: '', value: '', divider: true, groupable: false, width: 0},
          {text: '', value: 'data-table-expand', groupable: false, width: 0},
        ]"
      hide-default-footer
      :items-per-page="-1"
  >
    <template v-slot:item.spend="{ item }">
      {{ item.spend_f }}
    </template>
    <template v-slot:item.revenue="{ item }">
      {{ item.revenue_f }}
    </template>
    <template v-slot:item.profit="{ item }">
      {{ item.profit_f }}
    </template>
  </v-data-table>
</template>

<script>

import {mapActions} from "vuex";
import Snack from "@/models/Snack";

export default {
  namespaced: true,

  props: {
    accountID: String,
  },

  data: () => ({
    loading: true,
    items: [],
  }),

  mounted() {
    this.fetchItems()
  },

  methods: {
    ...mapActions('snack', ['add']),

    status(s) {
      s = s.toLowerCase()
      let a = s.charAt(0).toUpperCase()
      let z = s.slice(1)
      return a + z
    },

    fetchItems() {
      this.loading = true
      this.$http
      .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/web?domain=camps&id=${this.accountID}`)
      .then(result => {
        this.$debug(result)
        this.items = result.data.campaigns
      })
      .catch(error => this.add(Snack.Err(error)))
      .finally(() => this.loading = false)
    }

  },
}
</script>