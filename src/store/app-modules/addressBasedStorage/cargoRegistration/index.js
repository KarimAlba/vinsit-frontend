export default {
    namespaced: true,
    state: {
        storedOrders: [],
        storedOrder: {},
        editableStoredOrder: {},
        count: 0,
        loading: false,
        filters: {
            search: null,
            stock: null,
            zone: null,
            rack: null,
            shelf: null,
            status: null,
            search_fields: []
        },
        curPage: 1,
        countPerPage: 10,
        ordering: '-date_created',
    },
    getters: {
        getStoredOrders: (state) => {
            return state.storedOrders
        },
        getStoredOrder: (state) => {
            return state.storedOrder
        },
        getEditableStoredOrder: (state) => {
            return state.editableStoredOrder
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
        getStatuses: (state) => {
            return state.statuses
        },
        getOrdering: (state) => {
            return state.ordering
        }
    },
    mutations: {
        setStoredOrders(state, payload) {
            state.storedOrders = payload
        },
        setOrder(state, payload) {
            state.storedOrder = payload;
            state.editableStoredOrder = {...payload};
        },
        setEditableStoredOrder(state, payload) {
            state.editableStoredOrder = payload;
        },
        setCount(state, payload) {
            state.count = payload
        },
        changePage(state, payload) {
            state.curPage = payload
        },
        resetFilters(state) {
            state.filters = {
                search: null,
                stock: null,
                zone: null,
                rack: null,
                shelf: null,
                status: null,
                search_fields: []
            }
        },
        resetPagination(state) {
            state.curPage = 1;
        },
        resetData(state) {
            state.storedOrder = []
            state.count = 0
        },
        changeLoading(state, payload) {
            state.loading = payload
        },
        setFilters(state, payload) {
            state.filters = Object.assign({}, {...payload})
        },
        changeOrdering(state, payload) {
            state.ordering = payload
        },
        resetOrdering(state) {
            state.ordering = null
        },
        resetEditableStoredOrder(state) {
            state.editableStoredOrder = {
                zone: null,
                rack: null,
                shelf: null,
                status: null,
                orders: []
            }
        }
    },
    actions: {
        fetchStoredOrders({ commit, state }) {
            commit('changeLoading', true);
            commit('resetData');

            this._vm.$api.addressBasedStorage.getStoredOrders({
                ...state.filters,
                offset: ((state.curPage - 1) * state.countPerPage),
                limit: state.countPerPage,
                ordering: state.ordering,
            }).then((response) => {
                commit('setStoredOrders', response.data.results)
                commit('setCount', response.data.count)
            }).finally(() => {
				commit('changeLoading', false)
			});
        },
        fetchStoredOrder({ commit, state }, storedOrderId) {
            commit('changeLoading', true);
            this._vm.$api.addressBasedStorage.getStoredOrder(storedOrderId)
                .then((response) => {
                    commit('setEditableStoredOrder', response.data)
                })
                .finally(() => {
                    commit('changeLoading', false)
                });
        },
        createStoredOrder({ commit, state }, data) {
            commit('changeLoading', true)
            this._vm.$api.addressBasedStorage.createStoredOrder(data)
                .then((response) => {
                    console.log('createStoredOrder - ', response)
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
        resetEditableStoredOrder({ commit, state }) {
            commit('resetEditableStoredOrder')
        }
    },
}
