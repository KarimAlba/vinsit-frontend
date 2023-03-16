export default {
    namespaced: true,
    state: {
        executors: [],

        count: 0,
        loading: false,
        curPage: 1,
        countPerPage: 20,
        filters: {
            search: null
        },

        // clientType: [
        //     { id: "E", title: "Юридическое лицо", short_title: "Юр. лицо" },
        //     { id: "I", title: "Физическое лицо", short_title: "Физ. лицо" },
        // ],
    },
    getters: {
        getExecutors: (state) => {
            return state.clients
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
        }
    },
    mutations: {
        setExecutors(state, payload) {
            state.executors = payload
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
        }
    },
    actions: {
        fetchExecutors({ commit, state }) {
            commit('changeLoading', true)
            commit('resetData')

            this._vm.$api.executors.getExecutors({ limit: state.countPerPage, offset: ((state.curPage - 1) * state.countPerPage) }).then((response) => {
                commit('setExecutors', response.data.results)
                commit('setCount', response.data.count)
            })
                .finally(() => {
                    commit('changeLoading', false)
                });
        },
        resetPagination({ commit, state }) {
            commit('resetPagination')
        },
    },
}