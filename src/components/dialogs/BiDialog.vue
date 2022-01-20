<template>
  <v-dialog persistent max-width="290" v-model="visible" @keydown.esc="no" @keydown.enter="yes">
    <v-card>
      <v-card-title class="headline" v-text="title"/>
      <v-card-text v-text="text"/>
      <v-card-actions>
        <v-spacer/>
        <SimpleButton small text="cancel" @click="no"/>
        <SimpleButton small text="continue" @click="yes"/>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import SimpleButton from "@/components/buttons/SimpleButton";

export default {
  namespaced: true,

  components: {SimpleButton},

  props: {
    title: String,
    text: String,
  },

  data: () => ({
    item: null,
    visible: false,
  }),

  methods: {

    load(item) {
      this.item = item
      this.visible = true
    },

    close() {
      this.visible = false
      this.item = null
    },

    no() {
      this.$emit('no')
      this.close()
    },

    yes() {
      this.$emit('yes', this.item)
      this.close()
    },
  },
}
</script>
