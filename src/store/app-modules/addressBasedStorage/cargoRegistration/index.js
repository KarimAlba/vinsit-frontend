export default {
    namespaced: true,
    state: {
        storedOrders: [],
        storedOrder: {},
        editableStoredOrder: {},
        count: 0,
        loading: false,
        search: null,
        filters: {
            stock: null,
            zone: null,
            rack: null,
            shelf: null,
            status: null
        },
        curPage: 1,
        countPerPage: 10,
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
        }
    },
    mutations: {
        setStoredOrders(state, payload) {
            state.storedOrders = payload
        },
        setOrder(state, payload) {
            state.storedOrder = payload;
            state.editableStoredOrder = {
                ...payload,
            };
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
            for (let key in state.filters) {
                state.filters[key] = null
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
        setStock(state, payload) {
            state.filters.stock = payload;
        },
        setZone(state, payload) {
            state.filters.zone = payload;
        },
        setRack(state, payload) {
            state.filters.rack = payload;
        },
        setShelf(state, payload) {
            state.filters.shelf = payload;
        },
        setStatus(state, payload) {
            state.filters.status = payload;
        }
    },
    actions: {
        fetchStoredOrders({ commit, state }) {
            commit('changeLoading', true);
            commit('resetData');

            this._vm.$api.cargoRegistration.getStoredOrders({
                ...state.filters,
                offset: ((state.curPage - 1) * state.countPerPage),
                limit: state.countPerPage
            }).then((response) => {
                commit('setStoredOrders', response.data.results)
                commit('setCount', response.data.count)
            }).finally(() => {
				commit('changeLoading', false)
			});
        },
        fetchStoredOrder({ commit, state }, storedOrderId) {
            commit('changeLoading', true);
            this._vm.$api.cargoRegistration.getStoredOrder(storedOrderId)
                .then((response) => {
                    commit('setStoredOrder', response.data)
                })
                .finally(() => {
                    commit('changeLoading', false)
                });
        },
        createStoredOrder({ commit, state }, storedOrderId) {
            commit('changeLoading', true)
            const data = {
                stock: 0,
                zone: 0,
                rack: 0,
                shelf: 0,
                status: 0,
                storedOrders: [
                    0
                ]
            }
            this._vm.$api.cargoRegistration.createStoredOrder(data)
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
        }
    },
}
