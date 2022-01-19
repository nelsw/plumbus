<template>
  <v-select
      v-model="item.target"
      :items="['ROI', 'SPEND']"
  />
</template>

<script>
export default {

  namespaced: true,

  props: {
    item: Object,
  },
}
</script>
