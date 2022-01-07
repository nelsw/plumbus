<template>
  <v-text-field
      v-model="model"
      :loading="loading"
      :disabled="disabled"
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

  props: {
    disabled: Boolean,
    loading: Boolean,
  },

  data: () => ({
    model: '',
  }),
}
</script>