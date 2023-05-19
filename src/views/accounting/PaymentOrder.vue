<template>
	<section class="order pb-5">
		<b-overlay :show="loading" rounded="sm">
			<b-row>
				<h3 v-if="idPaymentOrder">{{editPaymentOrder.type == 'O' ? 'Исходящее платежное поручение' : 'Входящее платежное поручение'}}</h3>
				<h3 v-if="!idPaymentOrder">{{ typePaymentOrder == 'O' ? 'Исходящее платежное поручение' : 'Входящее платежное поручение'}}</h3>
				
				<b-col class="" cols="2">
					<b-form-group>
						<b-form-input
							v-model="editPaymentOrder.number"
						></b-form-input>
					</b-form-group>
				</b-col>

				<h3>от</h3>

				<b-col class="mb-1" cols="2">
					<b-form-group label="">
						<b-form-datepicker
							v-if="!idPaymentOrder"
							placeholder=""
							:disabled="!!idPaymentOrder"
							:date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
							label="date"
							v-model="date"
						/>
						<b-form-datepicker
							v-if="idPaymentOrder"
							placeholder=""
							:disabled="!!idPaymentOrder"
							:date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
							label="date"
							:value="this.dayjs(this.editPaymentOrder.date_created).format('YYYY-MM-DD')"
						/>
					</b-form-group>
				</b-col>
				<b-col class="mb-1" cols="2">
					<b-form-group label="">
						<b-form-timepicker
							v-if="!idPaymentOrder"
							placeholder=""
							:disabled="!!idPaymentOrder"
							label="date"
							v-model="time"
						/>
						<b-form-timepicker
							v-if="idPaymentOrder"
							placeholder=""
							:disabled="!!idPaymentOrder"
							label="date"
							:value="this.dayjs(this.editPaymentOrder.date_created).format('HH:mm')"
						/>
					</b-form-group>
				</b-col>
			</b-row>

			<validation-observer>
			<b-card-actions actionCollapse>
				<b-row>
					<span class="badge" v-bind:class="{'badge-green': bank.check}">Проведен</span>
					<!-- <span class="badge">Получен из банка 10,02,2001</span>
					<span class="badge">Был выгружен 10,02,2001</span> -->
				</b-row>
				<b-row>
					<b-col cols="12" md="7">
						<b-col class="mb-1" cols="12">
							<validation-provider #default="{ errors }" rules="required">
								<b-form-group :invalid-feedback="errors[0]" :state="!errors.length" label="Операция">
									<v-select
										label="name"
										:reduce="(operation) => operation.id"
										placeholder="Операция"
										:options="financialTransactions"
										v-model="editPaymentOrder.financial_transaction"
									/>
								</b-form-group>
							</validation-provider>
						</b-col>

						<b-col cols="12">
							<b-form-group label="Исполнитель">
								<v-select
									label="full_name_and_type"
									:reduce="(executor) => executor.id"
									v-model="editPaymentOrder.executor"
									:options="executors"
									:placeholder="'Исполнитель'"
								>
								</v-select>
							</b-form-group>
						</b-col>
						
						<!-- <b-col class="mb-1" cols="12">
							<validation-provider #default="{ errors }" rules="required">
								<b-form-group :invalid-feedback="errors[0]" :state="!errors.length" label="Ваш расчетный счет">
									<v-select
										label="name"
										:reduce="(operation) => operation.id"
										placeholder="Ваш расчетный счет"
										:options="checkingAccounts"
										v-model="editPaymentOrder.checking_account"
									/>
								</b-form-group>
							</validation-provider>
						</b-col> -->

						<b-col class="mb-1">
							<b-form-group label="Поставщик">
								<select-clients
									placeholder="Поставщик"
									:reduce="(client) => client.id"
									v-model="editPaymentOrder.counterparty"
            						@input="handleCounterparty($event)"
									:disabled="readOnly"
									:clearSearchOnBlur="false"
								/>
							</b-form-group>
						</b-col>

						<b-col class="mb-1" cols="12">
							<validation-provider #default="{ errors }" rules="required">
								<b-form-group label="Расчетный счет">
									<b-form-input
										label="title"
										:disabled="!editPaymentOrder.counterparty"
										:placeholder="editPaymentOrder.counterparty ? 'Расчетный счет' : 'Выберите поставщика для отображения счета'"
										v-model="bank_account"
									></b-form-input>
								</b-form-group>
								<!-- <b-form-group :invalid-feedback="errors[0]" :state="!errors.length" label="Расчетный счет">
									<v-select
										label="title"
										:disabled="!bank.counterparty"
										:reduce="(operation) => operation.id"
										:placeholder="bank.counterparty ? 'Расчетный счет' : 'Выберите поставщика для отображения счета'"
										:options="selectBank.checking_account"
										v-model="bank.checking_account"
									/>
								</b-form-group> -->
							</validation-provider>
						</b-col>
					</b-col>
					<b-col cols="5">
						<b-row class="">
							<CustomCheckbox v-model="editPaymentOrder.is_completed"/>
							<span class="px-1">Проведен</span>
						</b-row>
						<b-row v-if="editPaymentOrder.is_completed" class="d-flex flex-column">
							<b-row class="mt-2">
								<b-col class="mb-1" cols="5">
									<b-form-group label="">
										<b-form-datepicker
											v-if="!idPaymentOrder"
											placeholder=""
											:disabled="!!idPaymentOrder"
											:date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
											label="date"
											v-model="date"
										/>
										<b-form-datepicker
											v-if="idPaymentOrder"
											placeholder=""
											:disabled="!!idPaymentOrder"
											:date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
											label="date"
											:value="this.dayjs(this.editPaymentOrder.date_created).format('YYYY-MM-DD')"
										/>
									</b-form-group>
								</b-col>
								<b-col class="mb-1" cols="4">
									<b-form-group label="">
										<b-form-timepicker
											v-if="!idPaymentOrder"
											placeholder=""
											:disabled="!!idPaymentOrder"
											label="date"
											v-model="time"
										/>
										<b-form-timepicker
											v-if="idPaymentOrder"
											placeholder=""
											:disabled="!!idPaymentOrder"
											label="date"
											:value="this.dayjs(this.editPaymentOrder.date_created).format('HH:mm')"
										/>
									</b-form-group>
								</b-col>
							</b-row>
							<b-row class="px-4">
								{{ this.editPaymentOrder.sum ? (this.editPaymentOrder.sum + ' Р') : nul }}
							</b-row>
						</b-row>
					</b-col>
				</b-row>
				<b-row >
					<b-col cols="12" class="d-flex">
						<b-col class="mb-1" cols="2">
							<b-form-group label="Всего">
								<b-form-input
									v-model="editPaymentOrder.sum"
									type="number"
								></b-form-input>
							</b-form-group>
						</b-col>

						<b-col v-if="typePaymentOrder == 'O' || editPaymentOrder.type == 'O'" class="mb-1" cols="3">
							<validation-provider #default="{ errors }" rules="required">
								<b-form-group :invalid-feedback="errors[0]" :state="!errors.length" label="НДС">
									<v-select
										label="title"
										:reduce="(nds) => nds.id"
										placeholder="НДС"
										:options="selectBank.nds"
										v-model="editPaymentOrder.is_nds"
									/>
								</b-form-group>
							</validation-provider>
						</b-col>

						<b-col v-if="editPaymentOrder.is_nds" class="mb-1" cols="2">
							<b-form-group label="." class="legend-color">
								<b-form-input
									v-model="sumNDS"
									:disabled="true"
								></b-form-input>
							</b-form-group>
						</b-col>

						<b-col v-if="editPaymentOrder.is_nds" class="mb-1" cols="2">
							<b-form-group label="Сумма без НДС">
								<b-form-input
									v-model="sum"
									:disabled="true"
									type="number"
								></b-form-input>
							</b-form-group>
						</b-col>
					</b-col>
				</b-row>
			</b-card-actions>
			<b-card-actions actionCollapse title="Оплачено по договору и счету">
				<b-col
					cols="12"
					md="9"
					lg="7"
					v-for="(contract, i) in editPaymentOrder.contracts"
					:key="i"
					class="mb-2"
				>
					<b-row class="">
						<b-col class="" cols="4">
							<!-- <b-form-group label="Договор">
								<b-form-input
									placeholder="Номер или тип"
									v-model="bank.contracts[i].contract"
								></b-form-input>
							</b-form-group> -->
							<b-form-group label="Договор">
								<select-contracts
									:disabled="!editPaymentOrder.counterparty"
									:reduce="(cont) => cont.id"
									:value="editPaymentOrder.contracts[i].contract"
									@input="changeOrderContract($event, i)"
									:payerId="editPaymentOrder.counterparty"
									@createContract="handleContractCreation($event, i)"
								/>
							</b-form-group>
						</b-col>

						<b-col class="" cols="3">
							<b-form-group label="Сумма, Р">
								<b-form-input
									v-model="editPaymentOrder.contracts[i].contract"
								></b-form-input>
							</b-form-group>
						</b-col>

						<b-col class="" cols="4">
							<b-form-group label="Сумма договора, Р">
								<b-form-input
									v-model="editPaymentOrder.contracts[i].contract"
								></b-form-input>
							</b-form-group>
						</b-col>

						<b-col cols="1" class="d-flex aligin-items-center">
							<b-icon icon="trash" @click="deleteContract(i)"/>
						</b-col>
					</b-row>
					<b-row
						class="d-flex justify-content-end"
						v-for="(account, index) in contract.accounts"
						:key="index"
					>
						<b-col class="border-left-dark" cols="3">
							<b-form-group label="Счет">
								<b-form-input
									placeholder="Номер"
									v-model="editPaymentOrder.contracts[i].accounts[index]"
								></b-form-input>
							</b-form-group>
						</b-col>

						<b-col class="" cols="3">
							<b-form-group label="Сумма, Р">
								<b-form-input
									v-model="editPaymentOrder.contracts[i].accounts[index]"
								></b-form-input>
							</b-form-group>
						</b-col>

						<b-col class="" cols="3">
							<b-form-group label="Сумма счета, Р">
								<b-form-input
									v-model="editPaymentOrder.contracts[i].accounts[index]"
								></b-form-input>
							</b-form-group>
						</b-col>

						<b-col cols="2" class="d-flex aligin-items-center">
							<b-icon icon="trash" @click="deleteAccount(i, index)"/>
						</b-col>
					</b-row>
					<span class="add-account" @click="addAccount(i)">+ Счет</span>
				</b-col>
				<span class="add-contract" @click="addContract()">+ Договор</span>

				<b-row class="mt-3">
					<b-col class="mb-1" cols="7">
						<b-form-group label="Назначение платежа">
							<b-form-input
								v-model="editPaymentOrder.payment_details"
							></b-form-input>
						</b-form-group>
					</b-col>

					<b-col class="mb-1" cols="7">
						<b-form-group label="Вид платежа">
							<b-form-input
								v-model="editPaymentOrder.payment_type"
							></b-form-input>
						</b-form-group>
					</b-col>

					<b-col class="mb-1" cols="7">
						<b-form-group label="Комментарий">
							<b-form-input
								v-model="editPaymentOrder.comment"
							></b-form-input>
						</b-form-group>
					</b-col>
				</b-row>
			</b-card-actions>
		</validation-observer>
	
			<div class="footer order__footer px-4 py-1">
				<div>
					<b-button
						@click="handleSave()"
						class="mr-2"
						variant="primary"
					>
							Сохранить
					</b-button>
					<b-button
						@click="handleClose()"
						class="mr-2"
						variant="outline-secondary "
						:to="{ name: 'accounting-bank' }"
					>
							Отменить
					</b-button>
				</div>
				<div class="justify-self-end">
					<b-button
						@click="handlePdfDownload"
						class="mr-2"
						variant="success"
					>
						<feather-icon icon="FileTextIcon" />
							Скачать PDF
					</b-button>
				</div>
			</div>
		</b-overlay>
	</section>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";

  
