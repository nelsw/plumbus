<template>
  <v-data-table
      dense
      multi-sort
      show-expand
      :items="items"
      :headers="[
          {text: 'ID',  value: 'id', align: 'start', width: 150},
          {text: 'Name', value: 'name'},
          {text: 'Status', value: 'status', width: 100},
          {text: '', value: '', divider: true, groupable: false, width: 0},
          {text: '', value: 'data-table-expand', groupable: false, width: 0},
        ]"
      hide-default-footer
      :items-per-page="-1"
  >
    <template v-slot:item.status="{ item }">
      {{ status(item.status) }}
    </template>
    <template v-slot:item.data-table-expand="{isSelected, item, expand, isExpanded}">
      <ExpandButton domain="Ads" :expand="expand" :is-expanded="isExpanded"/>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <AdTable :items="item.insights.data"/>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import ExpandButton from "@/components/buttons/ExpandButton";
import AdTable from "@/components/tables/AdTable";

export default {
  namespaced: true,
  components: {AdTable, ExpandButton},
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