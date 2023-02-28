export default {
    namespaced: true,
    state: {
        upds: [],

        count: 0,
        loading: false,
        curPage: 1,
        countPerPage: 20,
    },
    getters: {
        getUpds: (state) => {
            return state.upds
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
        setUpds(state, payload) {
            state.upds = payload
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
            state.upds = []
            state.count = 0
        },
        changeLoading(state, payload) {
            state.loading = payload
        }
    },
    actions: {
        fetchUpds({ commit, state }) {
            commit('changeLoading', true)
            commit('resetData')

            this._vm.$api.accUpds.getUpds({ limit: state.countPerPage, offset: ((state.curPage - 1) * state.countPerPage) }).then((response) => {
                commit('setUpds', response.data.results)
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