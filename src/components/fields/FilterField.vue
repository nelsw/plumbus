<template>
  <v-text-field
      clearable
      hide-details
      v-model="model"
      prepend-icon="mdi-filter"
      label="Filter"
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