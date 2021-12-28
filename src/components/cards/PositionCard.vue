<template>
  <v-card raised rounded elevation="24">
    <v-toolbar dense>
      <TooltipButton icon="mdi-chess-queen" tooltip="Refresh (sparingly)" @click="fetchItems"/>
      <v-toolbar-title>
        <span v-text="`Active Campaigns`"/>
        <span class="subtitle-2 font-weight-light ml-5 hidden-sm-and-down" v-text="`Automatically paused if profit < -$100.`"/>
      </v-toolbar-title>
      <v-spacer/>
      <span class="subtitle-2 font-weight-light" v-text="`Revenue ${this.rev} - Spend: ${this.spe} = Profit ${this.pro}`"/>
    </v-toolbar>
    <v-data-table
        sort-by="profit"
        sort-desc
        dense
      :items="items"
      :loading="loading"
      :headers="[
          {text: 'Ad Account', value: 'account', sortable: false},
          {text: 'FB',  value: 'facebook', width: 150, sortable: false},
          {text: 'Sovrn', value: 'sovrn', sortable: false},
          {text: 'Spend', value: 'spend', width: 150, sortable: false},
          {text: 'Revenue', value: 'revenue', sortable: false},
          {text: 'Profit', value: 'profit', sortable: false},
          {text: 'Status', value: 'status', sortable: false},
        ]"
      :footer-props="{
          'items-per-page-options': [25, 50, 100, -1],
          'items-per-page-text': 'Rows',
        }"
    >
      <template v-slot:item.spend="{ item }">
        {{ $formatPrice(item.spend) }}
      </template>
      <template v-slot:item.revenue="{ item }">
        {{ $formatPrice(item.revenue) }}
      </template>
      <template v-slot:item.profit="{ item }">
        {{ $formatPrice(item.profit) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import {mapActions} from "vuex";
import Snack from "@/models/Snack";
import TooltipButton from "@/components/buttons/TooltipButton";
export default {
  components: {TooltipButton},
  namespaced: true,

  data: () => ({
    loading: true,
    items: [],
    rev: 0,
    spe: 0,
    pro: 0,
  }),

  mounted() {
    this.fetchItems()
  },

  watch: {
    items() {
      if (this.items.length > 0) {
        this.rev = this.items.map(item => item.revenue).reduce((a, b) => a + b, 0)
        this.spe = this.items.filter(item => item.status !== '⁉️ - Missing').map(item => item.spend).reduce((a, b) => a + b, 0)
        this.pro = this.$formatPrice(this.rev - this.spe)
        this.rev = this.$formatPrice(this.rev)
        this.spe = this.$formatPrice(this.spe)
      }
    },
  },

  methods: {
    ...mapActions('snack', ['add']),
    fetchItems() {
      this.loading = true
      this.$http
          .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/mgr`)
          .then(result => {
            if (result.data.length === 0) {
              this.add(Snack.Warn("FB receiving too many requests ... try again in a minute or two"))
            } else {
              this.items = result.data
            }
          })
          .catch(error => {
            if (error.message === 'result.data is null') {
              this.add(Snack.Warn("FB receiving too many requests ... try again in a minute or two"))
            } else {
              this.add(Snack.Err(error))
            }
          })
          .finally(() => this.loading = false)
    },

  },

}
</script>
