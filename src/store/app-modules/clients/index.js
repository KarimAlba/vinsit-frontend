export default {
    namespaced: true,
    state: {
        clients: [],

        count: 0,
        loading: false,
        curPage: 1,
        countPerPage: 20,
        filters: {
            search: null,
            date_created_after: null,
            date_created_before: null,
            number: null,
			counterparty: null,
            type: null,
        },

        ordering: '-id',

        clientType: [
            { id: "E", title: "Юридическое лицо", short_title: "Юр. лицо" },
            { id: "I", title: "Физическое лицо", short_title: "Физ. лицо" },
        ],
    },
    getters: {
        getClients: (state) => {
            return state.clients
        },
        getClientType: (state) => {
            return state.clientType
        },
        getFilters: (state) => {
            return state.filters
        },
        getCount: (state) => {
            return state.count
        },
        getCurPage(state) {
            return state.curPage
        },
        getCountPerPage: (state) => {
            return state.countPerPage
        },
        getLoading: (state) => {
            return state.loading
        },
        getOrdering: (state) => {
            return state.ordering
        },
    },
    mutations: {
        setClients(state, payload) {
            state.clients = payload
        },
        setCount(state, payload) {
            state.count = payload
        },
        changePage(state, payload) {
            state.curPage = payload
        },
        resetPagination(state) {
            state.curPage = 1;
        },
        resetFilters(state) {
            state.filters = {
                search: null,
            }
        },
        resetData(state) {
            state.clients = []
            state.count = 0
        },
        changeLoading(state, payload) {
            state.loading = payload
        },
        changeOrdering(state, payload) {
            state.ordering = payload
        },
        resetOrdering(state) {
            state.ordering = null
        },
    },
    actions: {
        fetchClients({ commit, state }) {
            commit('changeLoading', true)
            commit('resetData')

            this._vm.$api.clients.getClients({ 
                ...state.filters, 
                limit: state.countPerPage, 
                ordering: state.ordering,
                offset: ((state.curPage - 1) * state.countPerPage) 
            }).then((response) => {
                commit('setClients', response.data.results)
                commit('setCount', response.data.count)
            })
                .finally(() => {
                    commit('changeLoading', false)
                });
        },
        resetPagination({ commit, state }) {
            commit('resetPagination')
        },
        resetOrdering({ commit, state }) {
            commit('resetOrdering')
        }
    },
}