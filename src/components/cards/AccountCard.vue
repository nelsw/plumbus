<template>
  <v-card v-if="card.visible" raised rounded elevation="24" class="mb-3" :loading="busy" :disabled="busy">
    <v-toolbar>
      <v-icon v-text="card.icon" class="mr-3"/>
      <v-toolbar-title>
        <span v-text="card.name"/>
        <span v-text="card.subtitle" class="subtitle-2 font-weight-light ml-5 hidden-sm-and-down"/>
      </v-toolbar-title>
      <v-spacer/>
      <FilterField v-if="!loading" :disabled="busy" ref="filter" @change="filter = $event"/>
      <v-spacer/>
      <v-switch v-if="!loading" v-model="activeOnly" color="primary" :label="statusSwitchLabel()" hide-details/>
      <v-spacer/>
      <ExpandButton :domain="card.name" :expand="() => {card.expanded = !card.expanded}" :is-expanded="card.expanded"/>
      <TooltipButton icon="mdi-close" tooltip="Close" @click="card.visible = false"/>
    </v-toolbar>
    <v-expand-transition>
      <v-data-table
          v-if="card.expanded"
          dense
          show-expand
          sort-by="name"
          :items="computedItems"
          :expanded="expanded"
          :loading="loading"
          item-key="id"
          :items-per-page="-1"
          hide-default-footer
          :search="$refs.filter ? $refs.filter.$data.model : ''"
          :headers="[
            {text: 'ID', value: 'id', sortable: false, width: 0},
            {text: 'Name', value: 'name', sortable: false},
            {text: '', value: '', sortable: false},
            {text: 'Active', value: 'performance.active', width: 100},
            {text: 'Inactive', value: 'performance.inactive', width: 100},
            {text: '', value: '', sortable: false},
            {text: 'Spend', value: 'performance.spend', width: 100},
            {text: 'Revenue', value: 'performance.revenue', width: 100},
            {text: 'Profit', value: 'performance.profit', width: 100},
            {text: '', value: '', sortable: false},
            {text: 'ROI', value: 'performance.roi', width: 100, align: 'right'},
            {text: '', value: '', sortable: false},
            {text: 'Status', value: 'status', width: 0, sortable: false},
            {text: 'Created', value: 'created_time', width: 75, sortable: false},
            {text: '', value: '', width: 0, divider: true, sortable: false},
            {text: '', value: 'data-table-expand', width: 0, align: 'center', sortable: false}
          ]"
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

export default {
  namespaced: true,
  components: {Chip, StatusButton, TooltipButton, CampaignTable, ExpandButton, FilterField},

  props: {
    card: Card,
  },

  data: () => ({
    busy: false,
    show: true,
    loading: true,
    items: [],
    expanded: [],
    activeOnly: false,
    filter: null,
  }),

  mounted() {
    this.fetchItems()
  },

  computed: {
    computedItems() {
      let items = this.items
      if (this.activeOnly) {
        items = items.filter(item => item.account_status === 1)
      }
      if (this.filter && this.filter !== '') {
        items = items.filter(item => item.name.toLowerCase().includes(this.filter.toLowerCase()))
      }
      return items
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

    fetchItems() {
      this.loading = true
      this.items = []
      this.$http
          .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/account?pos=in`)
          .then(result => this.items = result.data)
          .then(() => this.$debug(this.items))
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => {
            this.loading = false
            if (this.$refs.filter) {
              this.$refs.filter.$refs.field.focus()
            }
          })
    },

  },

}
</script>
<style>
div.col-12:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > i:nth-child(1) {
  display: none;
}
</style>