<template>
  <v-form
      ref="form"
      v-model="valid"
      lazy-validation
  >
    <ConditionKeySelect :item="item"/>
    <v-text-field
    />
    <v-text-field
    />
  </v-form>
</template>

<script>
import ConditionKeySelect from "@/components/selects/ConditionTargetSelect";
export default {
  components: {ConditionKeySelect},
  namespaced: true,

  props: {
    index: Number,
    item: Object,
  },

  data: () => ({
    valid: true,
  }),
}
</script>

<style scoped>

</style>