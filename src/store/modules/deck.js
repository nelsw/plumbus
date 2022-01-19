import Card from "@/models/Card";

export default {

    namespaced: true,

    state: () => ({
        deck: [
            new Card('Rule', true),
        ],
    }),

    getters: {
        getCard: state => name => state.deck.find(card => card.name === name)
    },

    actions: {
        async toggleVisibility({commit}, name) {
            commit('toggleVisibility', name)
        },
    },

    mutations: {
        toggleVisibility(state, name) {
            if (!name) return
            let card = state.deck.find(card => card.name === name)
            state.deck[state.deck.indexOf(card)].visible = !card.visible
        },
    },
}