<template>
	<div>
		<b-card>
			<b-row>
				<b-col class="mb-1" cols="12" md="4">
					<v-select
						label="name"
                        @search="onSearchZone"
						:reduce="(item) => item.id"
						:options="zones"
						placeholder="Зона"
						:filterable="false"
						v-model="filters.zone"
					>
						<template #no-options="{ search }">
							{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
						</template>
					</v-select>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<v-select
						label="name"
                        @search="onSearchRack"
						:reduce="(item) => item.id"
						:options="racks"
						placeholder="Стеллаж"
						:filterable="false"
						v-model="filters.rack"
						:disabled="filters.zone ? false : true"
					>
						<template #no-options="{ search }">
							{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
						</template>
					</v-select>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<v-select
						label="name"
						@search="onSearchShelf"
						:reduce="(item) => item.id"
						:options="shelves"
						placeholder="Полка"
						:filterable="false"
						v-model="filters.shelf"
						:disabled="filters.rack ? false : true"
					>
						<template #no-options="{ search }">
							{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
						</template>
					</v-select>
				</b-col>
			</b-row>
			<template #footer>
				<a 
					class="filter-orders__btn" 
					@click="() => resetFilters()"
				>
					<feather-icon icon="XCircleIcon" size="12" />
					<span class="filter-orders__btn-text"> Сбросить все фильтры </span>
				</a>
			</template>
		</b-card>
		<b-card style="margin-top: 20px;">
			<b-table
				:items="orders"
				:fields="fields"
				striped
				responsive
				@row-clicked="(item) => $set(item, '_showDetails', !item._showDetails)"
			>
			</b-table>
			<b-pagination
				v-if="showPagination"
				:total-rows="count"
				:per-page="perPage"
				@change="changePage"
				:value="curPage"
				align="right"
			/>
		</b-card>
	</div>
</template>

<script>
	import { mapGetters, mapActions, mapMutations } from "vuex";
	import vSelect from 'vue-select'
	import {
		BRow,
		BCol,
		BCard,
		BTable,
		BButton,
		BCollapse,
		VBToggle,
		BPagination,
		BIconXCircle,
		BImg,
	} from "bootstrap-vue";
	import { RoleConstants } from '@/utils/role';
	import store from "@/store/index";
	export default {
		data() {
			return {
				visible: false,
				fields: [
					{ key: "storage", label: "ХРАНИЛИЩЕ" },
					{ key: "name", label: "ИМЯ" },
					{ key: "action", label: "ДЕЙСТВИЕ" },
				],
				orders: [],
				zones: [],
                racks: [],
                shelves: []
			};
		},
		components: {
			BRow,
			BCol,
			BCard,
			BTable,
			BButton,
			BCollapse,
			BIconXCircle,
			BImg,
			BPagination,
			vSelect
		},
		directives: {
			"b-toggle": VBToggle,
		},
		watch: {
		},
		computed: {
			showPagination() {
				return Math.ceil(this.count / this.perPage) > 1;
			},
			readOnly() {
				return store.state.app.user.role !== RoleConstants.AD && store.state.app.user.role !== RoleConstants.LG;
			},
			...mapGetters({
				filters: "moduleWarehouseTopology/getFilters",
			}),
		},
		methods: {
			...mapMutations({
				setFilters: "moduleWarehouseTopology/setFilters"
			}),
            ...mapActions({
				fetchStoredOrders: "moduleWarehouseTopology/fetchStoredOrders",
				resetPagination: "moduleWarehouseTopology/resetPagination",
				resetFilters: "moduleWarehouseTopology/resetFilters",
			}),
			formatDate(date) {
				return this.dayjs(date).format("DD.MM.YYYY");
			},
			onSearchZone(search, loading) {
				if (search.length) {
					loading(true);
					this.fetchZone(search, loading, this);
				}
            },
            fetchZone: _.debounce((search, loading, vm) => {
				vm.$api.addressBasedStorage.getZones({ search, limit: 100 })
                    .then((response) => {
                        vm.zones = [...response.data.results];
                        loading(false);
                    });
			}, 500),
            onSearchRack(search, loading) {
				if (search.length) {
					loading(true);
					this.fetchRack(search, loading, this);
				}
            },
            fetchRack: _.debounce((search, loading, vm) => {
				vm.$api.addressBasedStorage.getRacks({ search, limit: 100, zone: vm.filters.zone })
                    .then((response) => {
                        vm.racks = [...response.data.results];
                        loading(false);
                    });
			}, 500),
            onSearchShelf(search, loading) {
				if (search.length) {
					loading(true);
					this.fetchShelf(search, loading, this);
				}
            },
            fetchShelf: _.debounce((search, loading, vm) => {
				vm.$api.addressBasedStorage.getShelves({ search, limit: 100, rack: vm.filters.rack })
                    .then((response) => {
                        vm.shelves = [...response.data.results];
                        loading(false);
                    });
			}, 500),
		},
		mounted() {
		},
	};
</script>

<style lang="scss" scoped>
	.whiteBtn {
        border-radius: 4px;
        border: 1px solid var(--light-border-underline-inverted-border-color-underline-inverted, #6D7986);
    }

</style>
