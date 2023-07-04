export default {
    namespaced: true,
    state: {
        acts: [],

        count: 0,
        loading: false,
        curPage: 1,
        countPerPage: 20,

    },
    getters: {
        getActs: (state) => {
            return state.acts
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
        setActs(state, payload) {
            state.acts = payload
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
            state.acts = []
            state.count = 0
        },
        changeLoading(state, payload) {
            state.loading = payload
        }
    },
    actions: {
        fetchActs({ commit, state }) {
            commit('changeLoading', true)
            commit('resetData')

            this._vm.$api.accActs.getActs({ limit: state.countPerPage, offset: ((state.curPage - 1) * state.countPerPage) })
                .then((response) => {
                    console.log('acts - ', response.data)
                    commit('setActs', response.data.results)
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