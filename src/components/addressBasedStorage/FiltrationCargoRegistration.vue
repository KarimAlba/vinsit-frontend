<template>
	<b-card style="margin-left: -20px;">
		<b-form-input 
			class=""
			placeholder="Номер заказа"
			@input="onSearchInput"
			v-model="filters.search"
		/>
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
				handler() {
					console.log(this.filters);
					this.fetchStoredOrders();
				},
				deep: true,
			}
        },
		methods: {
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
				vm.$api.cargoRegistration.getStocks({ search, limit: 100 })
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
				vm.$api.cargoRegistration.getZones({ search, limit: 100 })
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
				vm.$api.cargoRegistration.getRacks({ search, limit: 100 })
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
				vm.$api.cargoRegistration.getShelves({ search, limit: 100 })
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
            fetchStatus: _.debounce((search, loading, vm) => {
				vm.$api.cargoRegistration.getStoredOrderStatus({ search, limit: 100 })
                    .then((response) => {
						console.log(response);
                        vm.statuses = [...response.data.results];
                        loading(false);
                    });
			}, 500),
			onSearchInput() {
				this.setFilters({...this.filters, search: event.target.value});
				console.log(this.filters)
			},
			createStoredOrder() {
				this.$api.cargoRegistration.createStoredOrder({
					zone: 1,
					rack: 1,
					shelf: 1,
					status: 1,
					orders: [24]
				})
				.then((response) => {
					console.log(response);
					loading(false);
				})
				.catch((error) => console.log(error));
			}
        },
		mounted() {
            this.resetFilters();
			this.resetPagination();
			//this.createStoredOrder();
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
