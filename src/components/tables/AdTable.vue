<template>
  <v-data-table
      dense
      multi-sort
      :items="items"
      :headers="[
          {text: 'Start',  value: 'date_start', align: 'start', width: 150},
          {text: 'Stop', value: 'date_stop'},
          {text: 'Spent', value: 'spend', width: 150},
          {text: '', value: '', divider: true, groupable: false},
          {text: '', value: 'data-table-expand', groupable: false},
        ]"
  >
    <template v-slot:item.spend="{ item }">
      {{ $formatFbPrice(item.spend) }}
    </template>
  </v-data-table>
</template>
<script>

export default {
  namespaced: true,
  props: {
    items: Array,
  }
}
</script>