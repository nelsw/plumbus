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
          v-if="card.expanded"
          dense
          show-expand
          sort-by="name"
          :items="computedItems"
          :expanded="expanded"
          :loading="loading"
          item-key="account_id"
          :search="$refs.filter ? $refs.filter.$data.model : ''"
          :headers="[
            {text: 'Name', value: 'name', sortable: false},
            {text: 'Created', value: 'created_time', width: 75, sortable: false},
            {text: '', value: '', width: 0, divider: true, sortable: false},
            {text: '', value: 'data-table-expand', width: 0, align: 'center', sortable: false}
          ]"
      >
        <template v-slot:item.created_time="{ item }">
          {{ $moment(item.created_time).format("MM/DD/YY") }}
        </template>
        <template v-slot:item.data-table-expand="{isSelected, item, expand, isExpanded}">
          <div class="d-flex flex flex-row align-center">
            <StatusButton :item="item"/>
            <ExpandButton small domain="Account" :expand="expand" :is-expanded="isExpanded"/>
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

export default {
  namespaced: true,
  components: {StatusButton, TooltipButton, CampaignTable, ExpandButton, FilterField},

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
          .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/account?pos=all`)
          .then(result => this.items = result.data)
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