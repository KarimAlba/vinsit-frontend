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
						:disabled="filters.zone || filters.rack ? false : true"
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
						:disabled="filters.rack || filters.shelf ? false : true"
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
			<div class="mb-1 d-flex align-items-center justify-content-between">
				<span>
					Найдено: <b>{{ count }}</b>
				</span>
			</div>
			<b-table
				:items="stocks"
				:fields="fields"
				striped
				responsive
				@row-clicked="(stockVal) => handleStocksRowClicked(stockVal)"
			>
				<template #row-details="stockVal">
					<b-table
						:items="stockVal.zones"
						:fields="fields"
						striped
						responsive
						@row-clicked="(zoneVal) => handleZoneRowClicked(zoneVal)"
					>
						<template #row-details="zoneVal">
							<b-table
								:items="zoneVal.racks"
								:fields="fields"
								striped
								responsive
								@row-clicked="(rackVal) => handleZoneRowClicked(rackVal)"
							>
							</b-table>
						</template>
					</b-table>
                </template>

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
		BFormCheckbox,
		BImg,
	} from "bootstrap-vue";
	import { RoleConstants } from '@/utils/role';
	import store from "@/store/index";
	export default {
		data() {
			return {
				visible: false,
				fields: [
					{ key: "id", label: "ХРАНИЛИЩЕ" },
					{ key: "name", label: "ИМЯ" },
					{ key: "action", label: "ДЕЙСТВИЕ" },
					{ key: "show_details", label: "" },
				],
				//stocks: [],
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
			BFormCheckbox,
			BImg,
			BPagination,
			vSelect
		},
		directives: {
			"b-toggle": VBToggle,
		},
		watch: {
			stocks() {
				console.log(this.stocks)
			},
			filters: {
				handler() {
					if (!this.filters.zone) {
						this.filters.rack = null;
					}

					if (!this.filters.rack) {
						this.filters.shelf = null;
					}

					this.fetchStocks();
				},
				deep: true
			}
		},
		computed: {
			showPagination() {
				return Math.ceil(this.count / this.perPage) > 1;
			},
			readOnly() {
				return store.state.app.user.role !== RoleConstants.AD && store.state.app.user.role !== RoleConstants.LG;
			},
			...mapGetters({
				count: "moduleWarehouseTopology/getCount",
				filters: "moduleWarehouseTopology/getFilters",
				stocks: "moduleWarehouseTopology/getStocks",
			}),
		},
		methods: {
			...mapMutations({
				setFilters: "moduleWarehouseTopology/setFilters"
			}),
            ...mapActions({
				resetPagination: "moduleWarehouseTopology/resetPagination",
				resetFilters: "moduleWarehouseTopology/resetFilters",
				fetchStocks: "moduleWarehouseTopology/fetchStocks",
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
			handleStockRowClicked(stockVal) {
				//$set(stockVal, '_showDetails', !stockVal._showDetails)
				console.log(stockVal);
				this.$api.addressBasedStorage.getZones({ limit: 100, stock: stockVal.id })
                    .then((response) => {
                        stockVal.zones = [...response.data.results];
                        //loading(false);
                    });
			},
			handleZoneRowClicked(zoneVal) {
				//$set(zoneVal, '_showDetails', !zoneVal._showDetails)
				this.$api.addressBasedStorage.getRacks({ limit: 100, zone: zoneVal.id })
                    .then((response) => {
                        zoneVal.racks = [...response.data.results];
                        //loading(false);
                    });
			},
		},
		mounted() {
			this.fetchStocks();
		},
	};
</script>

<style lang="scss" scoped>
	.whiteBtn {
        border-radius: 4px;
        border: 1px solid var(--light-border-underline-inverted-border-color-underline-inverted, #6D7986);
    }

</style>
