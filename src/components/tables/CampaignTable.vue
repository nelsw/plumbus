<template>
  <v-card raised rounded elevation="24" class="mb-3" style="width: 100%" :loading="busy">
    <v-toolbar rounded dense>
      <TooltipButton icon="mdi-account-tie" tooltip="Refresh" @click="fetchItems"/>
      <v-toolbar-title>
        <span v-text="`Campaigns`"/>
      </v-toolbar-title>
      <v-spacer/>
      <FilterField ref="filter"/>
      <v-spacer/>
      <v-switch v-model="activeOnly" color="primary" :label="statusSwitchLabel()" hide-details/>
      <v-spacer/>
      <TooltipButton
          v-if="fullscreen"
          icon="mdi-fullscreen"
          tooltip="Fullscreen"
          @click="$emit('open')"
      />
      <TooltipButton
          v-else
          left
          icon="mdi-close"
          tooltip="Close Fullscreen"
          @click="$emit('close')"
      />
    </v-toolbar>

    <v-data-table
        :loading="busy"
        dense
        sort-by="roi"
        sort-desc
        must-sort
        hide-default-footer
        :items-per-page="-1"
        :items="computedItems"
        :headers="[
          {text: 'Name', value: 'name', sortable: false, width: 700},
          {text: '', value: '', sortable: false},
          {text: 'Budget', value: 'daily_budget', width: 100},
          {text: 'Remainder', value: 'budget_remaining', width: 125},
          {text: '', value: '', sortable: false},
          {text: 'Clicks', value: 'clicks', width: 100},
          {text: 'Imp', value: 'impressions', width: 100},
          {text: '', value: '', sortable: false},
          {text: 'CTR', value: 'ctr', width: 100},
          {text: 'CPC', value: 'cpc', width: 100},
          {text: 'CPM', value: 'cpm', width: 100},
          {text: 'CPP', value: 'cpp', width: 100},
          {text: '', value: '', sortable: false},
          {text: 'Spend', value: 'spend', width: 100},
          {text: 'Revenue', value: 'revenue', width: 100},
          {text: 'Profit', value: 'profit', width: 100},
          {text: '', value: '', sortable: false},
          {text: 'ROI', value: 'roi', width: 100, align: 'center'},
          {text: '', value: '', width: 0, divider: true, sortable: false},
          {text: '', value: 'data-table-expand', width: 0, align: 'center', sortable: false}
        ]"
        no-data-text="No Campaigns found for this Account"
        no-results-text="No Campaigns found for this Account"
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

export default {
  components: { Chip, StatusButton, FilterField, TooltipButton},
  namespaced: true,

  props: {
    accountID: String,
    fullscreen: Boolean,
  },

  data: () => ({
    busy: true,
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
      this.busy = true
      this.items = []
      this.$http
          .get(this.$api('campaign') + `?accountID=${this.accountID}`)
          .then(result => this.items = result.data)
          .then(() => this.$debug(this.items))
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
          .finally(() => this.busy = false)
    }

  },
}
</script>
<style>
html body div#app.v-application.v-application--is-ltr.theme--dark div.v-application--wrap main.v-main div.v-main__wrap div.container.container--fluid div.row.no-gutters div.col.col-12 div.mb-3.v-card.v-card--raised.v-sheet.theme--dark.elevation-24.rounded div.v-data-table.v-data-table--dense.v-data-table--has-bottom.theme--dark div.v-data-table__wrapper table tbody tr.v-data-table__expanded.v-data-table__expanded__content td div.d-flex.flex.flex-row.align-start.ma-2 div.mb-3.v-card.v-card--raised.v-sheet.theme--dark.elevation-24.rounded div.v-data-table.v-data-table--dense.v-data-table--has-bottom.theme--dark div.v-data-footer div.v-data-footer__select div.v-input.v-input--hide-details.v-input--is-label-active.v-input--is-dirty.v-input--is-focused.theme--dark.v-text-field.v-text-field--is-booted.v-select.primary--text div.v-input__control div.v-input__slot div.v-select__slot div.v-input__append-inner div.v-input__icon.v-input__icon--append i.v-icon.notranslate.mdi.mdi-menu-down.theme--dark.primary--text {
  display: none;
}
</style>