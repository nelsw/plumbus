<template>
  <v-data-table
      dense
      multi-sort
      :items="items"
      :headers="[
          {text: 'ID',  value: 'campaign_id', align: 'start', width: 150},
          {text: 'Name', value: 'campaign_name'},
          {text: 'Spend', value: 'spend'},
          {text: 'Revenue', value: 'revenue'},
          {text: 'Profit', value: 'profit'},
          {text: 'Status', value: 'status', width: 100},
          {text: '', value: '', divider: true, groupable: false, width: 0},
          {text: '', value: 'data-table-expand', groupable: false, width: 0},
        ]"
      hide-default-footer
      :items-per-page="-1"
  >
    <template v-slot:item.profit="{ item }">
      {{ (item.revenue - item.spend) }}
    </template>
    <template v-slot:item.status="{ item }">
      {{ status(item.status) }}
    </template>
  </v-data-table>
</template>

<script>

export default {
  namespaced: true,
  props: {
    items: Array,
  },
  methods: {
    status(s) {
      s = s.toLowerCase()
      let a = s.charAt(0).toUpperCase()
      let z = s.slice(1)
      return a + z
    },
  },
}
</script>