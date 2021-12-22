<template>
  <v-card raised rounded elevation="24">
    <v-toolbar dense>
      <v-icon v-text="`mdi-facebook`" class="mr-5"/>
      <v-toolbar-title>
        <span v-text="`Marketing API`"/>
        <span class="subtitle-2 font-weight-light ml-5 hidden-sm-and-down" v-text="`Ad Accounts | Campaigns |make  it Ads`"/>
      </v-toolbar-title>
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
          {text: 'ID',  value: 'id', align: 'start', width: 150, sortable: false},
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
      <template v-slot:top>
        <div class="d-flex flex flex-row align-end ml-3">
          <v-icon v-text="`mdi-alpha`" class="mb-1"/>
          <div class="mr-2" style="max-width: 65px">
            <DatePicker alpha/>
          </div>
          <div style="max-width: 40px">
            <TimePicker/>
          </div>
          <v-icon v-text="`mdi-omega`" class="mb-1 ml-3"/>
          <div class="mr-2" style="max-width: 65px">
            <DatePicker/>
          </div>
          <div style="max-width: 40px">
            <TimePicker/>
          </div>
          <SimpleButton text="search" class="ml-5" small @click="fetchItems()"/>
          <v-spacer/>
          <FilterField ref="filter"/>
          <v-spacer/>
        </div>
      </template>
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
          <CampaignTable :items="item.campaigns.data"/>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import FilterField from "@/components/fields/FilterField";
import ExpandButton from "@/components/buttons/ExpandButton";
import DatePicker from "@/components/pickers/DatePicker";
import TimePicker from "@/components/pickers/TimePicker";
import SimpleButton from "@/components/buttons/SimpleButton";
import CampaignTable from "@/components/tables/CampaignTable";

export default {
  components: {CampaignTable, SimpleButton, TimePicker, DatePicker, ExpandButton, FilterField},
  namespaced: true,

  data: () => ({
    loading: true,
    items: [],
  }),

  mounted() {
    this.fetchItems()
  },

  methods: {

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
      this.items = []
      this.$http
          .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/fb?domain=acts`)
          .then(result => this.items = result.data)
          .finally(() => {
            this.loading = false
            this.$refs.filter.$refs.field.focus()
          })
    },

  },

}
</script>