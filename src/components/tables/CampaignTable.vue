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
        :items="computedItems"
        :headers="[
          {text: 'ID',  value: 'id', width: 150},
          {text: 'UTM',  value: 'utm', width: 150},
          {text: 'Name', value: 'name'},
          {text: 'Spend', value: 'spend'},
          {text: 'Revenue', value: 'revenue'},
          {text: 'Profit', value: 'profit'},
          {text: 'ROI', value: 'roi'},
          {text: 'Created', value: 'created_time', width: 0, sortable: false},
          {text: 'Updated', value: 'updated_time', width: 0, sortable: false},
          {text: '', value: '', width: 0, divider: true, sortable: false},
          {text: '', value: 'data-table-expand', width: 0, align: 'center'}
        ]"
        hide-default-footer
        :items-per-page="-1"
    >
      <template v-slot:item.updated_time="{ item }">
        {{ $moment(item.updated_time).format("MM/DD/YY") }}
      </template>
      <template v-slot:item.created_time="{ item }">
        {{ $moment(item.created_time).format("MM/DD/YY") }}
      </template>
      <template v-slot:item.data-table-expand="{isSelected, item}">
        <div class="d-flex flex flex-row align-center">
          <TooltipButton v-if="item.status === 'ACTIVE'" small color="warning" icon="mdi-pause"
                         tooltip="Pause Campaign"/>
          <TooltipButton v-else small color="success" icon="mdi-play" tooltip="Activate Campaign"/>
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

export default {
  components: {FilterField, TooltipButton},
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

    status(s) {
      s = s.toLowerCase()
      let a = s.charAt(0).toUpperCase()
      let z = s.slice(1)
      return a + z
    },

    fetchItems() {
      this.loading = true
      this.items = []
      this.$http
          .get(`https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/agg?node=campaign&id=${this.accountID}`)
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
    }

  },
}
</script>