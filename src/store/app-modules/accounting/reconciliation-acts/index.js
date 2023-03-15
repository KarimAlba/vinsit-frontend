export default {
    namespaced: true,
    state: {
        reconciliationActs: [],

        count: 0,
        loading: false,
        curPage: 1,
        countPerPage: 20,

    },
    getters: {
        getReconciliationActs: (state) => {
            return state.reconciliationActs
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
        setReconciliationActs(state, payload) {
            state.reconciliationActs = payload
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
        fetchReconciliationActs({ commit, state }) {
            commit('changeLoading', true)
            commit('resetData')

            this._vm.$api.reconciliationActs.getReconciliationActs({ limit: state.countPerPage, offset: ((state.curPage - 1) * state.countPerPage) }).then((response) => {
                commit('setReconciliationActs', response.data.results)
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