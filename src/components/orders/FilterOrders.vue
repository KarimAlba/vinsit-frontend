<template>
	<b-card>
		<b-row>
			<b-col class="mb-1" cols="12" md="4">
				<v-select
					label="search"
					placeholder="Поиск по"
					v-model="filters.search_fields"
					:reduce="(searchName) => search_fields.find(field => field.name === searchName).key"
					:options="search_fields.map((item) => item.name)"
				/>
				<!-- <b-form-input 
					placeholder="Номер заказа"
				/> -->
			</b-col>
			<b-col>
				<b-form-input 
					placeholder="Поиск"
					v-model="search"
				/>
			</b-col>
			<b-col class="mb-1" cols="12" md="4">
				<v-select
					label="title"
					:reduce="(mode) => mode.id"
					placeholder="Режим заказа"
					:options="orderMode"
					v-model="filters.mode"
				/>
				<!-- <v-select
					label="status"
					:reduce="(status) => status.id"
					placeholder="Статус заказа"
					:options="orderStatus"
					v-model="filters.status"
				/> -->
			</b-col>
		</b-row>
		<b-collapse v-model="visible" id="filters-collapse">
			<b-row>
				<b-col class="mb-1" cols="12" md="4">
					<select-clients
						:disabled="false"
						:disabledAddBtn="true"
						:reduce="(counterparty) => counterparty"
						:value="counterparty"
						@input="handleFilterFieldChange($event, 'counterparty')"
						placeholder="Контрагент"
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
						placeholder="Город отправителя"
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
						@search="onSearchCities"
						@close="resetCities"
						@input="(item) => filters.recipient_city = item ? item.id : null"
						:options="cities"
						placeholder="Город получателя"
						:filterable="false"
					>
						<template #no-options="{ search }">
							{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
						</template>
					</v-select>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<v-select
						label="status"
						:reduce="(status) => status.id"
						placeholder="Статус заказа"
						:options="orderStatus"
						v-model="filters.status"
					/>

				</b-col>
				<!-- <b-col class="mb-1" cols="12" md="4">
					<b-form-input
						placeholder="Телефон клиента"
						debounce="500"
						v-model="filters.sender_counterparty_client_phones_phone_number"
					/>
				</b-col> -->
				<b-col class="mb-1" cols="12" md="4">
					<app-datepicker
						placeholder="Дата проставления статуса"
						@selectedDates="changeDatesStatus"
					/>
					<!-- <v-select
						label="title"
						:reduce="(mode) => mode.id"
						placeholder="Режим заказа"
						:options="orderMode"
						v-model="filters.mode"
					/> -->
				</b-col>
				<!-- <b-col>
					<select-all-contracts
						:disabled="false"
						:reduce="(cont) => cont.id"
						:value="contract"
						@input="handleFilterFieldChange($event, 'contract')"
						v-model="filters.contract"
						placeholder="Договор"
						:disabledAddBtn="true"
					/>
				</b-col> -->
				<b-col class="mb-1" cols="12" md="4">
					<app-datepicker
						placeholder="Период заказа"
						@selectedDates="changeDatesCreated"
					/>
					<!-- <b-form-checkbox
						value="true"
						:unchecked-value="null"
						v-model="filters.recipient_has_passport"
					>
						Паспортные данные получателя<br />собраны
					</b-form-checkbox> -->
					
				</b-col>
				<!-- <b-col class="mb-1" cols="12" md="4">
					<b-form-checkbox
						value="false"
						:unchecked-value="null"
						v-model="filters.sender_has_passport"
					>
						Нет паспортных данных отправителя
					</b-form-checkbox>
				</b-col> -->
				<!-- <b-col class="mb-1" cols="12" md="4">
					<b-form-checkbox
						value="true"
						:unchecked-value="null"
						v-model="filters.from_amo_crm"
					>
						Оформлен моим ПВЗ
					</b-form-checkbox>
				</b-col> -->
				<b-col class="mb-1" cols="12" md="4">
					<b-form-checkbox
						value="true"
						:unchecked-value="null"
						v-model="filters.is_overdue"
					>
						Просрочка
					</b-form-checkbox>
				</b-col>
				<!-- <b-col class="mb-1" cols="12" md="4">
					<b-form-checkbox
						value="false"
						:unchecked-value="null"
						v-model="filters.recipient_has_passport"
					>
						Нет паспортных данных получателя
					</b-form-checkbox>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<b-form-checkbox
						value="true"
						:unchecked-value="null"
						v-model="filters.sender_has_passport"
					>
						Паспортные данные отправителя собраны
					</b-form-checkbox>
				</b-col> -->
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
	} from "bootstrap-vue";
	import vSelect from "vue-select";
	import { debounce } from "lodash";
	import AppDatepicker from "@/@core/components/app-datepicker/AppDatepicker";

	export default {
		data() {
			return {
				cities: [],
				orderStatus: [],
				visible: false,
				contract: null,
				counterparty: null,
				search_fields:  [
					{
						name: 'По договору',
						key: 'contract'
					}, 
					{
						name: 'По номеру заказа',
						key: 'id'
					}, 
					{
						name: 'По номеру телефона',
						key: 'phone_number'
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

			AppDatepicker,
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
						console.log('response status - ', response);
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
