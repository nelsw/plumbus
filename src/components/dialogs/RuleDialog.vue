<template>
  <v-dialog persistent v-model="visible" max-width="900" @keydown.esc="close" @keydown.enter="save">
    <v-card v-if="visible" :loading="busy" :disabled="busy">
      <v-card-title>
        <span class="text-h5" v-text="`Rule Editor`"/>
      </v-card-title>
      <v-card-text>
        <br>
        <RuleDescription :item="item"/>
        <br>
        <RuleScope ref="scope" :item="item"/>
        <br>
        <RuleConditions :item="item"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <SimpleButton small text="cancel" @click="close"/>
        <SimpleButton small text="save" @click="save"/>
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
    item: null,
  }),

  methods: {

    load(item) {
      this.item = item
          ? JSON.parse(JSON.stringify(item))
          : {
            id: '',
            name: 'New Rule',
            scope: new Map(),
            conditions: [{
              id: null,
              lhs: 'ROI',
              op: '<',
              rhs: 2,
              created: null,
              updated: null
            }],
            effect: 'PAUSED',
            status: true,
          }
      this.busy = false
      this.visible = true
    },

    save() {
      this.$refs.scope.setScope()
      console.log(this.item)
      // this.$emit('save', this.item)
      // this.close()
    },

    close() {
      this.visible = false
      this.item = null
    },
  },
}
</script>