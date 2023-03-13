<template>
	<b-card-actions title="История заказа" actionCollapse>
		<b-row align-h="between">
			<b-col cols="3"> Всего изменений: {{ totalRows }} </b-col>
			<b-col cols="7">
				<b-row>
					<b-col cols="7">
						<select-filter-type
							label="type"
							:reduce="(type) => type.key"
							:items="types"
							placeholder="Фильтр"
							v-model="type"
						/>
					</b-col>
					<b-col cols="5">
						<b-form-input
							class="mb-2"
							placeholder="Поиск"
							v-model="filter"
							debounce="500"
						/>
					</b-col>
				</b-row>
			</b-col>
		</b-row>
		<b-table
			id="table-history-orders"
			:items="history"
			:fields="fields"
			striped
			responsive
			:per-page="perPage"
			:current-page="currentPage"
			:filter="filter"
			@filtered="filteredTable"
		>
			<template #cell(history_content)="data">
				<p>
					<template v-if="data.item.oldValue">
						Поле <b>{{ data.item.valByKeyObj }}</b> изменено c
						<b>{{ data.item.oldValue }}</b> на <b>{{ data.item.newValue }}</b>
					</template>
					<template v-else>
						Полю <b>{{ data.item.valByKeyObj }}</b> добавлено новое значение
						<b>{{ data.item.newValue }}</b>
					</template>
				</p>
			</template>
            <template #cell(history_user)="data">
				{{ data.item.history_user }}
			</template>
			<template #cell(history_date)="data">
				{{ formatDate(data.item.history_date) }}
			</template>
		</b-table>
		<b-pagination
			v-model="currentPage"
			:total-rows="totalRows"
			:per-page="perPage"
			aria-controls="table-history-orders"
		/>
	</b-card-actions>
</template>

