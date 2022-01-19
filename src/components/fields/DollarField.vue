<template>
  <v-text-field
      hide-details
      v-model="model"
      class="dollar-field pt-0 mt-0 mb-0 pb-0"
      prepend-inner-icon="mdi-currency-usd"
      style="max-width: 70px"
  />
</template>

<script>
export default {
  namespaced: true,

  props: {
    item: Object,
  },

  mounted() {
    this.model = this.item.value.toString()
  },

  data: () => ({
    model: null,
  }),
}
</script>
<style>
.dollar-field input {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
  text-align: center !important;
  font-size: 12px;
  padding-top: 0 !important;
}

.dollar-field.v-input--hide-details.v-input--is-label-active.v-input--is-dirty.theme--dark.v-text-field.v-text-field--is-booted div.v-input__control {
  padding-top: 0 !important;
  padding-bottom: 2px !important;
}

.dollar-field.v-input--hide-details.v-input--is-label-active.v-input--is-dirty.theme--dark.v-text-field.v-text-field--is-booted div.v-input__control div.v-input__slot {
  align-items: end !important;
}

.dollar-field.v-input--hide-details.v-input--is-label-active.v-input--is-dirty.theme--dark.v-text-field.v-text-field--is-booted div.v-input__control div.v-input__slot div.v-input__prepend-inner div.v-input__icon.v-input__icon--prepend-inner {
  align-items: end !important;
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}

.dollar-field i {
  font-size: 12px !important;
  padding-bottom: 4px;
}
</style>
