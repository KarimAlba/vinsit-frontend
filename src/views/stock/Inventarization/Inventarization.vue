<template>
	<div>
		<b-card style="margin: 0 0 20px 0">
			<b-row>
				<b-col class="mb-1" cols="12" md="3">
					<b-form-group label="Дата последней операции">
						<b-form-datepicker
							label="Дата последней операции"
							v-model="filters.date_updated"
							placeholder="Дата"
						/>
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group label="Номер инвентаризации">
						<v-select
							label="id"
							:reduce="(item) => item.id"
							:options="inventarizationList"
							placeholder="Номер инвентаризации"
							:filterable="false"
							v-model="inventarizationId"
						>
							<template #no-options="{ search }">
								{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
							</template>
						</v-select>
					</b-form-group>
				</b-col>
				<b-col class="mb-1" cols="12" md="3">
					<b-form-group label="Офис склада">
						<select-offices
							:placeholder="'Офис склада'"
							v-model="filters.office"
							:allOfices="offices"
							:style="checkFilter ? 'border: 1px solid red' : null"
						/>
					</b-form-group>
				</b-col>
				<b-col class="mb-1" cols="12" md="3">
					<b-form-group label="Зона">
						<v-select
							label="name"
							@search="onSearchZone"
							:reduce="(item) => item.id"
							:options="zones"
							placeholder="Зона"
							:filterable="false"
							v-model="filters.zone"
							:disabled="filters.office ? false : true"
						>
							<template #no-options="{ search }">
								{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
							</template>
						</v-select>
					</b-form-group>
				</b-col>
				<b-col class="mb-1" cols="12" md="3">
					<b-form-group label="Стеллаж">
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
					</b-form-group>
				</b-col>
				<b-col class="mb-1" cols="12" md="3">
					<b-form-group label="Полка">
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
					</b-form-group>
				</b-col>
				<b-col class="mb-1" cols="12" md="3">
					<b-form-group label="Состояние">
						<v-select
							label="name"
							@search="onSearchState"
							:reduce="(status) => status.key"
							v-model="filters.status"
							:options="stateList"
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
					@click="getInventarizationListAndItems"
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
				<b-col cols="8">
					<b-row>
						<b-col cols="6" xl="3">
							<b-button
								size="sm"
								:variant="true ? 'outline-secondary' :'secondary'"
								class="btn-tour-skip  mb-1"
								style="height: 40px; width: 100%"
								@click="consumptionInventarization"
								disabled
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
								@click="exportInventarizationList"
								:disabled="inventarizationId ? false : true"
							>
								<span>Экспорт в CSV</span>
							</b-button>
						</b-col>
					</b-row>
					<b-table-simple
						:items="inventarizationItems"
						:fields="fields"
						striped
						responsive
						sticky-header

						:sort-by.sync="sortBy"
						:sort-desc.sync="sortDesc"
						:no-local-sorting="true"
						class="inventarizationTable"
					>
						<b-thead>
							<b-tr style="height: 30px">
								<b-th
									v-for="titleColumn in fields"
									:class="titleColumn.key === sortBy ? 'curSortByTh' : null"
									@click.prevent="sorting(titleColumn.key)"
								>
										<div style="position: relative;">
											<span class="disabledTitle">{{ titleColumn.label }}</span>
											<feather-icon
												v-if="titleColumn.key === sortBy"
												:icon="sortDesc ? 'ChevronUpIcon' : 'ChevronDownIcon'"
												size="12"
												@click.stop="sorting(titleColumn.key)"
												style="position: absolute; padding-top: 1px;"
											/>
										</div>
								</b-th>
							</b-tr>
						</b-thead>
						<b-tbody>
							<b-tr
								v-for="item in inventarizationItems"
								class="inventarizationTableNode"
								:style="item.status === 'MISSED'
									? 'background-color: rgba(255, 220, 220, 0.7) !important'
									: item.status === 'EXTRA'
										? 'background-color: rgba(239, 255, 173, 0.7) !important'
										: null
								"
							>
								<b-th class="inventarizationTableCell">{{ item.order ? item.order.id : null }}</b-th>
								<b-th>{{ item.SK }}</b-th>
								<b-th>{{ item.shelf ? item.shelf.name : null }}</b-th>
								<b-th>{{ item.date_created }}</b-th>
								<b-th>{{ item.docs_created }}</b-th>
								<b-th>{{ item.user_created }}</b-th>
								<b-th>{{ item.date_updated }}</b-th>
								<b-th>{{ item.docs_last_operation }}</b-th>
								<b-th>{{ item.user_last_operation }}</b-th>
								<b-th>{{ item.order_status ? item.order_status.name : null }}</b-th>
								<b-th>{{ item.OZD }}</b-th>
								<b-th>
									<div style="display: flex; justify-content: center; align-items: center">
										<feather-icon
											icon="CheckIcon"
											size="24"
											v-if="item.status === 'MISSED'"
										/>
									</div>
								</b-th>
								<b-th>
									<div style="display: flex; justify-content: center; align-items: center">
										<feather-icon
											icon="CheckIcon"
											size="24"
											v-if="item.status === 'SCANNED' || item.status === 'EXTRA'"
										/>
									</div>
								</b-th>
								<b-th>
									<div style="display: flex; justify-content: center; align-items: center">
										<feather-icon
											icon="CheckIcon"
											size="24"
											v-if="item.status === 'EXTRA'"
										/>
									</div>
								</b-th>
							</b-tr>
						</b-tbody>
					</b-table-simple>
				</b-col>
				<b-col cols="4">
					<b-row class="ml-1 mb-1" style="justify-content: flex-start">
						<span class="orders_counter" style="color: #000000">
							{{ statistic ? statistic.scanned : null }} Отсканировано
						</span>
						<span class="orders_counter" style="color: red">
							{{ statistic ? statistic.missed : null }} Недостача
						</span>
						<span class="orders_counter" style="color: #c0b818">
							{{ statistic ? statistic.extra : null }} Излишки
						</span>
					</b-row>
					<b-row class="mb-1">
						<b-col cols="9">
							<b-form-group label="Номер объекта складской обработки">
								<!-- <b-form-input v-model="numberLog" /> -->
								<!-- <select-orders
                                    :placeholder="'Номер заказа'"
                                    :value="numberLog"
                                    @input="chooseOrder($event)"
                                /> -->
								<v-select
									label="id"
									@search="(event) => searchOrder(event, null, this)"
									@input="chooseOrder"
									:options="inventarizationItemsOrders"
									:placeholder="'Номер заказа'"
									:filterable="false"
									:reduce="(c) => c.id"
									:value="numberLog"
								>
									<template #no-options="{ search }">
										{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
									</template>
								</v-select>
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
					<b-row>
						<b-card class="inventarizationLogs">
							<div style="padding-bottom: 10px">
								<p
									v-for="(log, log_index) in logs"
									:key="log_index"
									class="suggestion-group-title"
								>
									<span
										:style="log.type === 'success'
											? 'color: green'
											: log.type === 'error'
												? 'color: red'
												: null"
										>
											{{ log.log }}
										</span>
								</p>
							</div>
						</b-card>
					</b-row>
				</b-col>
			</b-row>
		</b-card>
	</div>
</template>

<script>
import InventorizationChannel from '../../../api/inventorizationChannel.js';
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

import { mapGetters, mapActions, mapMutations } from "vuex";
import { debounce } from "lodash";
import SelectOffices from "@/components/ui/selectOffices/selectOffices.vue";
import SelectOrders from "@/components/ui/selectOrder/selectOrder.vue";
import moment from "moment";
import downloadPdf from '../../../utils/downloadPdf';

import {
	BRow,
	BCol,
	BCard,
	BFormGroup,
	BFormInput,
	BFormCheckbox,
	BCollapse,
	BButton,
	BTableSimple,
	BThead,
	BTbody,
	BTfoot,
	BTh,
	BTd,
	BTr,
	VBToggle,
	BFormDatepicker,
} from "bootstrap-vue";
import vSelect from "vue-select";

export default {
	data() {
		return {
			checkFilter: false,
			visible: false,
			isInventarization: false,
			filters: {
				date_updated: null,
				office: null,
				zone: null,
				rack: null,
				shelf: null,
				status: null,
			},
			numberLog: null,
			zones: [],
			racks: [],
			shelves: [],
            offices: [],
			statistic: {
				total: 0,
				extra: 0,
				missed: 0,
				scanned: 0,
			},
			// scanned_orders: [],
			// shortage: [],
			// surplus: [],
			inventarizationNumber: null,
			inventarizationId: null,
			inventarizationList: [],
			inventarizationItems: [],
			inventarizationItemsOrders: [],
			stateList: [
				{
					name: 'Отсканировано',
					key: 'SCANNED',
				},
				{
					name: 'Недостача',
					key: 'MISSED',
				},
				{
					name: 'Излишки',
					key: 'EXTRA',
				},
			],
			fields: [
				// { key: "show_details", label: "" },
				{ key: "number", label: "Номер заказа", sortable: true},
				{ key: "SK", label: "ШК ГМ", sortable: false},
				{ key: "shelf", label: "Полка", sortable: true},
				{ key: "date_created", label: "Дата и время создания", sortable: true},
				{ key: "docs_created", label: "Документ создания", sortable: true},
				{ key: "user_created", label: "Пользователь создания", sortable: true},
				{ key: "date_updated", label: "Дата и время последней операции", sortable: true},
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

			logs: [],
            stockObjectNumber: null,
            inventarizationChannel: new InventorizationChannel(1),
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
		BTableSimple,
		BThead,
		BTbody,
		BTfoot,
		BTh,
		BTd,
		BTr,
		VBToggle,
		vSelect,
		BFormDatepicker,
		SelectOffices,
		SelectOrders,
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
		},
		'filters.office'(newValue) {
			this.fetchZone(newValue, null, this);
		},
		'filters.zone'(newValue) {
			this.fetchRack(newValue, null, this);
		},
		'filters.rack'(newValue) {
			this.fetchShelf(newValue, null, this);
		},
		'inventarizationId'(newValue) {
			this.getInventarizationItems(newValue);
		},
	},
	computed: {
		showPagination() {
            // return Math.ceil(this.count / this.perPage) > 1;
        },
		moment() {
			return moment;
		},
	},
	methods: {
		sorting(key) {
			if (this.fields.filter(item => item.sortable === true).findIndex(item => item.key === key) === -1) return;
			if (this.sortBy === key) {
				this.sortDesc = !this.sortDesc;
				return;
			}
			this.sortBy = key;
			this.sortDesc = false;
		},
		checkStatus(status) {
			if (status === 'SCANNED') return 'Отсканировано';
			if (status === 'EXTRA') return 'Излишки';
			if (status === 'MISSED') return 'Недостача';
		},
		async getInventarizationList() {
			const data = {
				limit: 1000,
				offset: 1,
				...this.filters,
			}
			await this.$api.inventorization.getInventorizations(data).then((response) => {
				console.log('response - ', response.data.results);
                this.inventarizationList = response.data.results;
            });
		},
		getInventarizationListAndItems() {
			this.getInventarizationList();
			this.getAllInventarizationItems();
		},
		async getAllInventarizationItems() {
			const data = {
				limit: 1000,
				offset: 1,
				...this.filters,
			}
			await this.$api.inventorization.getInventorizationItems(data).then((response) => {
				response.data.results = response.data.results.map(item => ({
					...item,
					date_created: moment(item.date_created).format("YYYY-MM-DD"),
					date_updated: moment(item.date_updated).format("YYYY-MM-DD"),
				}))
				console.log('response.data.results - ', response.data.results)
                this.inventarizationItems = response.data.results;
            });
		},
		async getInventarizationItems(id) {
			const data = {
				inventorization: id,
			};
			await this.$api.inventorization.getInventorizationItems(data).then((response) => {
				console.log('getInventarizationItems - ', response.data.results);
				response.data.results = response.data.results.map(item => ({
					...item,
					date_created: moment(item.date_created).format("YYYY-MM-DD"),
					date_updated: moment(item.date_updated).format("YYYY-MM-DD"),
				}))
                this.inventarizationItems = response.data.results;
            });
			this.getOrdersId();
		},
		getOrdersId() {
			this.inventarizationItemsOrders = this.inventarizationItems.map(item => item.order);
		},
		checkInventorizationItems() {
		},
		exportInventarizationList() {
			if (!this.inventarizationId) return;
			downloadPdf(
				`http://45.9.43.181:8001/api/v1/inventorization/${this.inventarizationId}/export_csv/`,
				`inventorization_${moment(Date.now()).format("YYYY-MM-DD")}_${this.inventarizationId}`
			);
		},
		resetFilters() {
			this.visible = false;
			this.filters = {
				date_updated: null,
				office: null,
				zone: null,
				rack: null,
				shelf: null,
				status: null,
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
		async createInventarization() {
			if (!this.filters.office) {
				this.checkFilter = true;
				this.$toast({
					component: ToastificationContent,
					props: {
						title: "Ошибка",
						text: "Выберите офис",
						icon: "XIcon",
						variant: "danger",
					},
				});
				return;
			};
			const data = {
				...this.filters,
				is_fulfillment: false,
			};
			await this.$api.inventorization.addNewInventorization(data).then((response) => {
				console.log('createInventarization - ', response);
                this.inventarizationId = response.data.id;
            });
			// this.getInventarizationbyId();
			this.getInventarizationItems(this.inventarizationId);
		},
		// getInventarizationbyId() {
		// 	this.$api.inventorization.getInventorizationById(this.inventarizationId).then((response) => {
        //         this.inventarizationItems = response.data.items;
        //     });
		// },
		startInventarization() {
			this.checkFilter = false;
			this.inventarizationList = [];
			this.inventarizationItems = [];
			this.createInventarization();
			if (this.checkFilter) return;
			this.isInventarization = true;
			this.inventarizationChannel.startConnection(this.addLogs, this.checkStatistic);
		},
		endInventarization() {
			this.isInventarization = false;
			this.inventarizationChannel.closeConnection();
		},
		updateStatistics() {
			this.getInventarizationItems(this.inventarizationId);
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
		checkStatistic(newStatistic) {
			console.log('statistic - ', newStatistic);
			this.statistic = newStatistic;
		},
		addLogs(newLog) {
			if (newLog.log === 'Процесс инвентаризации завершен!') {
				this.logs.push({ log: `${moment(Date.now()).format("HH:mm:ss")}: ${newLog.log}`, type: newLog.type });
				return;
			}
			this.logs.push(newLog);
		},
		clearLog() {
			this.logs = [];
		},
        async chooseOrder(id) {
			this.numberLog = id;
			// console.log(id);
			const data = {
				order_id: id,
			};
            await this.$api.inventorization.updateInventorizationStatus(this.inventarizationId, data).then((response) => {
				console.log('response - ', response);
                // this.inventarizationList = response.data.results;
            });
        },
		searchOrder: _.debounce((search, loading, vm) => {
			if (!search) return;
			if (!vm.inventarizationId) return;
            vm.chooseOrder(search);
        }, 200),
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
		this.fetchOffices();
		this.getInventarizationList();
		this.resetFilters();
	},
};
</script>

<style lang="scss" scoped>
.inventarizationTable {
	max-height: 575px;
}

.inventarizationTableNode {
}

.inventarizationTableCell {
}

.orders_counter {
	margin-right: 5px;
}

.disabledTitle {
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;
}

.inventarizationLogs {
	width: 100%;
	height: 500px;
	overflow: auto;
	background-color: #000000;
}

.table.b-table th {
	padding: 3px !important;
	align-items: center;
	text-align: center;
	border-bottom: 0;
	height: 10px;
}
</style>
