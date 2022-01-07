<template>
  <v-dialog
      persistent
      v-model="visible"
      max-width="500"
      @keydown.esc="close"
      @keydown.enter="save"
  >
    <v-card v-if="visible" :loading="busy" :disabled="busy">
      <v-card-title>
        <span class="text-h5" v-text="`Rule Editor`"/>
      </v-card-title>
      <v-card-text>
        <br>
        <RuleDescription :item="item"/>
        <br>
        <RuleScope ref="ruleScope" :item="item"/>
        <br>
        <RuleConditions :item="item"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <SimpleButton
            small
            outlined
            text="cancel"
            @click="close"
        />
        <SimpleButton
            small
            text="save"
            @click="save"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import SimpleButton from "@/components/buttons/SimpleButton";
import RuleDescription from "@/components/cards/rule/editor/RuleDescription";
import RuleScope from "@/components/cards/rule/editor/RuleScope";
import RuleConditions from "@/components/cards/rule/editor/RuleConditions";

export default {
  namespaced: true,

  components: {RuleConditions, RuleScope, RuleDescription, SimpleButton},

  data: () => ({
    visible: false,
    busy: true,
    item: {},
  }),

  methods: {

    load(item) {
      this.item = item ? item : this.newItem()
      this.busy = false
      this.visible = true
    },

    save() {
      this.$refs.ruleScope.debug()
    },

    close() {
      this.visible = false
    },

    resetItem() {
      this.item = {
        id: '',
        name: 'New Rule',
        scope: 'All Accounts',
        conditions: [],
        action: '',
        status: true,
      }
    },

    newItem() {
      return {
        id: '',
        name: 'New Rule',
        scope: 'All Accounts',
        conditions: [],
        action: '',
        status: true,
      }
    }

  },
}
</script>

<style scoped>

</style>