<script>
	import _ from "lodash";
	import { mapGetters } from "vuex";
	import {
		BRow,
		BCol,
		BCard,
		BFormInput,
		BTable,
		BButton,
		BBadge,
		BPagination,
	} from "bootstrap-vue";
	import BCardActions from "@/@core/components/b-card-actions/BCardActions.vue";
	import SelectFilterType from "@/components/ui/selectFilterType/selectFilterType.vue";
	import vSelect from "vue-select";
    import '@/libs/dayjs'

	export default {
		props: {
			idOrder: {
				type: [Number, String],
				required: true,
			},
		},
		data() {
			return {
				perPage: 20,
				currentPage: 1,
				totalRows: 0,
				filter: "",
				fields: [
					{ key: "history_date", label: "Дата изменения" },
					{ key: "history_user", label: "Пользователь" },
					{ key: "history_content", label: "Информация" },
				],
				type: null,
				types: [
                    {
						name: "Все",
						key: "Все",
					},
					{
						name: "По штрихкоду",
						key: "Штрихкод",
					},
					{
						name: "По ФИО отправителя",
						key: "ФИО отправителя",
					},
					{
						name: "По городу отправителя",
						key: "Город отправителя",
					},
                    {
						name: "По городу плательщика",
						key: "Город плательщика",
					},
					{
						name: "По городу получателя",
						key: "Город получателя",
					},
					{
						name: "По контрагенту плательщика",
						key: "Контрагент плательщика",
					},
					{
						name: "По изменению статуса",
						key: "Статус",
					},
					{
						name: "По дате",
						key: "Дата",
					},
				],
				fieldsForHistory: {
					places: "Места в заказе",
					total_weight: "Вес",
					order_products: "Товары в заказе",
					amo_crm_id: "AMO CRM ID",
					name: "Name",
					status_changed_date: "Дата изменения статуса",
					type: "Тип заказа",
					mode: "Режим заказа",
					location: "Местоположение",
					pay_on_order: "Наложенный платеж",
					contract: "Договор",
					comment: "Примечание",
					total_price: "Итоговая стоимость",
					delivery_price: "Стоимость доставки",
					delivery_date: "Дата доставки",
					barcode: "Штрихкод",
					date_created: "Дата создания",
					sender_passport_series: "Серия паспорта отправителя",
					sender_passport_no: "Номер паспорта отправителя",
					sender_counterparty_type: "Тип контрагента отправителя",
					sender_address: "Адрес отправителя",
					sender_full_name: "ФИО отправителя",
					recipient_passport_series: "Серия паспорта получателя",
					recipient_passport_no: "Номер паспорта получателя",
					recipient_counterparty_type: "Тип контрагента получателя",
					recipient_address: "Адрес получателя",
					recipient_full_name: "ФИО получателя",
					recipient_email: "Email получателя",
					status: "Статус",
					sender_counterparty: "Контрагент отправителя",
					sender_city: "Город отправителя",
					recipient_counterparty: "Контрагент получателя",
					recipient_city: "Город получателя",
					payer_counterparty: "Контрагент плательщика",
					payer_city: "Город плательщика",
				},
				orderStatus: [],
				history: [],
				initialHistory: [],
			};
		},
		components: {
			BRow,
			BCol,
			BCard,
			BTable,
			BButton,
			BBadge,
			BCardActions,
			BPagination,
			BFormInput,

			SelectFilterType,
			vSelect,
		},
		watch: {
			type(newType, oldType) {
				if (!newType || newType === 'Все') {
					this.clearFilterHistory();
					return;
				};
				
				const filter = this.types[this.types.findIndex(filter => filter.key === newType)].key;
				this.filterHistoryArr(filter);
			}
		},
		computed: {
			...mapGetters({
				orderMode: "moduleOrders/getOrderMode",
				orderType: "moduleOrders/getOrderType",
				clientType: "moduleClients/getClientType",
			}),
			
		},
		methods: {
			fetchOrderHistory() {
				this.$api.orders.getOrderHistory(this.idOrder).then((response) => {
					this.createHistoryArr(response.data.history);
				});
			},
			getColorStatus(status) {
				return (
					this.orderStatus.find((x) => x.title === status)?.color || "secondary"
				);
			},
			formatDate(date) {
                // console.log(date);
				return this.dayjs(date).format("DD.MM.YYYY HH:mm");
			},
			fetchStatus() {
				this.$api.orderStatus.getOrderStatusList().then((response) => {
					this.orderStatus = response.data.results;
				});
			},
			getClientType(clientType) {
				return this.clientType.find((type) => type.id === clientType)?.short_title;
			},
			createHistoryArr(array) {
				let arr = [];
				for (let index = 0; index < array.length; index++) {
					let changes = _.differenceWith(
						_.toPairs(array[index + 1]),
						_.toPairs(array[index]),
						_.isEqual
					);

					changes.forEach(async (change) => {
						if (_.has(this.fieldsForHistory, change[0])) {
							let key = change[0],
							valByKeyObj = this.fieldsForHistory[key],
							oldValue = array[index][key],
							newValue = array[index + 1][key],
							history_date = array[index].history_date,
							history_user = array[index].history_user;

                            // console.log('oldValue - ', oldValue, 'newValue - ', newValue, 'key - ', key)
							// history_date = array[index].status_changed_date;

							if (key === "mode") {
								if (oldValue) oldValue = this.orderMode.find((x) => x.id === oldValue).title;
								newValue = this.orderMode.find((x) => x.id === newValue).title;
							};
							if (key === "type") {
								if (oldValue) oldValue = this.orderType.find((x) => x.id === oldValue).title;
								newValue = this.orderType.find((x) => x.id === newValue).title;
							};
							if (
								key === "recipient_counterparty_type" ||
								key === "sender_counterparty_type"
							) 	{
									if (oldValue) oldValue = this.clientType.find((x) => x.id === oldValue).title;
									newValue = this.clientType.find((x) => x.id === newValue).title;
								};
							if (key === "status") {
								if (oldValue) oldValue = this.orderStatus.find( (x) => x.id === oldValue).status;
								newValue = this.orderStatus.find((x) => x.id === newValue).status;
							};
							if (key === "payer_city" || key === "recipient_city" || key === "sender_city") {
                                const ids_list = [];
                                newValue ? ids_list.push(newValue) : null;
                                oldValue ? ids_list.push(oldValue) : null;
								await this.$api.cities.getCitiesById({ids_list})
									.then((response) => {
                                        if (newValue) {
                                            newValue = response.data.find(c => c.id === newValue).name;
                                        } else {
                                            newValue = '-';
                                        }
										if (oldValue) {
                                            oldValue = response.data.find(c => c.id === oldValue).name;
                                        }
									})
									.catch((error) => {})
							}
                            if (key === "payer_counterparty" || key === "recipient_counterparty" || key === "sender_counterparty") {
								await this.$api.clients.getClient(newValue)
                                    .then((response) => {
                                        newValue = response.data.name;
                                });
                                await this.$api.clients.getClient(oldValue)
                                    .then((response) => {
                                    oldValue = response.data.name;
                                });
							};
							arr.push({ valByKeyObj, oldValue, newValue, history_date, history_user });
						}
					});
				}
				this.totalRows = arr.length;
				this.initialHistory = arr;
				this.history = this.initialHistory;
			},
			filteredTable(filteredItems) {
				this.totalRows = filteredItems.length;
				this.currentPage = 1;
			},
			filterHistoryArr(filter) {
				this.clearFilterHistory();
				this.history = this.initialHistory.filter(story => story.valByKeyObj === filter);
                this.totalRows = this.history.length;
			},
			clearFilterHistory() {
				this.history = this.initialHistory;
                this.totalRows = this.initialHistory.length;
			},
		},
		mounted() {
			this.fetchOrderHistory();
			this.fetchStatus();
		},
	};
</script>
