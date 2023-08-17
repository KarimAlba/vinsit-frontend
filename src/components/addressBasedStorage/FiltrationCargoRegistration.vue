<template>
	<b-card>
		<b-collapse v-model="visible" id="filters-collapse">
			<b-row>
                <b-col class="mb-1" cols="12" md="4">
                    <v-select
						label="name"
                        @search="onSearchStock"
						:options="stocks"
						placeholder="Склад"
						:filterable="false"
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
						@input="(item) => filters.zone = item ? item.id : null"
						:options="zones"
						placeholder="Зона"
						:filterable="false"
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
						@input="(item) => filters.rack = item ? item.id : null"
						:options="racks"
						placeholder="Стеллаж"
						:filterable="false"
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
						@input="(item) => filters.shelf = item ? item.id : null"
						:options="shelves"
						placeholder="Полка"
						:filterable="false"
					>
						<template #no-options="{ search }">
							{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
						</template>
					</v-select>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<v-select
						label="name"
						@search="onSearchStock"
						@input="(item) => filters.status = item ? item.id : null"
						:options="statuses"
						placeholder="Статус"
						:filterable="false"
					>
						<template #no-options="{ search }">
							{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
						</template>
					</v-select>
				</b-col>
			</b-row>
		</b-collapse>
		<template #footer>
			<a class="filter-orders__btn mr-1" v-b-toggle="'filters-collapse'">
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
	import { mapGetters, mapActions } from "vuex";
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
				search: null,
                stocks: [],
                zones: [],
                racks: [],
                shelves: [],
                statuses: []
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
		watch: {
            stocks() {
                console.log(this.$data.stocks);
            }
        },
		computed: {
			...mapGetters({
				orderMode: "moduleOrders/getOrderMode",
				filters: "moduleCargoRegistration/getFilters",
			}),
		},
		methods: {
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
        },
		mounted() {
            this.resetFilters();
			this.resetPagination();
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
