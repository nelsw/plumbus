<template>
  <v-card raised rounded elevation="24" :disabled="busy">
    <v-toolbar rounded>
      <v-icon v-text="card.icon" class="mr-3"/>
      <v-toolbar-title>
        <span v-text="card.name"/>
        <span v-text="card.subtitle" class="subtitle-2 font-weight-light ml-5 hidden-sm-and-down"/>
      </v-toolbar-title>
      <v-spacer/>
      <FilterField ref="filter" class="d-flex flex-grow-0 flex-shrink-1" :disabled="busy" @change="filter = $event"/>
      <v-divider vertical inset class="ml-5 mr-2"/>
      <v-switch :disabled="busy" v-model="activeOnly" color="primary" :label="statusSwitchLabel()" hide-details/>
      <ViewColumnMenu :columns="columns"/>
      <TooltipButton icon="mdi-refresh" tooltip="Refresh Accounts" @click="refreshItems"/>
      <ExpandButton :domain="card.name" :expand="() => {card.expanded = !card.expanded}" :is-expanded="card.expanded"/>
      <TooltipButton icon="mdi-close" tooltip="Close" @click="card.visible = false"/>
    </v-toolbar>
    <v-expand-transition>
      <v-data-table
          v-if="card.expanded"
          dense
          sort-desc
          show-expand
          single-expand
          sort-by="performance.roi"
          item-key="id"
          hide-default-footer
          :loading="busy"
          :items="computedItems"
          :items-per-page="-1"
          :headers="headers"
      >
        <template v-slot:item.performance.spend="{ item }">
          {{ item.performance.spend_str }}
        </template>
        <template v-slot:item.performance.revenue="{ item }">
          {{ item.performance.revenue_str }}
        </template>
        <template v-slot:item.performance.profit="{ item }">
          {{ item.performance.profit_str }}
        </template>
        <template v-slot:item.performance.roi="{ item }">
          <Chip small :float="item.performance.roi" :text="item.performance.roi_str"/>
        </template>
        <template v-slot:item.performance.active="{ item }">
          {{ item.performance.active_str }}
        </template>
        <template v-slot:item.performance.inactive="{ item }">
          {{ item.performance.inactive_str }}
        </template>
        <template v-slot:item.created_time="{ item }">
          {{ $moment(item.created_time).format("MM/DD/YY") }}
        </template>
        <template v-slot:item.data-table-expand="{isSelected, item, expand, isExpanded}">
          <div class="d-flex flex flex-row align-center">
            <StatusButton :item="item"/>
            <ExpandButton
                small
                domain="Account"
                :expand="expand"
                :is-expanded="isExpanded"
                :disabled="item.performance.active + item.performance.inactive < 1"
            />
          </div>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <div class="d-flex flex flex-row align-start ma-2">
              <CampaignTable
                  :fullscreen="true"
                  :accountID="item.account_id"
                  @open="$emit('open', item.account_id)"
                  @close="$emit('close')"
              />
            </div>
          </td>
        </template>
      </v-data-table>
    </v-expand-transition>
  </v-card>
</template>

<script>
import FilterField from "@/components/fields/FilterField";
import ExpandButton from "@/components/buttons/ExpandButton";
import CampaignTable from "@/components/tables/CampaignTable";
import TooltipButton from "@/components/buttons/TooltipButton";
import Snack from "@/models/Snack";
import {mapActions} from "vuex";
import Card from "@/models/Card";
import StatusButton from "@/components/buttons/AdStatusButton";
import Chip from "@/components/chips/Chip";
import ViewColumnMenu from "@/components/menus/ViewColumnMenu";

export default {
  namespaced: true,
  components: {ViewColumnMenu, Chip, StatusButton, TooltipButton, CampaignTable, ExpandButton, FilterField},

  props: {
    card: Card,
  },

  data: () => ({
    busy: false,
    items: [],
    activeOnly: false,
    filter: null,
    columns: [
      {visible: true, text: 'ID', value: 'id', width: 0},
      {visible: true, text: 'Name', value: 'name'},
      {visible: true, text: 'Created', value: 'created_time', width: 75, sortable: false},
      {visible: true, text: 'Active', value: 'performance.active', width: 100},
      {visible: true, text: 'Inactive', value: 'performance.inactive', width: 100},
      {visible: true, text: 'Spend', value: 'performance.spend', width: 100},
      {visible: true, text: 'Revenue', value: 'performance.revenue', width: 100},
      {visible: true, text: 'Profit', value: 'performance.profit', width: 100},
      {visible: true, text: 'ROI', value: 'performance.roi', width: 100, align: 'center'},
      {visible: true, text: '', value: '', width: 0, divider: true, sortable: false},
      {visible: true, text: '', value: 'data-table-expand', width: 0, align: 'center', sortable: false}
    ]
  }),

  mounted() {
    this.fetchItems()
  },

  computed: {
    computedItems() {
      let items = this.items
      if (this.filter && this.filter !== '') {
        items = items.filter(item =>
            item.name.toLowerCase().includes(this.filter.toLowerCase()) ||
            item.id.includes(this.filter))
      }
      if (this.activeOnly) {
        items = items.filter(item => item.status === 'Active')
      }
      return items
    },
    headers() {
      return this.columns.filter(column => column.visible)
    },
  },

  methods: {
    ...mapActions('snack', ['add']),

    statusSwitchLabel() {
      if (this.activeOnly) {
        return `Active Only (${this.items.filter(item => item.account_status === 1).length})`
      }
      return `Any Status (${this.items.length})`
    },

    refreshItems() {
      this.busy = true
      this.$http
          .post(this.$api('account'))
          .then(() => this.$refs.filter.$refs.field.focus())
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },

    fetchItems() {
      this.busy = true
      this.items = []
      this.$http
          .get(this.$api('account') + `?pos=in`)
          .then(result => this.items = result.data)
          .then(() => this.$refs.filter.$refs.field.focus())
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },

  },

}
</script>
<style>
div.col-12:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > i:nth-child(1) {
  display: none;
}
</style>