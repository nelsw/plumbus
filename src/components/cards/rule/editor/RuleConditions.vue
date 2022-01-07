<template>
  <v-card raised rounded elevation="24">
    <v-toolbar style="background-color: gray" dense>
      <span class="text-h6" v-text="`Conditions`"/>
      <v-spacer/>
      <TooltipButton
          :icon="`mdi-chevron-${show ? 'up' : 'down'}`"
          :tooltip="`${show ? 'Collapse' : 'Expand'}`"
          @click="show = !show"
      />
    </v-toolbar>
    <v-expand-transition>
      <v-card v-if="show" class="mx-auto overflow-y-auto" max-height="400">
          <v-card-text class="mx-auto">
            <v-list dense>
              <v-list-item dense v-for="(item, index) in item.conditions" :key="index">
                <v-list-item-content>
                  <div class="d-flex flex align-center justify-space-between">
                    <div
                        style="width: 30px"
                        class="d-flex flex mt-1"
                        v-text="`${index > 0 ? 'and' : 'if'}`"
                    />
                    <div class="d-flex flex">
                      <v-select
                          dense
                          v-model="item.target"
                          :items="['ROI', 'SPEND']"
                          append-icon=""
                          style="max-width: 60px"
                          hide-details
                          class="caption ma-0 pa-0"
                      />
                    </div>
                    <div class="d-flex flex">
                      <v-select
                          dense
                          v-model="item.operator"
                          :items="['>', '<']"
                          append-icon=""
                          style="max-width: 25px"
                          hide-details
                          class="caption ma-0 pa-0"
                      />
                    </div>
                    <div class="d-flex flex">
                      <PercentField v-if="item.target === 'ROI'" :item="item"/>
                      <DollarField v-else :item="item"/>
                    </div>
                    <div class="d-flex flex align-center flex-shrink-1 flex-grow-0 mt-2">
                      <TooltipButton
                          v-if="showDelete"
                          small
                          icon="mdi-minus"
                          color="error"
                          tooltip="Delete Condition"
                          @click="delCondition(index)"
                      />
                      <TooltipButton
                          small
                          icon="mdi-plus"
                          color="success"
                          tooltip="Add Condition"
                          @click="addCondition"
                      />
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item dense>
                <v-list-item-content>
                  <v-list-item-subtitle>
                    {{ 'then' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-switch
                      dense
                      class="caption ml-2"
                      :label="`${item.action ? 'Activate' : 'Disable'}`"
                      v-model="item.action"
                  />
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-right">
                    {{ 'campaigns' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
    </v-expand-transition>
  </v-card>
</template>

<script>
import TooltipButton from "@/components/buttons/TooltipButton";
import PercentField from "@/components/fields/PercentField";
import DollarField from "@/components/fields/DollarField";

export default {
  components: {DollarField, PercentField, TooltipButton},
  namespaced: true,

  props: {
    item: Object,
  },

  data: () => ({
    busy: true,
    show: true,
  }),

  computed: {
    showDelete() {
      return this.item.conditions.length > 1
    }
  },

  methods: {

    addCondition() {
      let condition = {
        id: null,
        target: 'SPEND',
        operator: '>',
        value: 10,
        created: null,
        updated: null
      }
      this.item.conditions.push(condition)
    },

    delCondition(index) {
      this.item.conditions.splice(index, 1)
    }

  },
}
</script>

<style>
.v-select__selection--comma {
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto !important;
  margin-right: auto !important;
  width: 200px;
  text-align: center;
}
</style>
