<template>
	<div>
		<b-card style="margin: 0 0 20px 0">
			<b-row>
				<b-col class="mb-1" cols="12" md="3">
					<b-form-group label="Дата последней операции">
						<b-form-datepicker
							label="Дата последней операции"
							v-model="filters.date_last_operation"
							placeholder="Дата"
						/>
					</b-form-group>
				</b-col>
				<b-col class="mb-1" cols="12" md="3">
					<b-form-group label="Адрес хранения">
						<b-form-input 
							placeholder="Зона, стеллаж, полка"
							v-model="filters.storage_address"
						/>
					</b-form-group>
				</b-col>
				<b-col class="mb-1" cols="12" md="3">
					<b-form-group label="Офис склада">
						<select-offices
							:placeholder="'Офис склада'"
							v-model="filters.current_office"
							:allOfices="offices"
						/>
					</b-form-group>
				</b-col>
				<b-col class="mb-1" cols="12" md="3">
					<b-form-group label="Состояние">
						<v-select
							label="name"
							@search="onSearchState"
							:reduce="(state) => state.id"
							v-model="filters.state"
							:options="states"
							:placeholder="'Состояние'"
							:filterable="false"
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row style="justify-content: flex-end">
				<b-button
					size="md"
					variant="outline-success"
					class="btn-tour-skip mb-1 mr-1"
					style="height: 40px; width: 140px"
					@click="clearLog"
				>
					<span>Найти</span>
				</b-button>
				<b-button
					size="md"
					variant="outline-secondary"
					class="btn-tour-skip mb-1 mr-1"
					style="height: 40px; width: 140px"
					@click="resetFilters"
				>
					<span>Очистить</span>
				</b-button>
			</b-row>
			<b-collapse 
				v-model="visible" 
				id="filters-collapse"
				class="pt-1"
			>
				<b-row>
				</b-row>
			</b-collapse>
			<!-- <template #footer>
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
					@click="resetFilters"
				>
					<feather-icon icon="XCircleIcon" size="12" />
					<span class="filter-orders__btn-text"> Сбросить все фильтры </span>
				</a>
			</template> -->
		</b-card>
		<b-card>
			<b-row>
				<b-col class="mb-1" cols="8">
					<b-row>
						<b-col cols="6" xl="3">
							<b-button
								size="sm"
								:variant="true ? 'outline-secondary' :'secondary'"
								class="btn-tour-skip  mb-1"
								style="height: 40px; width: 100%"
								@click="consumptionInventarization"
							>
								<span>Расход по инвентаризации</span>
							</b-button>
						</b-col>
						<b-col cols="6" xl="3">
							<b-button
								size="sm"
								:variant="isInventarization ? 'outline-primary' :'primary'"
								class="btn-tour-skip mb-1"
								style="height: 40px; width: 100%"
								:disabled="isInventarization"
								@click="startInventarization"
							>
								<span>Начать инвентаризацию</span>
							</b-button>
						</b-col>
						<b-col cols="6" xl="3">
							<b-button
								size="sm"
								:variant="!isInventarization ? 'outline-danger' :'danger'"
								class="btn-tour-skip mb-1"
								style="height: 40px; width: 100%"
								:disabled="!isInventarization"
								@click="endInventarization"
							>
								<span>Закончить инвентаризацию</span>
							</b-button>
						</b-col>
						<b-col cols="6" xl="3">
							<b-button
								size="sm"
								:variant="true ? 'success' :'success'"
								class="btn-tour-skip mb-1"
								style="height: 40px; width: 100%"
								@click="updateStatistics"
							>
								<span>Обновить статистику</span>
							</b-button>
						</b-col>
					</b-row>
					<b-row>
						<b-col cols="4" xl="2">
							<b-button
								size="sm"
								variant="outline-info"
								class="btn-tour-skip  mb-1"
								style="height: 40px; width: 100%"
								@click="handleExportCSVClick"
							>
								<span>Экспорт в CSV</span>
							</b-button>
						</b-col>
					</b-row>
					<b-table
						:items="inventarizationList"
						:fields="fields"
						striped
						responsive

						:sort-by.sync="sortBy"
						:sort-desc.sync="sortDesc"
						:no-local-sorting="true"
					>
						<template #cell(number)="data">
							<router-link
								style="border-bottom: 1px dotted blue"
								:to="{ name: 'order', params: { id: data.item.id }  }"
							>
								{{ data.item.number}}
							</router-link>
						</template>
					</b-table>
				</b-col>
				<b-col class="mb-1" cols="4">
					<b-row class="ml-1 mb-1" style="justify-content: flex-start">
						<span class="orders_counter" style="color: #000000">
							{{ scanned_orders ? scanned_orders.length : 0 }} Отсканировано
						</span>
						<span class="orders_counter" style="color: red">
							{{ shortage ? shortage.length : 0 }} Недостача
						</span>
						<span class="orders_counter" style="color: #c0b818">
							{{ surplus ? surplus.length : 0 }} Излишки
						</span>
					</b-row>
					<b-row class="mb-1">
						<b-col cols="9">
							<b-form-group label="Номер объекта складской обработки" style="color: red">
								<b-form-input v-model="numberLog" />
							</b-form-group>
						</b-col>
					</b-row>
					<b-button
						size="sm"
						variant="success"
						class="btn-tour-skip mb-1"
						style="height: 40px; width: 120px"
						@click="clearLog"
					>
						<span>Очистить лог</span>
					</b-button>
				</b-col>
			</b-row>
		</b-card>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import { debounce } from "lodash";
