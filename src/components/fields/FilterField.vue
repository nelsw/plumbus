<template>
  <v-text-field
    v-model="model"
    autofocus
    clearable
    hide-details
    ref="field"
    placeholder="Filter"
    prepend-icon="mdi-filter"
  />
</template>

<script>
export default {
  namespaced: true,
  data: () => ({
    model: '',
  })
}
</script>