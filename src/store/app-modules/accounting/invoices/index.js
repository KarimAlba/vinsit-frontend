export default {
    namespaced: true,
    state: {
        invoices: [],

        count: 0,
        loading: false,
        curPage: 1,
        countPerPage: 20,

    },
    getters: {
        getInvoices: (state) => {
            return state.invoices
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
        setInvoices(state, payload) {
            state.invoices = payload
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
            state.invoices = []
            state.count = 0
        },
        changeLoading(state, payload) {
            state.loading = payload
        }
    },
    actions: {
        fetchInvoices({ commit, state }) {
            commit('changeLoading', true)
            commit('resetData')

            this._vm.$api.invoices.getInvoices({ limit: state.countPerPage, offset: ((state.curPage - 1) * state.countPerPage) }).then((response) => {
                commit('setInvoices', response.data.results)
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