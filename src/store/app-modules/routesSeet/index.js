export default {
    namespaced: true,
    state: {
        courierMap: {},
        mapOrders: [],

        count: 0,
        loading: false,

        filters: {
            date: null,
            city: null,
            office: null,
            courierMap: null,
        },

        curPage: 1,
        countPerPage: 10,
    },
    getters: {
        getMapOrders: (state) => {
            return state.mapOrders
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
        setCourierMap(state, payload) {
            state.courierMap = payload;
            state.filters.courierMap = payload.id
        },
        setMapOrders(state, payload) {
            state.mapOrders = payload;
        },
        setCount(state, payload) {
            state.count = payload
        },
        changePage(state, payload) {
            state.curPage = payload
        },
        resetFilters(state) {
            state.filters = {
                date: null,
                city: null,
                office: null,
                courierMap: null,
            }
        },
        resetPagination(state) {
            state.curPage = 1;
        },
        changeLoading(state, payload) {
            state.loading = payload
        }
    },
    actions: {
        // fetchMaps({ commit, state }) {
        //     commit('changeLoading', true);
        //     commit('resetData');

        //     this._vm.$api.couriers.getCourierMaps({
        //         ...state.filters,
        //         offset: ((state.curPage - 1) * state.countPerPage),
        //         limit: state.countPerPage
        //     }).then((response) => {
        //         commit('setMaps', response.data.results)
        //         commit('setCount', response.data.count)
        //     }).finally(() => {
		// 		commit('changeLoading', false)
		// 	});
        // },
        fetchMap({ commit, state }, idMap) {
            commit('changeLoading', true);

            this._vm.$api.couriers.getCourierMap(idMap).then((response) => {
                commit('setCourierMap', response.data);
                commit('setMapOrders', response.data.orders);
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
