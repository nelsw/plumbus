<template>
  <v-select
      v-model="item.key"
      :items="items"
      label="Target"
  />
</template>

<script>
export default {

  namespaced: true,

  props: {
    item: Object,
  },

  data: () => ({
    items: ['ROI %', 'Spend $'],
    model: 'ROI %'
  }),

}
</script>

<style scoped>

</style>