import Vue from 'vue'
import Vuex from 'vuex'
import snack from '@/store/modules/snack'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{},
    mutations:{},
    actions: {},
    modules: {
        snack,
    },
})