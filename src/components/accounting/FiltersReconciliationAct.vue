<template>
	<b-card>
		<b-row>
			<b-col class="mb-1" cols="12" md="4">
				<b-form-group>
					<b-form-input
						placeholder="Номер"
						v-model="filters.number"
					></b-form-input>
				</b-form-group>
			</b-col>
		</b-row>
		<!-- <b-collapse v-model="visible" id="filters-collapse">
			<b-row>
				<b-col class="mb-1" cols="12" md="4">
					<v-select
						label="type"
						placeholder="Тип поручения"
						v-model="filters.type"
						:reduce="(type) => orderType.find(item => item.name === type).key"
						:options="orderType.map((item) => item.name)"
					/>
				</b-col>
			</b-row>
		</b-collapse> -->
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
					resetInputs(),
					fetchPaymentOrders()
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
				// visible: false,
				// number: null,
				// counterparty: null,
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
					this.resetPagination();
					this.fetchPaymentOrders();
				},
				deep: true,
			},
			'search'(value) {
				this.handleSearchField(value, this);
			}
		},
		computed: {
			...mapGetters({
				filters: "moduleAccountingBank/getFilters",
			}),
		},
		methods: {
			...mapActions({
				// fetchPaymentOrders: "moduleAccountingBank/fetchPaymentOrders",
				// resetPagination: "moduleAccountingBank/resetPagination",
				// resetFilters: "moduleAccountingBank/resetFilters",
			}),
			resetInputs() {
				this.counterparty = null;
			},
			// changeDatesCreated(dates) {
			// 	this.filters.date_created_after = this.dayjs(dates.start).format( "YYYY-MM-DD");
			// 	this.filters.date_created_before = this.dayjs(dates.end).format("YYYY-MM-DD");
			// },
			// handleFilterFieldChange(value, key) {
			// 	if (key === 'counterparty') {
			// 		value ? this.counterparty = value.id : null;
			// 		this.filters[key] = value ? value.id : null;
			// 		// console.log('counterparty fil', value.name, value.id)
			// 		return;
			// 	}
            //     this[key] = value;
            // },
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
