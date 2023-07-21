<template>
	<b-card>
		<b-row>
			<b-col class="mb-1" md="4">
				<b-form-group>
                    <b-form-datepicker
                        label="date"
                        v-model="filter.date_created"
						placeholder="Дата создания"
                        @input="changeOrder($event, 'delivery_date')"
                    />
                </b-form-group>
			</b-col>
			<b-col cols="12" md="4">
				<b-form-input 
					placeholder="Номер грузоместа"
					v-model="filter.number_place"
				/>
			</b-col>
			<b-col cols="12" md="4">
				<b-form-input 
					placeholder="Офис склада"
					v-model="filter.office"
				/>
			</b-col>
		</b-row>
		<b-collapse v-model="visible" id="filters-collapse">
			<b-row>
                <b-col class="mb-1" md="4">
					<b-form-input 
						placeholder="Из офиса"
						v-model="filter.from_office"
					/>
                </b-col>
				<b-col class="mb-1" cols="12" md="4">
					<select-clients
						:disabled="false"
						:disabledAddBtn="true"
						:reduce="(counterparty) => counterparty"
						:value="filter.counterparty"
						@input="handleFilterFieldChange($event, 'counterparty')"
						placeholder="Оформил"
						:clearable="false"
					/>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<v-select
						label="name"
						@search="onSearchCities"
						@close="resetCities"
						@input="(item) => filters.sender_city = item ? item.id : null"
						:options="cities"
						placeholder="Тип документа"
						:filterable="false"
						:value="filter.type"
					>
						<template #no-options="{ search }">
							{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
						</template>
					</v-select>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<b-form-input 
						placeholder="Номер п.п"
						v-model="filter.number_p"
					/>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<b-form-input 
						placeholder="Номер заказов"
						v-model="filter.number_order"
					/>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<b-form-input 
						placeholder="Номер документова"
						v-model="filter.number_document"
					/>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<b-form-input 
						placeholder="Номер пломбы"
						v-model="filter.number_seal"
					/>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<b-form-input 
						placeholder="В офис"
						v-model="filter.in_office"
					/>
				</b-col>
				<b-col class="mb-1" cols="12" md="4" align-v="center">
					<b-form-checkbox
						value="true"
						:unchecked-value="null"
						v-model="filters.is_overdue"
					>
						Только открытые документы
					</b-form-checkbox>
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
					fetchOrders()
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
	import SelectAllContracts from "@/components/ui/selectAllContracts/selectAllContracts.vue";
	import SelectClients from "@/components/ui/selectClients/selectClients.vue";

	import {
		BRow,
		BCol,
		BCard,
		BFormGroup,
		BFormInput,
		BFormCheckbox,
		BCollapse,
		VBToggle,
		BFormDatepicker
	} from "bootstrap-vue";
	import vSelect from "vue-select";
	import { debounce } from "lodash";
	import AppDatepicker from "@/@core/components/app-datepicker/AppDatepicker";

	export default {
		data() {
			return {
				filter: {
					date_created: null,
					number_place: null,
					office: null,
					from_office: null,
					counterparty: null,
					type: null,
					number_p: null,
					number_order: null,
					number_document: null,
					number_seal: null,
					in_office: null,
					is_overdue: null,
				},
				visible: false,
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

			AppDatepicker,
			BFormDatepicker,
			vSelect,
			SelectAllContracts,
			SelectClients,
		},
		directives: {
			"b-toggle": VBToggle,
		},
		watch: {
			filters: {
				handler(val) {
					if (val.search && !val.search_fields?.length) return;
					this.resetPagination();
					this.fetchOrders();
					// this.resetPagination();
				},
				deep: true,
			},
			'search'(value) {
				this.handleSearchField(value, this);
			}
		},
		computed: {
			...mapGetters({
				orderMode: "moduleOrders/getOrderMode",
				filters: "moduleOrders/getFilters",
			}),
		},
		methods: {
			...mapActions({
				fetchOrders: "moduleOrders/fetchOrders",
				resetPagination: "moduleOrders/resetPagination",
				resetFilters: "moduleOrders/resetFilters",
			}),
			changeDatesCreated(dates) {
				this.filters.date_created_after = this.dayjs(dates.start).format( "YYYY-MM-DD");
				this.filters.date_created_before = this.dayjs(dates.end).format("YYYY-MM-DD");
			},
			changeDatesStatus(dates) {
				this.filters.status_changed_date_after = this.dayjs(dates.start).format("YYYY-MM-DD");
				this.filters.status_changed_date_before = this.dayjs(dates.end).format("YYYY-MM-DD");
			},
			onSearchCities(search, loading) {
				if (search.length) {
					loading(true);
					this.fetchCities(search, loading, this);
				}
			},
			fetchCities: _.debounce((search, loading, vm) => {
				vm.$api.cities.getCities({ search, limit: 100 }).then((response) => {
					vm.cities = response.data.results;
					loading(false);
				});
			}, 500),
			resetCities() {
				this.cities = [];
			},
			fetchStatus() {
				this.$api.orderStatus.getOrderStatusList({limit: 10, offset: 0})
					.then((response) => {
						// console.log('response status - ', response);
						this.orderStatus = response.data.results;
				});
			},
			handleFilterFieldChange(value, key) {
				if (key === 'counterparty') {
					value ? this.counterparty = value.id : null;
					this.filters[key] = value ? value.name : null;
					return;
				}
                this[key] = value;
            },
			handleSearchField: _.debounce((value, vm) => {
				vm.filters.search = value;
			}, 500),
		},
		mounted() {
			this.resetFilters();
			this.resetPagination();
			this.fetchStatus();
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

