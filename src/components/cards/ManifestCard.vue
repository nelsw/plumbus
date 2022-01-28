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
      <ViewColumnMenu :columns="columns"/>
      <TooltipButton icon="mdi-refresh" tooltip="Refresh Accounts" @click="refreshItems"/>
      <ExpandButton :domain="card.name" :expand="() => {card.expanded = !card.expanded}" :is-expanded="card.expanded"/>
      <TooltipButton icon="mdi-close" tooltip="Close" @click="card.visible = false"/>
    </v-toolbar>
    <v-expand-transition>
      <v-data-table
          v-if="card.expanded"
          dense
          item-key="id"
          sort-by="name"
          :loading="busy"
          :items="computedItems"
          :headers="headers"
      >
        <template v-slot:item.created_time="{ item }">
          {{ $moment(item.created_time).format("MM/DD/YY") }}
        </template>
        <template v-slot:item.data-table-expand="{isSelected, item}">
          <div class="d-flex flex flex-row align-center">
            <AdStatusButton :item="item"/>
          </div>
        </template>
      </v-data-table>
    </v-expand-transition>
  </v-card>
</template>

<script>
import TooltipButton from "@/components/buttons/TooltipButton";
import Snack from "@/models/Snack";
import {mapActions} from "vuex";
import Card from "@/models/Card";
import ExpandButton from "@/components/buttons/ExpandButton";
import ViewColumnMenu from "@/components/menus/ViewColumnMenu";
import FilterField from "@/components/fields/FilterField";
import AdStatusButton from "@/components/buttons/AdStatusButton";

export default {
  namespaced: true,
  components: {AdStatusButton, FilterField, ViewColumnMenu, ExpandButton, TooltipButton},

  props: {
    card: Card,
  },

  data: () => ({
    busy: false,
    filter: null,
    items: [],
    columns: [
      {visible: true, text: 'ID', value: 'id', width: 0},
      {visible: true, text: 'Name', value: 'name'},
      {visible: true, text: 'Created', value: 'created_time', width: 75, sortable: false},
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

    fetchItems() {
      this.busy = true
      this.items = []
      this.$http
          .get(this.$api('account') + `?pos=all`)
          .then(result => this.items = result.data)
          .then(() => this.$refs.filter.$refs.field.focus())
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },

    refreshItems() {
      this.busy = true
      this.$http
          .put(this.$api('account'))
          .then(result => this.items = result.data)
          .then(() => this.$refs.filter.$refs.field.focus())
          .then(() => this.add(Snack.OK('Manifest Refreshed')))
          .catch(error => this.add(Snack.Err(error)))
          .finally(() => this.busy = false)
    },
  },

}
</script>
<style>
div.col-12:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > i:nth-child(1) {
  display: none;
}
</style>