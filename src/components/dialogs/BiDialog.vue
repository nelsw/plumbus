<template>
  <v-dialog
      persistent
      max-width="290"
      v-model="visible"
      @keydown.esc="$emit('cancel')"
      @keydown.enter="$emit('continue')"
  >
    <v-card :loading="busy" :disabled="busy">
      <v-card-title class="headline" v-text="title"/>
      <v-card-text v-text="text"/>
      <v-card-actions>
        <v-spacer/>
        <SimpleButton :small="true" text="cancel" @click="$emit('cancel')"/>
        <SimpleButton :small="true" text="continue" @click="$emit('continue')"/>
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
    visible: Boolean,
    title: String,
    busy: Boolean,
    text: String,
  },
}
</script>
