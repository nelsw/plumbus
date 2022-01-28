<template>
  <v-card raised rounded elevation="24" class="my-5" style="width: 100%" :loading="busy">
    <v-toolbar rounded dense>
      <v-icon v-text="`mdi-account-tie`" class="mr-3"/>
      <v-toolbar-title>
        <span v-text="`Campaigns`"/>
      </v-toolbar-title>
      <v-spacer/>
      <FilterField ref="filter" class="d-flex flex-grow-0 flex-shrink-1" :disabled="busy" @change="filter = $event"/>
      <v-divider vertical inset class="ml-5 mr-2"/>
      <v-switch v-model="activeOnly" color="primary" :label="statusSwitchLabel()" hide-details/>
      <ViewColumnMenu :columns="columns"/>
      <TooltipButton icon="mdi-refresh" tooltip="Refresh Campaigns" @click="refreshItems"/>
      <TooltipButton v-if="fullscreen" icon="mdi-fullscreen" tooltip="Fullscreen" @click="$emit('open')"/>
      <TooltipButton v-else left icon="mdi-close" tooltip="Close Fullscreen" @click="$emit('close')"/>
    </v-toolbar>

    <v-data-table
        :loading="busy"
        dense
        sort-desc
        must-sort
        hide-default-footer
        sort-by="roi"
        no-data-text="No Campaigns found for this Account"
        no-results-text="No Campaigns found for this Account"
        :items-per-page="-1"
        :headers="headers"
        :items="computedItems"
    >
      <template v-slot:item.daily_budget="{ item }">
        {{ item.formatted.daily_budget }}
      </template>
      <template v-slot:item.budget_remaining="{ item }">
        {{ item.formatted.budget_remaining }}
      </template>
      <template v-slot:item.clicks="{ item }">
        {{ item.formatted.clicks }}
      </template>
      <template v-slot:item.impressions="{ item }">
        {{ item.formatted.impressions }}
      </template>
      <template v-slot:item.ctr="{ item }">
        {{ item.formatted.ctr }}
      </template>
      <template v-slot:item.cpc="{ item }">
        {{ item.formatted.cpc }}
      </template>
      <template v-slot:item.cpm="{ item }">
        {{ item.formatted.cpm }}
      </template>
      <template v-slot:item.cpp="{ item }">
        {{ item.formatted.cpp }}
      </template>
      <template v-slot:item.spend="{ item }">
        {{ item.formatted.spend }}
      </template>
      <template v-slot:item.revenue="{ item }">
        {{ item.formatted.revenue }}
      </template>
      <template v-slot:item.profit="{ item }">
        {{ item.formatted.profit }}
      </template>
      <template v-slot:item.roi="{ item }">
        <Chip small :float="item.roi" :text="item.formatted.roi"/>
      </template>
      <template v-slot:item.updated_time="{ item }">
        {{ $moment(item.updated_time).format("MM/DD/YY") }}
      </template>
      <template v-slot:item.created_time="{ item }">
        {{ $moment(item.created_time).format("MM/DD/YY") }}
      </template>
      <template v-slot:item.refreshed="{ item }">
        {{ $moment(item.refreshed).utc().format("MM/DD/YY HH:mm:ss z") }}
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
import StatusButton from "@/components/buttons/AdStatusButton";
import Chip from "@/components/chips/Chip";
import ViewColumnMenu from "@/components/menus/ViewColumnMenu";

export default {
  components: {ViewColumnMenu, Chip, StatusButton, FilterField, TooltipButton},
  namespaced: true,

  props: {
    accountID: String,
    fullscreen: Boolean,
  },

  data: () => ({
    filter: null,
    busy: true,
    activeOnly: false,
    items: [],
    columns: [
      {visible: true, text: 'ID', value: 'id', width: 0},
      {visible: true, text: 'Name', value: 'name'},
      {visible: true, text: 'Created', value: 'created_time', width: 100},
      {visible: true, text: 'Updated', value: 'updated_time', width: 100},
      {visible: true, text: 'Refreshed', value: 'refreshed', width: 200},
      {visible: true, text: 'Budget', value: 'daily_budget', width: 100},
      {visible: true, text: 'Remainder', value: 'budget_remaining', width: 125},
      {visible: true, text: 'Clicks', value: 'clicks', width: 100},
      {visible: true, text: 'Imp', value: 'impressions', width: 100},
      {visible: true, text: 'CTR', value: 'ctr', width: 100},
      {visible: true, text: 'CPC', value: 'cpc', width: 100},
      {visible: true, text: 'CPM', value: 'cpm', width: 100},
      {visible: true, text: 'CPP', value: 'cpp', width: 100},
      {visible: true, text: 'Spend', value: 'spend', width: 100},
      {visible: true, text: 'Revenue', value: 'revenue', width: 100},
      {visible: true, text: 'Profit', value: 'profit', width: 100},
      {visible: true, text: 'ROI', value: 'roi', width: 100, align: 'center'},
      {visible: true, text: '', value: '', width: 0, divider: true, sortable: false},
      {visible: true, text: '', value: 'data-table-expand', width: 0, align: 'center', sortable: false}
    ]
  }),

  mounted() {
    this.fetchItems()
  },

  computed: {
    computedItems() {
      if (!this.filter || this.filter === '') return this.items
      return this.items.filter(item =>
          item.name.toLowerCase().includes(this.filter.toLowerCase()) ||
          item.id.includes(this.filter))
    },
    headers() {
      return this.columns.filter(column => column.visible)
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

    refreshItems() {
      this.busy = true
      this.items = []
      this.$http
          .put(this.$api('campaign') + `?accountID=${this.accountID}`)
          .then(result => this.items = result.data)
          .then(() => this.$refs.filter.$refs.field.focus())
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },

    fetchItems() {
      this.busy = true
      this.items = []
      this.$http
          .get(this.$api('campaign') + `?accountID=${this.accountID}`)
          .then(result => this.items = result.data)
          .then(() => this.$refs.filter.$refs.field.focus())
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },
  },
}
</script>
<style>
html body div#app.v-application.v-application--is-ltr.theme--dark div.v-application--wrap main.v-main div.v-main__wrap div.container.container--fluid div.row.no-gutters div.col.col-12 div.mb-3.v-card.v-card--raised.v-sheet.theme--dark.elevation-24.rounded div.v-data-table.v-data-table--dense.v-data-table--has-bottom.theme--dark div.v-data-table__wrapper table tbody tr.v-data-table__expanded.v-data-table__expanded__content td div.d-flex.flex.flex-row.align-start.ma-2 div.mb-3.v-card.v-card--raised.v-sheet.theme--dark.elevation-24.rounded div.v-data-table.v-data-table--dense.v-data-table--has-bottom.theme--dark div.v-data-footer div.v-data-footer__select div.v-input.v-input--hide-details.v-input--is-label-active.v-input--is-dirty.v-input--is-focused.theme--dark.v-text-field.v-text-field--is-booted.v-select.primary--text div.v-input__control div.v-input__slot div.v-select__slot div.v-input__append-inner div.v-input__icon.v-input__icon--append i.v-icon.notranslate.mdi.mdi-menu-down.theme--dark.primary--text {
  display: none;
}
</style>