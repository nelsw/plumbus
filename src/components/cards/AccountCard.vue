<template>
  <v-card v-if="card.visible" raised rounded elevation="24" class="mb-3" :loading="busy" :disabled="busy">
    <v-toolbar>
      <v-icon v-text="card.icon" class="mr-3"/>
      <v-toolbar-title>
        <span v-text="card.name"/>
        <span v-text="card.subtitle" class="subtitle-2 font-weight-light ml-5 hidden-sm-and-down"/>
      </v-toolbar-title>
      <v-spacer/>
      <FilterField v-if="!loading" ref="filter"/>
      <v-spacer/>
      <v-switch v-if="!loading" v-model="activeOnly" color="primary" :label="statusSwitchLabel()" hide-details/>
      <v-spacer/>
      <ExpandButton :domain="card.name" :expand="() => {card.expanded = !card.expanded}" :is-expanded="card.expanded"/>
      <TooltipButton icon="mdi-close" tooltip="Close" @click="card.visible = false"/>
    </v-toolbar>
    <v-expand-transition>
      <v-data-table
          v-if="show"
          dense
          show-expand
          sort-by="name"
          :items="computedItems"
          :expanded="expanded"
          :loading="loading"
          item-key="account_id"
          :search="$refs.filter ? $refs.filter.$data.model : ''"
          :headers="[
            {text: 'ID',  value: 'account_id', width: 150, sortable: false},
            {text: 'Name', value: 'name', sortable: false},
            {text: 'Created', value: 'created_time', width: 75, sortable: false},
            {text: '', value: '', width: 0, divider: true, sortable: false},
            {text: '', value: 'data-table-expand', width: 0, align: 'center', sortable: false}
          ]"
      >
        <template v-slot:item.account_status="{item}">
          {{ convertAccountStatus(item.account_status) }}
        </template>
        <template v-slot:item.created_time="{ item }">
          {{ $moment(item.created_time).format("MM/DD/YY") }}
        </template>
        <template v-slot:item.data-table-expand="{isSelected, item, expand, isExpanded}">
          <div class="d-flex flex flex-row align-center">
            <TooltipButton
                v-if="item.account_status === 1"
                small
                color="warning"
                icon="mdi-pause"
                tooltip="Pause Campaigns"
                @click="pauseCampaigns(item)"
            />
            <TooltipButton
                v-else
                small
                color="success"
                icon="mdi-play"
                tooltip="Activate Campaigns"
                @click="activateCampaigns(item)"
            />
            <ExpandButton small domain="Account" :expand="expand" :is-expanded="isExpanded"/>
          </div>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <div class="d-flex flex flex-row align-start ma-2">
              <CampaignTable :accountID="item.account_id"/>
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

export default {
  components: {TooltipButton, CampaignTable, ExpandButton, FilterField},
  namespaced: true,

  props: {
    card: Card,
  },

  data: () => ({
    busy: false,
    show: true,
    loading: true,
    items: [],
    expanded: [],
    activeOnly: true,
  }),

  mounted() {
    this.fetchItems()
  },

  computed: {
    computedItems() {
      if (!this.activeOnly) return this.items
      return this.items.filter(item => item.account_status === 1)
    },
  },

  methods: {
    ...mapActions('snack', ['add']),

    pauseCampaigns(item) {
      let url = 'https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/ctrl'
      url += '?account_id=' + item.account_id
      url += '&status=PAUSED'
      this.$http
          .put(url)
          .then(() => this.activeOnly = false)
          .then(() => item.account_status = 2)
          .catch(error => this.add(Snack.Err(error)))
    },

    activateCampaigns(item) {
      let url = 'https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/ctrl'
      url += '?account_id=' + item.account_id
      url += '&status=ACTIVE'
      this.$http
          .put(url)
          .then(() => this.activeOnly = false)
          .then(() => item.account_status = 1)
          .catch(error => this.add(Snack.Err(error)))
    },

    statusSwitchLabel() {
      if (this.activeOnly) {
        return `Active Only (${this.items.filter(item => item.account_status === 1).length})`
      }
      return `Any Status (${this.items.length})`
    },


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
          .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/agg?node=account`)
          .then(result => {
            this.$debug(result)
            this.items = result.data
          })
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