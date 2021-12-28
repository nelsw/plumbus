<template>
  <v-card raised rounded elevation="24">
    <v-toolbar dense>
      <TooltipButton icon="mdi-chess-king" tooltip="Refresh" @click="fetchItems"/>
      <v-toolbar-title>
        <span v-text="`All Accounts`"/>
        <span class="subtitle-2 font-weight-light ml-5 hidden-sm-and-down"
              v-text="`Ad Accounts & Campaigns of any status.`"/>
      </v-toolbar-title>
      <v-spacer/>
      <FilterField ref="filter"/>
    </v-toolbar>
    <v-data-table
        dense
        multi-sort
        show-expand
        sort-desc
        sort-by="amount_spent"
        :items="items"
        :loading="loading"
        :search="$refs.filter ? $refs.filter.$data.model : ''"
        :headers="[
          {text: 'ID',  value: 'account_id', align: 'start', width: 150, sortable: false},
          {text: 'Name', value: 'name', sortable: false},
          {text: 'Status', value: 'account_status', width: 150, sortable: false},
          {text: 'Spent', value: 'amount_spent', sortable: false},
          {text: 'Created', value: 'age', sortable: false},
          {text: '', value: '', divider: true, sortable: false},
          {text: '', value: 'data-table-expand', sortable: false},
        ]"
        :footer-props="{
          'items-per-page-options': [25, 50, 100, -1],
          'items-per-page-text': 'Rows',
        }"
    >
      <template v-slot:item.amount_spent="{ item }">
        {{ $formatFbPrice(item.amount_spent) }}
      </template>
      <template v-slot:item.age="{ item }">
        {{ $moment().subtract(item.age, 'days').format("MM/DD/YY") }}
      </template>
      <template v-slot:item.account_status="{item}">
        {{ convertAccountStatus(item.account_status) }}
      </template>
      <template v-slot:item.data-table-expand="{isSelected, item, expand, isExpanded}">
        <ExpandButton domain="Campaigns" :expand="expand" :is-expanded="isExpanded"/>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <CampaignTable :items="item.campaigns"/>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import FilterField from "@/components/fields/FilterField";
import ExpandButton from "@/components/buttons/ExpandButton";
import CampaignTable from "@/components/tables/CampaignTable";
import TooltipButton from "@/components/buttons/TooltipButton";
import Snack from "@/models/Snack";
import {mapActions} from "vuex";

export default {
  components: {TooltipButton, CampaignTable, ExpandButton, FilterField},
  namespaced: true,

  data: () => ({
    loading: true,
    items: [],
  }),

  mounted() {
    this.fetchItems()
  },

  methods: {
    ...mapActions('snack', ['add']),
    convertAccountStatus(status) {
      switch (status) {
        case 1:
          return 'Active'
        case 2:
          return 'Disabled'
        case 3:
          return 'Unsettled'
        case 7:
          return 'Pending Risk Review'
        case 8:
          return 'Pending Settlement'
        case 9:
          return 'In Grace Period'
        case 100:
          return 'Pending Closure'
        case 101:
          return 'Closed'
        case 201:
          return 'Any Active'
        case 202:
          return 'Any Closed'
        default:
          return 'Unknown'
      }
    },

    fetchItems() {
      this.loading = true
      this.$http
          .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/fb?domain=acts`)
          .then(result => {
            if (result.data.length === 0) {
              this.add(Snack.Warn("FB receiving too many requests ... try again in a minute or two"))
            } else {
              this.items = result.data
            }
          })
          .catch(error => {
            if (error.message === 'result.data is null' || error.message === 'e.data is null') {
              this.add(Snack.Warn("FB receiving too many requests ... try again in a minute or two"))
            } else {
              this.add(Snack.Err(error))
            }
          })
          .finally(() => {
            this.loading = false
            this.$refs.filter.$refs.field.focus()
          })
    },

  },

}
</script>