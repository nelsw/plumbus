<template>
  <v-card raised rounded elevation="24">
    <v-toolbar>
      <TooltipButton icon="mdi-chess-king" tooltip="Refresh" @click="fetchItems"/>
      <v-toolbar-title>
        <span v-text="`Accounts`"/>
      </v-toolbar-title>
      <v-spacer/>
      <FilterField v-if="!loading" ref="filter"/>
      <v-spacer/>
      <v-switch v-if="!loading" v-model="activeOnly" color="primary" :label="statusSwitchLabel()" hide-details/>
      <v-spacer/>
      <TooltipButton
          v-if="!loading"
          :icon="`mdi-chevron-${show ? 'up' : 'down'}`"
          :tooltip="`${show ? 'Collapse' : 'Expand'} Accounts`"
          @click="show = !show"
      />
    </v-toolbar>
    <v-expand-transition>
      <v-data-table
          v-if="show"
          dense
          hide-default-footer
          sort-by="name"
          style="cursor: pointer"
          :items="computedItems"
          :expanded="expanded"
          :loading="loading"
          :items-per-page="-1"
          :search="$refs.filter ? $refs.filter.$data.model : ''"
          :headers="[
            {text: 'ID',  value: 'account_id', width: 150, sortable: false},
            {text: 'Name', value: 'name', sortable: false},
            {text: 'Created', value: 'created_time', width: 75, sortable: false},
            {text: '', value: '', width: 0, divider: true, sortable: false},
            {text: '', value: 'data-table-expand', width: 0, align: 'center'}
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
            <TooltipButton v-if="item.account_status === 1" small color="warning" icon="mdi-pause" tooltip="Pause Account"/>
            <TooltipButton v-else  small color="success" icon="mdi-play" tooltip="Activate Account"/>
            <ExpandButton domain="Campaigns" :expand="expand" :is-expanded="isExpanded"/>
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

export default {
  components: {TooltipButton, CampaignTable, ExpandButton, FilterField},
  namespaced: true,

  data: () => ({
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
      this.$http
          .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/web?domain=acts`)
          .then(result => {
            if (result.data.length === 0) {
              this.add(Snack.Warn("FB receiving too many requests ... try again in a minute or two"))
            } else {
              this.items = Object.values(result.data)
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
            if (this.$refs.filter) {
              this.$refs.filter.$refs.field.focus()
            }
          })
    },

  },

}
</script>