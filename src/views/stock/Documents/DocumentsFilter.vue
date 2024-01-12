<template>
	<b-card>
		<b-row>
			<b-col class="mb-1" cols="12" md="4">
				<v-select
					label="name"
					placeholder="Поиск по"
					v-model="filters.search_fields"
					:reduce="(search) => search.search"
					:options="search_fields"
				/>
			</b-col>
			<b-col cols="12" md="8">
				<b-form-input 
					debounce="500"
					:disabled="!filters.search_fields"
					placeholder="Поиск"
					v-model="filters.search"
				/>
			</b-col>
		</b-row>
		<b-collapse v-model="visible" id="filters-collapse">
			<b-row>
				<b-col class="mb-1" md="4">
					<b-form-group>
						<b-form-datepicker
							label="date"
							v-model="filters.date_created_after"
							placeholder="Дата создания(после)"
							
						/>
					</b-form-group>
				</b-col>
				<!-- <b-col cols="12" md="4">
					<b-form-input 
						placeholder="Номер грузоместа"
						v-model="filter.number_place"
					/>
				</b-col> -->
				<b-col cols="12" md="4">
					<b-form-group>
						<select-offices
							:placeholder="'Офис склада'"
							v-model="filters.stock"
						/>
					</b-form-group>
				</b-col>
				<b-col class="mb-1" md="4">
					<b-form-group>
						<select-offices
							:placeholder="'Из офиса'"
							v-model="filters.office"
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row>
				<b-col class="mb-1" cols="12" md="4">
					<select-clients
						:disabled="false"
						:disabledAddBtn="true"
						:reduce="(counterparty) => counterparty"
						:value="counterparty"
						@input="handleFilterFieldChange($event, 'counterparty')"
						placeholder="Оформил"
						:clearable="false"
					/>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<v-select
						label="name"
						:options="types"
						:reduce="(types) => types.type"
						placeholder="Тип документа"
						v-model="filters.type"
					>
						<template #no-options="{ search }">
							{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
						</template>
					</v-select>
				</b-col>
				<!-- <b-col class="mb-1" cols="12" md="4">
					<b-form-input 
						placeholder="Номер п.п"
						v-model="filter.number_p"
					/>
				</b-col> -->
				<b-col class="mb-1" cols="12" md="4">
					<b-form-input 
						debounce="500"
						placeholder="Номер заказов"
						v-model="filters.orders"
					/>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<b-form-input 
						debounce="500"
						placeholder="Номер пломбы"
						v-model="filters.seal_number"
					/>
				</b-col>
				<b-col class="mb-1" cols="12" md="4">
					<b-form-group>
						<select-offices
							:placeholder="'В офис'"
							v-model="filters.final_destination_office"
						/>
					</b-form-group>
				</b-col>
				<!-- <b-col class="mb-1" cols="12" md="4" align-v="center">
					<b-form-checkbox
						value="true"
						:unchecked-value="null"
						v-model="filters.is_overdue"
					>
						Только открытые документы
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
					resetInputs(),
					resetFilters(), 
					fetchDocuments()
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
	//import { debounce } from "lodash";
	import AppDatepicker from "@/@core/components/app-datepicker/AppDatepicker";
	import SelectOffices from "@/components/ui/selectOffices/selectOffices.vue";

	export default {
		data() {
			return {
				search_fields: [
					{name: 'Номер заказа', search: 'id'},
					// {name: 'Дата создания', search: 'date_created'},
					{name: 'Офис', search: 'office'},
					{name: 'Склад', search: 'stock'},
					{name: 'ФИО выдавшего', search: 'issued_by'},
					// {name: 'Тип', search: 'type'},
					// {name: 'Дата закрытия', search: 'doc_close_datetime'},
					{name: 'Текущий офис', search: 'current_office'},
					{name: 'Конечный офис', search: 'final_destination_office'},
					{name: 'Примечание', search: 'note'},
					{name: 'ФИО предоставившего', search: 'provided_by'},
					{name: 'Номер заказа', search: 'orders'},
					{name: 'Следующий офис', search: 'next_destination_office'},
					{name: 'Номер пломбы', search: 'seal_number'},
				],
				counterparty: null,
				visible: false,
				types: [
					{
						type: 'PR',
						name: 'Приход',
					},
					{
						type: 'CN',
						name: 'Консолидация',
					},
					{
						type: 'DE',
						name: 'Выдача на доставку',
					},
					{
						type: 'AC',
						name: 'Расконсолидация',
					},
				]
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
			SelectOffices,
		},
		directives: {
			"b-toggle": VBToggle,
		},
		watch: {
			filters: {
				handler(val) {
					this.resetPagination();
					this.fetchDocuments();
				},
				deep: true,
			},
		},
		computed: {
			...mapGetters({
				filters: "moduleDocuments/getFilters",
			}),
		},
		methods: {
			...mapActions({
				fetchDocuments: "moduleDocuments/fetchDocuments",
				resetPagination: "moduleDocuments/resetPagination",
				resetFilters: "moduleDocuments/resetFilters",
			}),
			resetInputs() {
				this.counterparty = null;
			},
			changeDatesCreated(dates) {
				this.filters.date_created_after = this.dayjs(dates.start).format( "YYYY-MM-DD");
				this.filters.date_created_before = this.dayjs(dates.end).format("YYYY-MM-DD");
			},
			handleFilterFieldChange(value, key) {
				if (key === 'counterparty') {
					value ? this.counterparty = value.id : null;
					this.filters.provided_by = value ? value.id : null;
					this.fetchDocuments();
					console.log('counterparty fil', this.filters.provided_by)
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

