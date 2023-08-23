export default {
    namespaced: true,
    state: {
        storedOrders: [],
        count: 0,
        loading: false,
        filters: {
            zone: null,
            rack: null,
            shelf: null,
        },
        curPage: 1,
        countPerPage: 10,
    },
    getters: {
        getStoredOrders: (state) => {
            return state.storedOrders
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
        getFilters: (state) => {
            return state.filters
        },
        getLoading: (state) => {
            return state.loading
        },
    },
    mutations: {
        setStoredOrders(state, payload) {
            state.storedOrders = payload
        },
        setCount(state, payload) {
            state.count = payload
        },
        changePage(state, payload) {
            state.curPage = payload
        },
        resetFilters(state) {
            state.filters = {
                zone: null,
                rack: null,
                shelf: null
            }
        },
        resetPagination(state) {
            state.curPage = 1;
        },
        changeLoading(state, payload) {
            state.loading = payload
        },
        setFilters(state, payload) {
            state.filters = Object.assign({}, {...payload})
        },
    },
    actions: {
        fetchStoredOrders({ commit, state }) {
            commit('changeLoading', true);
            commit('resetData');

            this._vm.$api.addressBasedStorage.getStoredOrders({
                ...state.filters,
                offset: ((state.curPage - 1) * state.countPerPage),
                limit: state.countPerPage
            }).then((response) => {
                console.log(response);
                commit('setStoredOrders', response.data.results)
                commit('setCount', response.data.count)
            }).finally(() => {
				commit('changeLoading', false)
			});
        },
        resetPagination({ commit, state }) {
            commit('resetPagination')
        },
        resetFilters({ commit, state }) {
            commit('resetFilters')
        }
    },
}
