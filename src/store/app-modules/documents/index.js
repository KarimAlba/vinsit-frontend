export default {
    namespaced: true,
    state: {
        documents: [],
        document: {
            next_destination_office: 0,
            seal_number: null,
            current_office: null,
            doc_close_datetime: null,
            provided_by: null,
            final_destination_office: 0,
            orders: [],
            note: null,
            type: null,
        },
        editableDocument: {},

        count: 0,
        loading: false,
        filters: {
            date_created_after: null,
            office: null,
            stock: null,
            issued_by: null,
            type: null,
            doc_close_datetime: null,
            current_office: null,
            final_destination_office: null,
            note: null,
            provided_by: null,
            orders: null,
            next_destination_office: null,
            seal_number: null,
            date_created_exact: null,
            doc_close_datetime_exact: null,
            search: null,
            search_fields: null,
        },
        curPage: 1,
        countPerPage: 10,
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
        getLoading: (state) => {
            return state.loading
        }
    },
    mutations: {
        setDocuments(state, payload) {
            state.documents = payload
        },
        setDocument(state, payload) {
            state.document = payload;
            state.editableDocument = {
                ...payload,
            };
        },
        setEditableDocument(state, payload) {
            state.editableDocument = payload;
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
                const document = {
                    ...response.data,
                    // next_destination_office: response.data.next_destination_office.id,
                    current_office: response.data.current_office.id,
                    provided_by: response.data.provided_by.id,
                    issued_by: response.data.issued_by.id,
                    // final_destination_office: response.data.final_destination_office.id,
                    product_type: response.data.is_fulfillment ? "Фулфилмент" : "Логистика",
                    clientType: response.data.issued_by ? "Сотрудник" : response.data.issued_by_client ? "Клиент" : null,
                    seals: response.data.seals[0].id,
                }
                console.log(document)
                commit('setDocument', document)
            })
                .finally(() => {
                    commit('changeLoading', false)
                });
        },
        // createDocument({ commit, state }) {
        //     commit('changeLoading', true)
        //     const data = {
        //         note: 'test 2',
        //         type: 1,
        //         current_office: 1,
        //         origin_office: 1,
        //         final_destination_office: 1,
        //         provided_by: 2,
        //         next_destination_office: 1,
        //         orders: [
        //             27
        //         ]
        //     }
        //     this._vm.$api.documents.createDocument(data).then((response) => {
        //         console.log('createDocument - ', response)
        //         // commit('setDocument', response.data)
        //     })
        //         .finally(() => {
        //             commit('changeLoading', false)
        //         });
        // },
        resetPagination({ commit, state }) {
            commit('resetPagination')
        },
        resetFilters({ commit, state }) {
            commit('resetFilters')
        }
    },
}
