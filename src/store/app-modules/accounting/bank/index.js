export default {
    namespaced: true,
    state: {
        paymentOrders: [],
        paymentOrder: {},

        count: 0,
        loading: false,
        curPage: 1,
        countPerPage: 20,

        filters: {
            date_created_after: null,
            date_created_before: null,
            number: null,
			counterparty: null,
        },

        total_income: null,
        total_outcome: null,
    },
    getters: {
        getPaymentOrders: (state) => {
            return state.paymentOrders
        },
        getPaymentOrder: (state) => {
            return state.paymentOrder
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
        getTotalIncome: (state) => {
            return state.total_income
        },
        getTotalOutcome: (state) => {
            return state.total_outcome
        },
    },
    mutations: {
        setPaymentOrders(state, payload) {
            state.paymentOrders = payload
        },
        setPaymentOrder(state, payload) {
            console.log(payload);
            state.paymentOrder = payload;
        },
        setCount(state, payload) {
            state.count = payload
        },
        setTotalIncome(state, payload) {
            state.total_income = payload
        },
        setTotalOutcome(state, payload) {
            state.total_outcome = payload
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
        },
        resetFilters(state) {
            state.filters = {
                date_created_after: null,
                date_created_before: null,
                number: null,
                counterparty: null,
            }
        },
    },
    actions: {
        fetchPaymentOrders({ commit, state }) {
            commit('changeLoading', true);
            commit('resetData');

            this._vm.$api.bank.getPaymentOrders({
                ...state.filters,
                offset: ((state.curPage - 1) * state.countPerPage),
                limit: state.countPerPage
            }).then((response) => {
                commit('setPaymentOrders', response.data.results)
                commit('setCount', response.data.count)
                commit('setTotalIncome', response.data.total_income)
                commit('setTotalOutcome', response.data.total_outcome)
            }).finally(() => {
				commit('changeLoading', false)
			});
        },
        fetchPaymentOrder({ commit, state }, idOrder) {
            commit('changeLoading', true)

            this._vm.$api.bank.getPaymentOrder(idOrder).then((response) => {
                commit('setPaymentOrder', {
                    ...response.data,
                    sum: +(response.data.sum) < 0 ? -(+(response.data.sum)) : response.data.sum,
                    contracts: 
                        response.data.contracts.length 
                            ? 
                            response.data.contracts.map((item) => ({contract: item, accounts: ['']}))
                            :
                            [{contract: '', accounts: ['']}]
                })
                console.log('orderzresponse - ', state.paymentOrder)
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