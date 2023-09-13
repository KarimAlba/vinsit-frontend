<template>
	<b-card style="margin: 0 0 0 -20px;">
		<b-row>
			<b-col class="mb-1" cols="12" md="4">
				<v-select
					label="search"
					placeholder="Поиск по"
					v-model="filters.search_fields"
					:reduce="(searchName) => search_fields.find(field => field.name === searchName).key"
					:options="search_fields.map((item) => item.name)"
				/>
			</b-col>
			<b-col cols="12" md="8">
				<b-form-input 
					placeholder="Поиск"
					v-model="filters.search"
					:disabled="filters.search_fields.length ? false : true"
				/>
			</b-col>
		</b-row>
		<b-collapse 
			v-model="visible" 
			id="filters-collapse"
			class="pt-1"
		>
			<b-row>
                <b-col class="mb-1" cols="12" md="4">
                    <v-select
						label="name"
                        @search="onSearchStock"
						:reduce="(item) => item.id"
						:options="stocks"
						placeholder="Склад"
						:filterable="false"
						v-model="filters.stock"
					>
						<template #no-options="{ search }">
							{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
						</template>
					</v-select>
                </b-col>
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
					>
						<template #no-options="{ search }">
							{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
						</template>
					</v-select>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<v-select
						label="name"
						@search="onSearchStatus"
						:reduce="(item) => item.id"
						:options="statuses"
						placeholder="Статус"
						:filterable="false"
						v-model="filters.status"
					>
						<template #no-options="{ search }">
							{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
						</template>
					</v-select>
				</b-col>
			</b-row>
		</b-collapse>
		<template #footer>
			<a 
				class="filter-orders__btn mr-1" 
				v-b-toggle="'filters-collapse'"
			>
				<feather-icon
					:icon="visible ? 'ChevronUpIcon' : 'ChevronDownIcon'"
					size="12"
				/>
				<span class="filter-orders__btn-text"> Все фильтры </span>
			</a>
			<a 
				class="filter-orders__btn" 
				@click="() => {
					resetFilters(), 
					fetchStoredOrders()
				}"
			>
				<feather-icon icon="XCircleIcon" size="12" />
				<span class="filter-orders__btn-text"> Сбросить все фильтры </span>
			</a>
		</template>
	</b-card>
</template>

<script>
	import { mapGetters, mapActions, mapMutations } from "vuex";
	import { debounce } from "lodash";

	import {
		BRow,
		BCol,
		BCard,
		BFormGroup,
		BFormInput,
		BFormCheckbox,
		BCollapse,
		VBToggle,
	} from "bootstrap-vue";
	import vSelect from "vue-select";

	export default {
		data() {
			return {
				visible: false,
                stocks: [],
                zones: [],
                racks: [],
                shelves: [],
                statuses: [],
				stockControlValue: null,
				zoneControlValue: null,
				rackControlValue: null,
				shelfControlValue: null,
				search_fields:  [
					{
						name: 'По номеру заказа',
						key: 'id'
					}, 
					{
						name: 'По дате создания',
						key: 'date_created'
					}, 
					{
						name: 'По названию офиса',
						key: 'office'
					}, 
					{
						name: 'ФИО оформителя',
						key: 'user_created'
					}
				],
				search: null,
			};
		},
		components: {
			BRow,
			BCol,
			BCard,
			BFormGroup,
			BFormInput,
			BFormCheckbox,
			BCollapse,
			VBToggle,
			vSelect
		},
		directives: {
			"b-toggle": VBToggle,
		},
		computed: {
			...mapGetters({
				filters: "moduleCargoRegistration/getFilters",
			}),
		},
		watch: {
			filters: {
				handler(val) {
					if (val.search && !val.search_fields?.length) return;
					this.controlFilters();
					this.resetPagination();
					this.fetchStoredOrders();
				},
				deep: true,
			},
			'search'(value) {
				this.handleSearchField(value, this);
			}
        },
		methods: {
			controlFilters() {
				if (this.filters.stock !== this.stockControlValue) {
					this.filters.zone = null
					this.stockControlValue = this.filters.stock
				}

				if (this.filters.zone !== this.zoneControlValue) {
					this.filters.rack = null
					this.zoneControlValue = this.filters.zone
				}

				if (this.filters.rack !== this.rackControlValue) {
					this.filters.shelf = null
					this.rackControlValue = this.filters.rack
				}

				if (this.filters.shelf !== this.shelfControlValue) {
					this.filters.status = null
					this.shelfControlValue = this.filters.shelf
				}
			},
			...mapMutations({
				setFilters: "moduleCargoRegistration/setFilters"
			}),
            ...mapActions({
				fetchStoredOrders: "moduleCargoRegistration/fetchStoredOrders",
				resetPagination: "moduleCargoRegistration/resetPagination",
				resetFilters: "moduleCargoRegistration/resetFilters",
			}),
            onSearchStock(search, loading) {
				if (search.length) {
					loading(true);
					this.fetchStocks(search, loading, this);
				}
            },
            fetchStocks: _.debounce((search, loading, vm) => {
				vm.$api.addressBasedStorage.getStocks({ search, limit: 100 })
                    .then((response) => {
                        vm.stocks = [...response.data];
                        loading(false);
                    });
			}, 500),
            onSearchZone(search, loading) {
				if (search.length) {
					loading(true);
					this.fetchZone(search, loading, this);
				}
            },
            fetchZone: _.debounce((search, loading, vm) => {
				vm.$api.addressBasedStorage.getZones({ search, limit: 100, stock: vm.filters.stock })
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
			onSearchStatus(search, loading) {
				if (search.length) {
					loading(true);
					this.fetchStatus(search, loading, this);
				}
            },
            fetchStatus: _.debounce(( loading, vm) => {
				vm.$api.addressBasedStorage.getStoredOrderStatus()
                    .then((response) => {
                        vm.statuses = [...response.data.results];
                        loading(false);
                    });
			}, 500),
			handleSearchField: _.debounce((value, vm) => {
				vm.filters.search = value;
			}, 500),
			fillOptions(vm) {
				vm.$api.addressBasedStorage.getStocks({ limit: 100 })
                    .then((response) => {
                        vm.stocks = [...response.data];
                    });
				vm.$api.addressBasedStorage.getZones({ limit: 100 })
                    .then((response) => {
                        vm.zones = [...response.data.results];
                    });
				vm.$api.addressBasedStorage.getRacks({ limit: 100 })
                    .then((response) => {
                        vm.racks = [...response.data.results];
                    });
				vm.$api.addressBasedStorage.getShelves({ limit: 100 })
                    .then((response) => {
                        vm.shelves = [...response.data.results];
                    });
                vm.$api.addressBasedStorage.getStoredOrderStatus({ limit: 100 })
                    .then((response) => {
                        vm.statuses = [...response.data.results];
                    });
			}
        },
		mounted() {
            this.resetFilters();
			this.resetPagination();
			this.fillOptions(this);
        },
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";

	.filter-orders {
		&__btn {
			display: inline-flex;
			align-items: center;

			&:hover {
				.filter-orders__btn-text {
					color: $primary;
					border-color: $primary;
				}
			}
		}

		&__btn-text {
			margin-left: 5px;
			border-bottom: 1px dashed #000;
		}
	}
</style>
