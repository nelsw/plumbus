import Vue from 'vue'
import Vuex from 'vuex'
import deck from '@/store/modules/deck'
import snack from '@/store/modules/snack'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{},
    mutations:{},
    actions: {},
    modules: {
        deck,
        snack,
    },
})