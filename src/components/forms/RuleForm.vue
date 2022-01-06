<template>
  <v-form
      ref="form"
      v-model="valid"
      lazy-validation
  >
    <v-text-field
        label="Name"
        v-model="item.name"
    />
    <v-switch
        v-model="item.status"
        label="Active"
    />
    <ConditionForm
        v-for="(condition, index) in item.conditions"
        :key="index"
        :index="index"
        :item="condition"
    />
  </v-form>
</template>

<script>
import ConditionForm from "@/components/forms/ConditionForm";
export default {
  components: {ConditionForm},
  namespaced: true,

  props: {
    item: Object,
  },

  data: () => ({
    valid: true,
  }),
}
</script>

<style scoped>

</style>