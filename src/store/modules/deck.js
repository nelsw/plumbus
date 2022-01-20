import Card from "@/models/Card";

export default {

    namespaced: true,

    state: () => ({
        deck: [
            new Card(
                'Manifest',
                'mdi-account-tie-hat',
                'Accounts to include or exclude from PLUMBUS.',
                true,true, false),

            new Card(
                'Rules',
                'mdi-account-hard-hat',
                'Conditions to autonomously control Ad visibility.',
                true, true, true),

            new Card(
                'Portfolio',
                'mdi-account-cowboy-hat',
                'Performance summaries of Accounts & Campaigns.',
                false,true, true),
        ],
    }),

    getters: {
        getDeck: state => state.deck,
        getCard: state => name => state.deck.find(card => card.name === name)
    },

    actions: {},

    mutations: {},
}