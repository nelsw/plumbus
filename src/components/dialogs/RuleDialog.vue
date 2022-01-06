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
        <v-container>
          <AccountTreeCard/>
          <br>
          <RuleForm :item="item"/>
        </v-container>
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
import RuleForm from "@/components/forms/RuleForm";
import AccountTreeCard from "@/components/cards/AccountTreeCard";
export default {
  namespaced: true,

  components: {AccountTreeCard, RuleForm, SimpleButton},

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