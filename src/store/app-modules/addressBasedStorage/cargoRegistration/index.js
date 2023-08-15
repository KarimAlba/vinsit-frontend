export default {
    namespaced: true,
    state: {
        orders: [],
        order: {},
        editableOrder: {},
        count: 0,
        loading: false,
        filters: {
            search: null,
        },
        curPage: 1,
        countPerPage: 10,
    },
    getters: {
        getOrders: (state) => {
            return state.orders
        },
        getOrder: (state) => {
            return state.order
        },
        getEditableOrder: (state) => {
            return state.editableOrder
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
        setOrders(state, payload) {
            state.orders = payload
        },
        setOrder(state, payload) {
            state.order = payload;
            state.editableOrder = {
                ...payload,
            };
        },
        setEditableOrder(state, payload) {
            state.editableOrder = payload;
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
            }
        },
        resetPagination(state) {
            state.curPage = 1;
        },
        resetData(state) {
            state.orders = []
            state.count = 0
        },
        changeLoading(state, payload) {
            state.loading = payload
        }
    },
    actions: {
        fetchOrders({ commit, state }) {
            commit('changeLoading', true);
            commit('resetData');

            this._vm.$api.cargoRegistration.getOrders({
                ...state.filters,
                offset: ((state.curPage - 1) * state.countPerPage),
                limit: state.countPerPage
            }).then((response) => {
                commit('setOrders', response.data.results)
                commit('setCount', response.data.count)
            }).finally(() => {
				commit('changeLoading', false)
			});
        },
        fetchOrder({ commit, state }, orderId) {
            commit('changeLoading', true);
            this._vm.$api.cargoRegistration.getOrder(orderId)
                .then((response) => {
                    commit('setOrder', response.data)
                })
                .finally(() => {
                    commit('changeLoading', false)
                });
        },
        createOrder({ commit, state }, orderId) {
            commit('changeLoading', true)
            const data = {
                zone: 0,
                rack: 0,
                shelf: 0,
                status: 0,
                orders: [
                    0
                ]
            }
            this._vm.$api.documents.createOrder(data)
                .then((response) => {
                    console.log('createOrder - ', response)
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
