export default {
    namespaced: true,

    state: () => ({
        snacks: [],
    }),

    getters: {
        getSnacks: state => state.snacks,
    },

    actions: {
        async add({commit}, snack) {
          commit('add', snack)
        },
        async del({commit}, snack) {
            commit('del', snack)
        }
    },

    mutations: {
        add(state, snack) {
            state.snacks.push(snack)
        },
        del(state, snack) {
            state.snacks.splice(state.snacks.indexOf(snack), 1)
        },
    },
}