export default {
    namespaced: true,
    state: {
        orders: [],
        order: {},
        editableOrder: {},

        count: 0,
        loading: false,
        filters: {
            date_created_after: null,
            date_created_before: null,
            status: null,

            sender_city: null,
            recipient_city: null,

            sender__counterparty__client_phones__phone_number: null,
            status_changed_date_after: null,
            status_changed_date_before: null,
            recipient_has_passport: null,
            sender_has_passport: null,
            from_amo_crm: null,
            is_overdue: null,
            mode: null,
            search: null,

			// contract: null,
			counterparty: null,
			search_fields: [],
        },
        curPage: 1,
        countPerPage: 10,
        ordering: '-date_created',
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
        getPlaceStatus: (state) => {
            return state.placeStatus
        },
        getOrdering: (state) => {
            return state.ordering
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
            // console.log(payload);
            state.order = payload;
            state.editableOrder = {
                ...payload,
                recipient_counterparty: payload.recipient_counterparty ? payload.recipient_counterparty.id : null,
                sender_counterparty: payload.sender_counterparty ? payload.sender_counterparty.id : null,
                payer_counterparty: payload.payer_counterparty ? payload.payer_counterparty.id : null,
                contract: payload.contract ? payload.contract.id : null,
                payer_city: payload.payer_city ? payload.payer_city.id : null,
                recipient_city: payload.recipient_city ? payload.recipient_city.id : null,
                sender_city: payload.sender_city ? payload.sender_city.id : null,
            };
        },
        setEditableOrder(state, payload) {
            state.editableOrder = payload;
        },
        setTotalPrice(state, payload) {
            state.order.total_price = payload;
            state.editableOrder.total_price = payload;
        },
		setOrderSender(state, payload) {
			// console.log(payload);
			if (!state.order.sender_counterparty) return;
			state.order.sender_counterparty.id = payload.id
			state.order.sender_counterparty.name = payload.name
		},
		setOrderRecipient(state, payload) {
			if (!state.order.recipient_counterparty) return;
			state.order.recipient_counterparty.id = payload.id
			state.order.recipient_counterparty.name = payload.name
		},
        addOrderPhones(state, payload) {
            state.order[`${payload.prefix}_counterparty`].client_phones.unshift(payload.phone);
        },
        deleteOrderPhone(state, payload) {
            state.order[`${payload.prefix}_counterparty`].client_phones.splice(payload.index, 1);
        },
        changeOrdering(state, payload) {
            state.ordering = payload
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
	
				sender_city: null,
				recipient_city: null,
	
				sender__counterparty__client_phones__phone_number: null,
				status_changed_date_after: null,
				status_changed_date_before: null,
				recipient_has_passport: null,
				sender_has_passport: null,
				from_amo_crm: null,
				is_overdue: null,
				mode: null,
				search: null,
	
				// contract: null,
				counterparty: null,
				search_fields: [],
            }
        },
        resetPagination(state) {
            state.curPage = 1;
        },
        resetData(state) {
            state.orders = [];
            state.count = 0;
        },
        changeLoading(state, payload) {
            state.loading = payload
        },
        resetOrdering(state) {
            state.ordering = null
        },
    },
    actions: {
        fetchOrders({ commit, state }) {
            commit('changeLoading', true);

            this._vm.$api.orders.getOrders({
                ...state.filters,
                ordering: state.ordering,
                offset: ((state.curPage - 1) * state.countPerPage),
                limit: state.countPerPage
            }).then((response) => {
				// console.log('response - ', response);
                commit('setOrders', response.data.results)
                commit('setCount', response.data.count)
            }).finally(() => {
				commit('changeLoading', false)
			});
        },
        fetchOrder({ commit, state }, idOrder) {
            commit('changeLoading', true)

            this._vm.$api.orders.getOrder(idOrder).then((response) => {
                // console.log('orderzresponse - ', response.data)
                commit('setOrder', response.data)
            })
                .finally(() => {
                    commit('changeLoading', false)
                });
        },
        fetchTotalPrice({ commit, state }, idOrder) {
            commit('changeLoading', true)

            this._vm.$api.orders.getOrder(idOrder).then((response) => {
                // console.log('orderzresponse - ', response.data)
                commit('setTotalPrice', response.data.total_price)
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
        },
        resetOrdering({ commit, state }) {
            commit('resetOrdering')
        },

    },
}
