export default {
    namespaced: true,
    state: {
        senders: [],

        count: 0,
        loading: false,
        curPage: 1,
        countPerPage: 20,
        filters: {
            search: null
        },
    },
    getters: {
        getSenders: (state) => {
            return state.senders
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
        setSenders(state, payload) {
            state.senders = payload
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
            state.senders = []
            state.count = 0
        },
        changeLoading(state, payload) {
            state.loading = payload
        }
    },
    actions: {
        fetchSenders({ commit, state }) {
            commit('changeLoading', true)
            commit('resetData')

            this._vm.$api.senders.getSenders({ ...state.filters, limit: state.countPerPage, offset: ((state.curPage - 1) * state.countPerPage) }).then((response) => {
                commit('setSenders', response.data.results)
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