export default {
    namespaced: true,
    state: {
        checks: [],

        count: 0,
        loading: false,
        curPage: 1,
        countPerPage: 20,

        filters: {
            search: null,
        },
        ordering: '-date_created',
    },
    getters: {
        getChecks: (state) => {
            return state.checks
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
        getFilters: (state) => {
            return state.filters
        },
        getOrdering: (state) => {
            return state.ordering
        },
    },
    mutations: {
        setChecks(state, payload) {
            state.checks = payload
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
        resetData(state) {
            state.checks = []
            state.count = 0
        },
        changeLoading(state, payload) {
            state.loading = payload
        },
        resetFilters(state) {
            state.filters = {
                search: null,
            };
        },
        changeOrdering(state, payload) {
            state.ordering = payload
        },
        resetOrdering(state) {
            state.ordering = null
        },
    },
    actions: {
        fetchChecks({ commit, state }) {
            commit('changeLoading', true)
            commit('resetData')

            this._vm.$api.checks.getChecks({ 
                limit: state.countPerPage, 
                offset: ((state.curPage - 1) * state.countPerPage),
                ordering: state.ordering,
                ...state.filters 
            }).then((response) => {
                commit('setChecks', response.data.results)
                commit('setCount', response.data.count)
            })
                .finally(() => {
                    commit('changeLoading', false)
                });
        },
        resetPagination({ commit, state }) {
            commit('resetPagination')
        },
        resetFilters({ commit, state }) {
            commit('resetFilters')
        },
        resetOrdering({ commit, state }) {
            commit('resetOrdering')
        },
    },
}