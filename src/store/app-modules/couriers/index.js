export default {
    namespaced: true,
    state: {
        maps: [],
        map: {
        },

        count: 0,
        loading: false,
        filters: {
            id: null,
            date_created: "",
            office: null,
            courier: null,
            group: null,
            macrozone: null,
        },
        curPage: 1,
        countPerPage: 10,
    },
    getters: {
        getMaps: (state) => {
            return state.maps
        },
        getMap: (state) => {
            return state.map
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
        setMaps(state, payload) {
            state.maps = payload
        },
        setMap(state, payload) {
            state.map = payload;
        },
        setCount(state, payload) {
            state.count = payload
        },
        changePage(state, payload) {
            state.curPage = payload
        },
        resetFilters(state) {
            state.filters = {
                id: null,
                date_created: "",
                office: null,
                courier: null,
                group: null,
                macrozone: null,
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
        fetchMap({ commit, state }, id) {
            commit('changeLoading', true)

            this._vm.$api.couriers.getCourierMap(id).then((response) => {
                commit('setMap', response.data)
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