import {
	BOverlay,
	BRow,
	BCol,
	BTabs,
	BTab,
	BCard,
	BFormInput,
	BFormCheckbox,
	BCardTitle,
	BBadge,
	BFormTextarea,
	BFormGroup,
	BTable,
	BButton,
	BIcon,
	BIconTrash,
    BFormDatepicker,
    BFormTimepicker,
} from "bootstrap-vue";
import BCardActions from "@/@core/components/b-card-actions/BCardActions.vue";
import vSelect from "vue-select";
import downloadPdf from '../../utils/downloadPdf';
import { RoleConstants } from '@/utils/role';
import store from "@/store/index";
import '@/libs/dayjs'
import CustomCheckbox from "@/components/ui/customCheckbox/CustomCheckbox.vue";

import SelectClients from "@/components/ui/selectClients/selectClients.vue";
import bank from "@/store/app-modules/accounting/bank";
import SelectContracts from "@/components/ui/selectContracts/selectContracts.vue";

export default {
	components: {
		ValidationProvider,
		ValidationObserver,
		vSelect,
		BOverlay,
		BRow,
		BCol,
		BTabs,
		BTab,
		BCard,
		BCardTitle,
		BCardActions,
		BFormInput,
		BFormCheckbox,
		BBadge,
		BFormTextarea,
		BFormGroup,
		BTable,
		BButton,
		BIcon,
		BIconTrash,
		CustomCheckbox,
    	BFormDatepicker,
		SelectClients,
		BFormTimepicker,
		SelectContracts,
	},
	data() {
		return {
			executors: [],
			financialTransactions: [],
			date: null,
			time: null,
			bank_account: null,
			bank: {
				number: null,
				financial_transaction: null,
				counterparty: null,
				executor: null,
				sum: null,
				is_nds: false,
				contracts: [
					{
						contract: '',
						accounts: [''],
					}
				],
				is_completed: false,
				date_created: null,
				comment: '',
				payment_details: '',
				payment_type: '',
			},
			selectBank: {
				operation: [
					{id: 1, title: 'Оплата поставщикам авансом 1'}, 
					{id: 2, title: 'Оплата поставщикам авансом 2'}
				],
				financial_transactions: [],
				checking_accounts: [],
				nds: [
					{id: true, title: '20%'},
					{id: false, title: 'Без НДС'},
				],
			},
			roles: RoleConstants,
		};
		},
		computed: {
			...mapGetters({
				loading: "moduleAccountingBank/getLoading",
				paymentOrder: "moduleAccountingBank/getPaymentOrder",
			}),
			editPaymentOrder: {
				get() {
					return this.idPaymentOrder ? this.paymentOrder : this.bank;
				},
				set(value) {
					this.idPaymentOrder ? this.paymentOrder = value : this.bank = value;
				}
			},
			financial_transactions() {
				return 
			},
			sumNDS() {
				return +((0.2 * this.editPaymentOrder.sum / 1.2).toFixed(2));
			},
			sum() {
				return +((this.editPaymentOrder.sum / 1.2).toFixed(2));
			},
			readOnly() {
				return store.state.app.user.role !== this.roles.AD && store.state.app.user.role !== this.roles.LG;
			},
			idPaymentOrder() {
				return this.$route.params.id || null;
			},
			typePaymentOrder() {
				return this.$route.params.type || null;
			},
			urlAPI() {
				return process.env.VUE_APP_API_URL;
			},
			linkToPDF() {
				return `${this.urlAPI}/api/v1/order/${this.idPaymentOrder}/generate_pdf/`;
			},
			totalPrice() {
				return (
					parseFloat(this.editableOrder.delivery_price) +
					parseFloat(this.editableOrder.pay_on_order)
				).toFixed(2);
			},
			// time: {
			// 	get() {
			// 		console.log('getTime', this.editPaymentOrder.date_created, this.dayjs('T23:00:00').format("HH:mm"))
			// 		return this.dayjs(this.editPaymentOrder.date_created).format("HH:mm")
			// 	},
			// 	set(value) {
			// 		if (this.dayjs(this.editPaymentOrder.date_created).format("YYYY-MM-DD") !== "Invalid Date") {
			// 			this.editPaymentOrder.date_created = this.dayjs(this.editPaymentOrder.date_created).format("YYYY-MM-DD") + 'T' + value;
			// 			console.log('time', this.editPaymentOrder.date_created);
			// 		} else {
			// 			this.editPaymentOrder.date_created = value;
			// 			console.log('time1', this.editPaymentOrder.date_created);
			// 		}
			// 	}
			// },
			// date: {
			// 	get() {
			// 		return this.dayjs(this.editPaymentOrder.date_created).format("YYYY-MM-DD")
			// 	},
			// 	set(value) {
			// 		if (this.editPaymentOrder.date_created) {
			// 			this.editPaymentOrder.date_created = value + 'T' + this.dayjs(this.editPaymentOrder.date_created).format("HH:mm");
			// 			console.log('date', this.editPaymentOrder.date_created);
			// 		} else {
			// 			this.editPaymentOrder.date_created = value;
			// 			console.log('date', this.editPaymentOrder.date_created);
			// 		}
			// 	}
			// },
		},
		methods: {
			...mapActions({
				fetchPaymentOrder: "moduleAccountingBank/fetchPaymentOrder",
			}),
			...mapMutations({
				changeLoading: "moduleAccountingBank/changeLoading",
			}),
			addAccount(i) {
				this.editPaymentOrder.contracts[i].accounts.push('');
			},
			changeOrderContract(id, index) {
				console.log(id, index, this.editPaymentOrder.contracts)
				this.editPaymentOrder = {
					...this.editPaymentOrder,
					contracts: [
						...this.editPaymentOrder.contracts.slice(0, index),
						id,
						...this.editPaymentOrder.contracts.slice(index + 1),
					],
				};
			},
			addContract(i) {
				this.editPaymentOrder.contracts.push(
					{
						contract: '',
						accounts: [''],
					}
				);
			},
			deleteAccount(i, index) {
				if (this.editPaymentOrder.contracts[i].accounts.length == 1) {
					this.editPaymentOrder.contracts[i].accounts = [''];
					return
				}
				this.editPaymentOrder.contracts[i].accounts.splice(index, 1);
			},
			deleteContract(i) {
				if (this.editPaymentOrder.contracts.length == 1) {
					this.editPaymentOrder.contracts = [
						{
							contract: '',
							accounts: [''],
						}
					];
					return
				}
				this.editPaymentOrder.contracts.splice(i, 1);
			},
			handleContractCreation(contract, index) {
				this.$api.clients.createClientContract(this.editPaymentOrder.counterparty, contract)
					.then(response => {
						if (response.status > 203) {
							return;
						}
						this.editPaymentOrder = {
							...this.editPaymentOrder,
							contracts: [
								...this.editPaymentOrder.contracts.slice(0, index),
								{
									...this.editPaymentOrder.contracts[index],
									contract: response.data.id,
								},
								...this.editPaymentOrder.contracts.slice(index + 1),
							],
						};
					})
			},
			formatDate(date) {
				return this.dayjs(date).isValid()
				? this.dayjs(date).format("YYYY-MM-DD")
				: "Отсутствует";
			},
			handleCounterparty(value) {
				this.$api.clients.getClient(value).then(response => {
					this.bank_account = response.data.bank_account
				});
			},
			async handlePdfDownload() {
				downloadPdf(this.linkToPDF, `order${this.idPaymentOrder}.pdf`);
			},
			getPaymentOrder() {
				this.fetchPaymentOrder(this.idPaymentOrder);
			},
			fetchExecutors() { 
				this.$api.executors.getExecutors({ limit: 100 }).then((response) => {
					this.executors = response.data.results;
				});
			},
			fetchFinancialTransactions() { 
				this.$api.bank.getFinancialTransactions({ limit: 10, offset: 0 }).then((response) => {
					this.financialTransactions = response.data.results;
				});
			},
			changeBankAccount(value) {
				const id = this.editPaymentOrder.counterparty
				this.$api.clients.changeClient(id, {bank_account: value}).then((response) => {

				})
			},
			handleSave() {
				console.log('this.editPaymentOrder', this.editPaymentOrder)
				
				const newOrder = {
					number: this.editPaymentOrder.number,
					type: this.typePaymentOrder || this.editPaymentOrder.type,
					is_nds: this.editPaymentOrder.is_nds,
					sum: this.editPaymentOrder.sum,
					is_completed: this.editPaymentOrder.is_completed,
					comment: this.editPaymentOrder.comment,
					payment_details: this.editPaymentOrder.payment_details,
					payment_type: this.editPaymentOrder.payment_type,
					counterparty: this.editPaymentOrder.counterparty,
					financial_transaction: this.editPaymentOrder.financial_transaction,
					executor: this.editPaymentOrder.executor,
					date_created: this.editPaymentOrder.date_created || this.date + "T" + this.time,
					contracts: this.editPaymentOrder.contracts,
				};

				console.log('newOrder', newOrder)

				if(!this.idPaymentOrder) {
					this.createPaymentOrder(newOrder);
				} else {
					console.log('oooo')
					this.updatePaymentOrder(newOrder);
				}

				this.changeBankAccount(this.bank_account);
			},
			handleClose() {

			},
			createPaymentOrder(newOrder) {
				this.$api.bank.createPaymentOrder(newOrder).then((response) => {
					if (response.status !== 400) {
						this.$toast({
							component: ToastificationContent,
							props: {
							title: "Успешно",
							text: "Информация изменена",
							icon: "CheckCircleIcon",
							variant: "success",
							},
					});
					} else {
					this.$toast({
						component: ToastificationContent,
						props: {
						title: "Ошибка",
						text: "Не удалось обновить",
						icon: "XIcon",
						variant: "danger",
						},
					});
					}
				});
			},
			updatePaymentOrder(newOrder) {
				this.$api.bank.updatePaymentOrder(this.idPaymentOrder, newOrder).then((response) => {
					if (response.status !== 400) {
						this.$toast({
							component: ToastificationContent,
							props: {
							title: "Успешно",
							text: "Информация изменена",
							icon: "CheckCircleIcon",
							variant: "success",
							},
					});
					} else {
					this.$toast({
						component: ToastificationContent,
						props: {
						title: "Ошибка",
						text: "Не удалось обновить",
						icon: "XIcon",
						variant: "danger",
						},
					});
					}
				});
			},
		},
		mounted() {
			this.idPaymentOrder ? this.fetchPaymentOrder(this.idPaymentOrder) : null;
			this.fetchFinancialTransactions();
			this.fetchExecutors();
		},
	};
	</script>

	<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";

	.order {
		&__footer {
			position: fixed;
			z-index: 1030;
			bottom: 0;

			right: 0;
			left: 0;
			display: flex;
			align-items: center;
			justify-content: space-between;

			background: #ffffff;

			box-shadow: 0px 0px 8px rgba(11, 31, 53, 0.04),
			0px -4px 8px rgba(11, 31, 53, 0.08);
		}
	}

	.badge {
		margin: 0 0 20px 5px;
		background-color: #f0edf7;
		color: #6e6b7b;
	}

	.badge-green {
		background-color: #c9f6be;
		color: #79c67c;
	}

	.add-account {
		margin: 0 0 0 80px;
		font-size: 12px;
		font-weight: 700;
		color: #4587f1;
	}

	.add-contract {
		font-size: 12px;
		font-weight: 700;
		color: #4587f1;
	}

	.add-account:hover, .add-contract:hover {
		cursor: pointer;
	}

	.bi-trash{
		width: 25px;
		height: auto;
	}

	.legend-color legend{
		color: #ffffff;
	}
</style>
