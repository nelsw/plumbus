<template>
  <v-card>
    <v-toolbar style="background-color: gray" dense>
      <span class="text-h6" v-text="`Description`"/>
      <v-spacer/>
      <TooltipButton
          :icon="`mdi-chevron-${show ? 'up' : 'down'}`"
          :tooltip="`${show ? 'Collapse' : 'Expand'}`"
          @click="show = !show"
      />
    </v-toolbar>
    <v-expand-transition>
      <div v-if="show">
        <div class="d-flex flex flex-row align-center justify-space-around px-4 my-1">
          <div class="d-flex flex">
            <v-text-field label="Name" v-model="item.name" autofocus/>
          </div>
          <div class="d-flex flex flex-grow-0 flex-shrink-1 pl-2">
            <v-switch dense v-model="item.status" label="Active"/>
          </div>
        </div>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import TooltipButton from "@/components/buttons/TooltipButton";
export default {
  components: {TooltipButton},
  namespaced: true,

  props: {
    item: Object,
  },

  data: () => ({
    show: true,
    valid: true,
  }),
}
</script>