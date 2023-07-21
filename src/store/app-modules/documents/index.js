export default {
    namespaced: true,
    state: {
        documents: [],
        document: {},
        editableDocument: {},

        count: 0,
        loading: false,
        filters: {
            search: null,
        },
        curPage: 1,
        countPerPage: 10,
        // placeStatus: [
        //     { id: "D", title: "Вручено", color: "success" },
        //     { id: "U", title: "Не вручено", color: "primary" },
        //     { id: "C", title: "Отменен", color: "secondary" },
        // ],
        // documentMode: [
        //     { id: "DD", title: "дверь-дверь" },
        //     { id: "DS", title: "дверь-склад" },
        //     { id: "SD", title: "склад-дверь" },
        // ],
        // documentType: [
        //     { id: "D", title: "Доставка" },
        //     { id: "C", title: "Забор груза" },
        // ],
    },
    getters: {
        getDocuments: (state) => {
            return state.documents
        },
        getDocument: (state) => {
            return state.document
        },
        getEditableDocument: (state) => {
            return state.editableDocument
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
        // getPlaceStatus: (state) => {
        //     return state.placeStatus
        // },
        // getDocumentMode: (state) => {
        //     return state.documentMode
        // },
        // getDocumentType: (state) => {
        //     return state.documentType
        // },
        getLoading: (state) => {
            return state.loading
        }
    },
    mutations: {
        setDocuments(state, payload) {
            state.documents = payload
        },
        setDocument(state, payload) {
            // console.log(payload);
            state.document = payload;
            state.editableDocument = {
                ...payload,
            };
        },
        setEditableDocument(state, payload) {
            state.editableDocument = payload;
        },
        // setTotalPrice(state, payload) {
        //     state.document.total_price = payload;
        //     state.editableDocument.total_price = payload;
        // },
		// setDocumentSender(state, payload) {
		// 	// console.log(payload);
		// 	if (!state.document.sender_counterparty) return;
		// 	state.document.sender_counterparty.id = payload.id
		// 	state.document.sender_counterparty.name = payload.name
		// },
		// setDocumentRecipient(state, payload) {
		// 	if (!state.document.recipient_counterparty) return;
		// 	state.document.recipient_counterparty.id = payload.id
		// 	state.document.recipient_counterparty.name = payload.name
		// },
        // addDocumentPhones(state, payload) {
        //     state.document[`${payload.prefix}_counterparty`].client_phones.unshift(payload.phone);
        // },
        // deleteDocumentPhone(state, payload) {
        //     state.document[`${payload.prefix}_counterparty`].client_phones.splice(payload.index, 1);
        // },
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
            state.documents = []
            state.count = 0
        },
        changeLoading(state, payload) {
            state.loading = payload
        }
    },
    actions: {
        fetchDocuments({ commit, state }) {
            commit('changeLoading', true);
            commit('resetData');

            this._vm.$api.documents.getDocuments({
                ...state.filters,
                offset: ((state.curPage - 1) * state.countPerPage),
                limit: state.countPerPage
            }).then((response) => {
				// console.log('response - ', response);
                commit('setDocuments', response.data.results)
                commit('setCount', response.data.count)
            }).finally(() => {
				commit('changeLoading', false)
			});
        },
        fetchDocument({ commit, state }, idDocument) {
            commit('changeLoading', true)

            this._vm.$api.documents.getDocument(idDocument).then((response) => {
                // console.log('documentzresponse - ', response.data)
                commit('setDocument', response.data)
            })
                .finally(() => {
                    commit('changeLoading', false)
                });
        },
        createDocument({ commit, state }, idDocument) {
            commit('changeLoading', true)
            const data = {
                note: 'test 2',
                type: 1,
                current_office: 1,
                origin_office: 1,
                final_destination_office: 1,
                provided_by: 2,
                next_destination_office: 1,
                orders: [
                    27
                ]
            }
            this._vm.$api.documents.createDocument(data).then((response) => {
                console.log('createDocument - ', response)
                // commit('setDocument', response.data)
            })
                .finally(() => {
                    commit('changeLoading', false)
                });
        },
        // fetchTotalPrice({ commit, state }, idDocument) {
        //     commit('changeLoading', true)

        //     this._vm.$api.documents.getDocument(idDocument).then((response) => {
        //         // console.log('documentzresponse - ', response.data)
        //         commit('setTotalPrice', response.data.total_price)
        //     })
        //         .finally(() => {
        //             commit('changeLoading', false)
        //         });
        // },
		// setDocumentSenderCounterPartyId({ commit, state }, senderId) {
		// 	commit('setDocumentSenderId', senderId);
		// },
		// setDocumentRecipientCounterPartyId({ commit, state }, recipientId) {
		// 	commit('setDocumentRecipientId', recipientId);
		// },
        resetPagination({ commit, state }) {
            commit('resetPagination')
        },
        resetFilters({ commit, state }) {
            commit('resetFilters')
        }
    },
}