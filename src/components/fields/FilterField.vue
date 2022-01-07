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

  watch: {
    model() {
      this.$emit('change', this.model)
    },
  },

  data: () => ({
    model: '',
  }),
}
</script>