import SelectOffices from "@/components/ui/selectOffices/selectOffices.vue";

import {
	BRow,
	BCol,
	BCard,
	BFormGroup,
	BFormInput,
	BFormCheckbox,
	BCollapse,
	BButton,
	BTable,
	VBToggle,
	BFormDatepicker,
} from "bootstrap-vue";
import vSelect from "vue-select";

export default {
	data() {
		return {
			visible: false,
			isInventarization: false,
			filters: {
				date_last_operation: null,
				storage_address: null,
				warehouse_office: null,
				state: null,
			},
			numberLog: null,
            offices: [],
			states: [],
			scanned_orders: [],
			shortage: [],
			surplus: [],
			inventarizationList: [],
			fields: [
				{ key: "show_details", label: "" },
				{ key: "number", label: "Номер заказа", sortable: true},
				{ key: "SK", label: "ШК ГМ", sortable: false},
				{ key: "shelf", label: "Полка", sortable: true},
				{ key: "date_created", label: "Дата и время создания", sortable: true},
				{ key: "docs_created", label: "Документ создания", sortable: true},
				{ key: "user_created", label: "Пользователь создания", sortable: true},
				{ key: "date_last_operation", label: "Дата и время последней операции", sortable: true},
				{ key: "docs_last_operation", label: "Документ последней операции", sortable: true},
				{ key: "user_last_operation", label: "Пользователь последней операции", sortable: true},
				{ key: "status", label: "Статус", sortable: true},
				{ key: "OZD", label: "ОЗД", sortable: true},
				{ key: "shortage", label: "Недостача", sortable: true},
				{ key: "scanned", label: "Отсканировано", sortable: true},
				{ key: "surplus", label: "Излишки", sortable: true},
			],
			sortBy: 'number',
			sortDesc: false,
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
		BButton,
		BTable,
		VBToggle,
		vSelect,
		BFormDatepicker,
		SelectOffices,
	},
	directives: {
		"b-toggle": VBToggle,
	},
	watch: {
		'sortBy'(newValue) {
			if (!newValue) return;
			this.sortTable();
		},
		'sortDesc'(newValue) {
			this.sortTable();
		}
	},
	computed: {
	},
	methods: {
		resetFilters() {
			this.visible = false;
			this.filters = {
				date_last_operation: null,
				storage_address: null,
				warehouse_office: null,
			};
		},
        fetchOffices() {
            this.$api.office.getOffices({ limit: 100 }).then((response) => {
                this.offices = response.data;
            });
        },
		onSearchState() {
		},
		consumptionInventarization() {
		},
		startInventarization() {
			this.isInventarization = true;
		},
		endInventarization() {
			this.isInventarization = false;
		},
		updateStatistics() {
		},
        handleExportCSVClick() {
            this.$api.documents.exportCSV([18])
                .then(response => console.log(response))
                .catch(error => console.log(error))
        },
		sortTable() {
			// let ordering = this.checkSortName();

			// if (this.sortDesc) {
			// 	this.changeOrdering(ordering);
			// } else {
			// 	this.changeOrdering(`-${ordering}`);
			// }

			// this.resetPagination();
			// setTimeout(() => {
			// 	this.fetchPaymentOrders();
			// }, 0);
		},
		clearLog() {
			this.numberLog = null;
		},
	},
	mounted() {
		this.fetchOffices();
		this.resetFilters();
	},
};
</script>

<style lang="scss" scoped>
.orders_counter {
	margin-right: 5px;
}
</style>
