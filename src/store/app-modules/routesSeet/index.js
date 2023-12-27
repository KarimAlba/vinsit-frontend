export default {
    namespaced: true,
    state: {
        tasks: [],

        count: 0,
        loading: false,

        filters: {
            date: null,
            city: null,
            office: null,
        },

        curPage: 1,
        countPerPage: 10,
    },
    getters: {
       
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
        fetchMaps({ commit, state }) {
            commit('changeLoading', true);
            commit('resetData');

            this._vm.$api.couriers.getCourierMaps({
                ...state.filters,
                offset: ((state.curPage - 1) * state.countPerPage),
                limit: state.countPerPage
            }).then((response) => {
                commit('setMaps', response.data.results)
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
