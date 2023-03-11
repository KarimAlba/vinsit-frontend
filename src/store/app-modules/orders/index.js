export default {
    namespaced: true,
    state: {
        orders: [],
        order: {},

        count: 0,
        loading: false,
        filters: {
            date_created_after: null,
            date_created_before: null,
            status: null,

            sender__city: null,
            recipient__city: null,

            sender__counterparty__client_phones__phone_number: null,
            status_changed_date_after: null,
            status_changed_date_before: null,
            recipient_has_passport: null,
            sender_has_passport: null,
            from_amo_crm: null,
            is_overdue: null,
            mode: null,
            search: null,
        },
        curPage: 1,
        countPerPage: 20,
        placeStatus: [
            { id: "D", title: "Вручено", color: "success" },
            { id: "U", title: "Не вручено", color: "primary" },
            { id: "C", title: "Отменен", color: "secondary" },
        ],
        orderMode: [
            { id: "DD", title: "дверь-дверь" },
            { id: "DS", title: "дверь-склад" },
            { id: "SD", title: "склад-дверь" },
        ],
        orderType: [
            { id: "D", title: "Доставка" },
            { id: "C", title: "Забор груза" },
        ],
    },
    getters: {
        getOrders: (state) => {
            return state.orders
        },
        getOrder: (state) => {
            return state.order
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
        getPlaceStatus: (state) => {
            return state.placeStatus
        },
        getOrderMode: (state) => {
            return state.orderMode
        },
        getOrderType: (state) => {
            return state.orderType
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
            state.order = payload
        },
		setOrderSender(state, payload) {
			console.log(payload);
			if (!state.order.sender_counterparty) return;
			state.order.sender_counterparty.id = payload.id
			state.order.sender_counterparty.name = payload.name
		},
		setOrderRecipient(state, payload) {
			if (!state.order.recipient_counterparty) return;
			state.order.recipient_counterparty.id = payload.id
			state.order.recipient_counterparty.name = payload.name
		},
        setCount(state, payload) {
            state.count = payload
        },
        changePage(state, payload) {
            state.curPage = payload
        },
        resetFilters(state) {
            state.filters = {
                date_created_after: null,
                date_created_before: null,
                status: null,

                sender__city: null,
                recipient__city: null,

                sender__counterparty__client_phones__phone_number: null,
                status_changed_date_after: null,
                status_changed_date_before: null,
                recipient_has_passport: null,
                sender_has_passport: null,
                from_amo_crm: null,
                is_overdue: null,
                mode: null,
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
            commit('changeLoading', true)
            commit('resetData')

            this._vm.$api.orders.getOrders({ ...state.filters, offset: ((state.curPage - 1) * state.countPerPage) }).then((response) => {
                commit('setOrders', response.data.results)
                commit('setCount', response.data.count)
            })
                .finally(() => {
                    commit('changeLoading', false)
                });
        },
        fetchOrder({ commit, state }, idOrder) {
            commit('changeLoading', true)

            this._vm.$api.orders.getOrder(idOrder).then((response) => {
                commit('setOrder', response.data)
            })
                .finally(() => {
                    commit('changeLoading', false)
                });
        },
		setOrderSenderCounterPartyId({ commit, state }, senderId) {
			commit('setOrderSenderId', senderId);
		},
		setOrderRecipientCounterPartyId({ commit, state }, recipientId) {
			commit('setOrderRecipientId', recipientId);
		},
        resetPagination({ commit, state }) {
            commit('resetPagination')
        },
        resetFilters({ commit, state }) {
            commit('resetFilters')
        }
    },
}