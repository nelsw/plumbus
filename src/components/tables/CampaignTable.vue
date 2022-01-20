<template>
  <v-card raised rounded elevation="24" class="mb-3" style="width: 100%">
    <v-toolbar rounded dense>
      <TooltipButton icon="mdi-chess-queen" tooltip="Refresh" @click="fetchItems"/>
      <v-toolbar-title>
        <span v-text="`Campaigns`"/>
      </v-toolbar-title>
      <v-spacer/>
      <FilterField ref="filter"/>
      <v-spacer/>
      <v-switch v-model="activeOnly" color="primary" :label="statusSwitchLabel()" hide-details/>
      <v-spacer/>
    </v-toolbar>
    <v-data-table
        dense
        sort-by="roi"
        sort-desc
        :items="computedItems"
        :headers="[
          {text: 'ID',  value: 'id', width: 0, sortable: false},
          {text: 'UTM',  value: 'utm', width: 0, sortable: false},
          {text: 'Name', value: 'name', sortable: false},
          {text: 'Clicks', value: 'clicks'},
          {text: 'Impressions', value: 'impressions'},
          {text: 'CPC', value: 'cpc'},
          {text: 'CTR', value: 'ctr'},
          {text: 'CPM', value: 'cpm'},
          {text: 'CPP', value: 'cpp'},
          {text: 'Daily Budget', value: 'daily_budget'},
          {text: 'Budget Remaining', value: 'budget_remaining'},
          {text: 'Spend', value: 'spend'},
          {text: 'Spend Cap', value: 'spend_cap'},
          {text: 'Revenue', value: 'revenue'},
          {text: 'Profit', value: 'profit'},
          {text: 'ROI', value: 'roi'},
          {text: 'Updated', value: 'updated_time', width: 0, sortable: false},
          {text: 'Created', value: 'created_time', width: 0, sortable: false},
          {text: '', value: '', width: 0, divider: true, sortable: false},
          {text: '', value: 'data-table-expand', width: 0, align: 'center', sortable: false}
        ]"
        no-data-text="No Campaigns found for this Account"
        no-results-text="No Campaigns found for this Account"
    >
      <template v-slot:item.updated_time="{ item }">
        {{ $moment(item.updated_time).format("MM/DD/YY") }}
      </template>
      <template v-slot:item.created_time="{ item }">
        {{ $moment(item.created_time).format("MM/DD/YY") }}
      </template>
      <template v-slot:item.data-table-expand="{isSelected, item}">
        <div class="d-flex flex flex-row align-center">
          <StatusButton :item="item"/>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>

import {mapActions} from "vuex";
import Snack from "@/models/Snack";
import TooltipButton from "@/components/buttons/TooltipButton";
import FilterField from "@/components/fields/FilterField";
import StatusButton from "@/components/buttons/StatusButton";

export default {
  components: {StatusButton, FilterField, TooltipButton},
  namespaced: true,

  props: {
    accountID: String,
  },

  data: () => ({
    activeOnly: true,
    items: [],
  }),

  mounted() {
    this.fetchItems()
  },

  computed: {
    computedItems() {
      if (!this.activeOnly) return this.items
      return this.items.filter(item => item.status === 'ACTIVE')
    },

  },

  methods: {
    ...mapActions('snack', ['add']),

    statusSwitchLabel() {
      if (this.activeOnly) {
        return `Active Only (${this.items.filter(item => item.status === 'ACTIVE').length})`
      }
      return `Any Status (${this.items.length})`
    },

    fetchItems() {
      this.loading = true
      this.items = []
      this.$http
          .get(this.$api('campaign') + `?accountID=${this.accountID}`)
          .then(result => this.items = result.data)
          .then(() => {
            if (this.$refs.filter) {
              this.$refs.filter.$refs.field.focus()
            }
          })
          .catch(error => {
            if (error.response.status !== 404) {
              this.add(Snack.Err(error))
            }
          })
          .finally(() => this.loading = false)
    }

  },
}
</script>