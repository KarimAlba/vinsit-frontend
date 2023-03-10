<template>
	<section class="order pb-5">
		<b-overlay :show="loading" rounded="sm">
			<h1>Новый заказ</h1>
			<validation-observer ref="simpleRules" v-slot="{ invalid }">
				<b-card-actions title="Главная" actionCollapse>
					<b-row>
						<b-col class="mb-1" cols="12" md="4">
							<validation-provider #default="{ errors }" rules="required">
								<b-form-group
									:invalid-feedback="errors[0]"
									:state="!errors.length"
								>
									<v-select
										label="title"
										:reduce="(mode) => mode.id"
										placeholder="Режим заказа"
										:options="orderMode"
										v-model="order.mode"
									/>
								</b-form-group>
							</validation-provider>
						</b-col>
						<b-col class="mb-1" cols="12" md="4">
							<validation-provider #default="{ errors }" rules="required">
								<b-form-group
									:invalid-feedback="errors[0]"
									:state="!errors.length"
								>
									<v-select
										label="title"
										:reduce="(type) => type.id"
										placeholder="Тип заказа"
										:options="orderType"
										v-model="order.type"
									/>
								</b-form-group>
							</validation-provider>
						</b-col>
						<b-col class="mb-1" cols="12" md="4">
							<validation-provider #default="{ errors }" rules="required">
								<b-form-group
									:invalid-feedback="errors[0]"
									:state="!errors.length"
								>
									<!-- <v-select
									label="status"
									:reduce="(status) => status.id"

									placeholder="Статус товара"

									:options="orderStatus"
									v-model="order.status"
								/> -->
									<b-form-datepicker
										label="date"
										:reduce="(status) => status.id"
										placeholder="Дата доставки товара "
										v-model="order.delivery_date"
									/>
								</b-form-group>
							</validation-provider>
						</b-col>
						<b-col class="mb-1" cols="4">
							<validation-provider #default="{ errors }" rules="required">
								<b-form-group
									:invalid-feedback="errors[0]"
									label="Наложенный платеж"
								>
									<b-form-input
										v-model="order.pay_on_order"
										:state="errors.length > 0 ? false : null"
										type="number"
									/>
								</b-form-group>
							</validation-provider>
						</b-col>
						<b-col class="mb-1" cols="4">
							<validation-provider #default="{ errors }" rules="required">
								<b-form-group
									:invalid-feedback="errors[0]"
									label="Стоимость доставки"
								>
									<b-form-input
										v-model="order.delivery_price"
										:state="errors.length > 0 ? false : null"
										type="number"
									/>
								</b-form-group>
							</validation-provider>
						</b-col>
						<b-col class="mb-1" cols="6">
							<b-form-group label="Местоположение">
								<b-form-input v-model="order.location"/>
							</b-form-group>
						</b-col>
						<b-col cols="12">
							<b-form-textarea
								placeholder="Примечание"
								rows="3"
								max-rows="6"
								v-model="order.comment"
							/>
						</b-col>
					</b-row>
				</b-card-actions>
				<b-card-actions title="Плательщик" actionCollapse>
					<b-row>
						<b-col class="mb-1" cols="12" md="6">
							<b-form-group label="Плательщик">
								<select-clients
									:reduce="(client) => client.id"
									v-model="order.payer_counterparty"
								/>
							</b-form-group>
						</b-col>
						<b-col class="mb-1" cols="4">
							<b-form-group label="Договор">
								<b-form-input v-model="order.contract"/>
							</b-form-group>
						</b-col>
						<b-col class="mb-1" cols="12" md="6">
							<b-form-group label="Город">
								<select-cities v-model="order.payer_city" />
							</b-form-group>
						</b-col>
					</b-row>
				</b-card-actions>
				<b-row>
					<b-col cols="6">
						<b-card-actions title="Отправитель" actionCollapse>
							<b-row>
								<b-col class="mb-1" cols="12">
									<validation-provider #default="{ errors }" rules="required">
										<b-form-group
											label="Тип контрагента *"
											:invalid-feedback="errors[0]"
											:state="!errors.length"
										>
											<b-row>
												<b-col cols="3">
													<b-form-radio 
														v-model="order.sender_counterparty_type" 
														name="some-radios" 
														value="clientType[0].id"
														>
														{{clientType[0].short_title}}
													</b-form-radio>
												</b-col>
												<b-col cols="3">
													<b-form-radio 
														v-model="order.sender_counterparty_type" 
														name="some-radios" 
														value="clientType[1].id"
														>
														{{clientType[1].short_title}}
													</b-form-radio>
												</b-col>
											</b-row>
										</b-form-group>
									</validation-provider>
								</b-col>
								<b-col class="mb-1" cols="12">
									<b-form-group label="Город *">
										<select-cities v-model="order.sender_city" />
									</b-form-group>
								</b-col>
								<b-col class="mb-1" cols="12">
									<b-form-group label="Наименование контрагента *">
										<!-- <b-form-input
											v-model="order.sender_counterparty"
											:state="errors.length > 0 ? false : null"
											type="number"
										/>
										<template #no-options="{ search }">
											{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
										</template> -->
										<select-clients
											:reduce="(client) => client.id"
											v-model="order.sender_counterparty"
										/>
									</b-form-group>
								</b-col>
								<b-col cols="12">
									<b-form-group label="ФИО *">
										<b-form-input v-model="order.sender_full_name"></b-form-input>
									</b-form-group>
								</b-col>
								<b-col cols="12">
									<b-form-group label="Адрес *">
										<b-form-input v-model="order.sender_address"/>
									</b-form-group>
								</b-col>
								<b-col cols="12" md="4">
									<b-form-group label="Серия паспорта">
										<b-form-input v-model="order.sender_passport_series"/>
									</b-form-group>
								</b-col>
								<b-col cols="12" md="4">
									<b-form-group label="Номер паспорта">
										<b-form-input v-model="order.sender_passport_no"/>
									</b-form-group>
								</b-col>
								<b-col
									cols="12"
								>
									<validation-provider #default="{ errors }" rules="required">
										<b-form-group
											:invalid-feedback="errors[0]"
											label="Телефоны *"
										>
										<b-row class="">
											<b-col class="text-center text-white border border-dark bg-secondary py-1" cols="8">
												Номер телефона
											</b-col>
											<b-col class="text-center text-white border border-dark bg-secondary font-weight-bold plus" cols="4" @click="popPhone('sender')">
												+
											</b-col>
										</b-row>
										<b-row 
											v-for="(phone, i) in order.sender_phones"
											:key="i"
										>
											<b-col class=" border border-secondary px-0" cols="8">
												<b-form-input
													v-model="phone.number"
													:state="errors.length > 0 ? false : null"
													v-maska
													placeholder="+71234567890"
													data-maska="+7##########"
												/>
											</b-col>
											<b-col class="text-center border border-secondary" cols="4" @click="deletePhone('sender', i)">
												<b-icon icon="trash"></b-icon>
											</b-col>
										</b-row>
										</b-form-group>
									</validation-provider>
								</b-col>
							</b-row>
						</b-card-actions>
					</b-col>
					<b-col cols="6">
						<b-card-actions title="Получатель" actionCollapse>
							<b-row>
								<b-col class="mb-1" cols="12">
									<validation-provider #default="{ errors }" rules="required">
										<b-form-group
											label="Тип контрагента *"
											:invalid-feedback="errors[0]"
											:state="!errors.length"
										>
											<b-row>
												<b-col cols="3">
													<b-form-radio 
														v-model="order.recipient_counterparty_type" 
														name="some-radios-2" 
														value="clientType[0].id"
														>
														{{clientType[0].short_title}}
													</b-form-radio>
												</b-col>
												<b-col cols="3">
													<b-form-radio 
														v-model="order.recipient_counterparty_type" 
														name="some-radios-2" 
														value="clientType[1].id"
														>
														{{clientType[1].short_title}}
													</b-form-radio>
												</b-col>
											</b-row>
										</b-form-group>
									</validation-provider>
								</b-col>
								<b-col class="mb-1" cols="12">
									<b-form-group label="Город *">
										<select-cities v-model="order.recipient_city" />
									</b-form-group>
								</b-col>
								<b-col class="mb-1" cols="12">
									<b-form-group label="Наименование контрагента *">
										<select-clients
											:reduce="(client) => client.id"
											v-model="order.recipient_counterparty"
										/>
									</b-form-group>
								</b-col>
								<b-col cols="12">
									<b-form-group label="ФИО *">
										<b-form-input v-model="order.recipient_full_name"/>
									</b-form-group>
								</b-col>
								<b-col cols="12">
									<b-form-group label="Адрес *">
										<b-form-input v-model="order.recipient_address"/>
									</b-form-group>
								</b-col>
								<b-col cols="12" md="4">
									<b-form-group label="Серия паспорта">
										<b-form-input v-model="order.recipient_passport_series" />
									</b-form-group>
								</b-col>
								<b-col cols="12" md="4">
									<b-form-group label="Номер паспорта">
										<b-form-input v-model="order.recipient_passport_no"/>
									</b-form-group>
								</b-col>
								<b-col cols="12" md="4">
									<b-form-group label="Email">
										<b-form-input
										type="email"
										v-model="order.recipient_email"
										></b-form-input>
									</b-form-group>
								</b-col>
								<b-col
									cols="12"
								>
									<validation-provider #default="{ errors }" rules="required">
										<b-form-group
											:invalid-feedback="errors[0]"
											label="Телефоны *"
										>
										<b-row class="">
											<b-col class="text-center text-white border border-dark bg-secondary py-1" cols="8">
												Номер телефона
											</b-col>
											<b-col class="text-center text-white border border-dark bg-secondary font-weight-bold plus" cols="4" @click="popPhone('recipient')">
												+
											</b-col>
										</b-row>
										<b-row 
											v-for="(phone, i) in order.recipient_phones"
											:key="i"
										>
											<b-col class=" border border-secondary px-0" cols="8">
												<b-form-input
													v-model="phone.number"
													:state="errors.length > 0 ? false : null"
													v-maska
													placeholder="+71234567890"
													data-maska="+7##########"
												/>
											</b-col>
											<b-col class="text-center border border-secondary" cols="4" @click="deletePhone('recipient', i)">
												<b-icon icon="trash"></b-icon>
											</b-col>
										</b-row>
										</b-form-group>
									</validation-provider>
								</b-col>
							</b-row>
						</b-card-actions>
					</b-col>
				</b-row>
				<!-- <b-card-actions title="Информация о грузе" actionCollapse>
				<b-table
					:items="order.places"
					:fields="orderPlacesFields"
					striped
					responsive
				>
					<template #cell(barcode)="data">
					<a class="link" :href="data.item.barcode">Штрих-код</a>
					</template>

					<template #cell(status)="data">
					{{ getPlaceStatus(data.item.status) }}
					</template>
				</b-table>

				<p>
					Всего мест: <b>{{ order.places.length }} </b>
				</p>
				</b-card-actions> -->
				<b-card-actions title="Информация о грузе" actionCollapse>
					<b-table
						:items="order.places"
						:fields="orderPlacesFields"
						striped
						responsive
					>
						<template #cell(place_no)="data">
							<validation-provider v-slot="{ errors }" rules="required">
								<b-form-group
									:invalid-feedback="errors[0]"
									:state="!errors.length"
								>
									<b-form-input
										v-model="data.item.place_no"
										type="number"
										:state="errors.length > 0 ? false : null"
										readonly
									/>
								</b-form-group>
							</validation-provider>
						</template>
						<template #cell(weight)="data">
							<validation-provider v-slot="{ errors }" rules="required">
								<b-form-group
									:invalid-feedback="errors[0]"
									:state="!errors.length"
									style="min-width: 100px"
								>
									<b-form-input
										v-model="data.item.weight"
										type="number"
										:state="errors.length > 0 ? false : null"
									/>
								</b-form-group>
							</validation-provider>
						</template>
						<template #cell(length)="data">
							<b-form-input v-model="data.item.length"/>
						</template>
						<template #cell(width)="data">
							<b-form-input v-model="data.item.width"/>
						</template>
						<template #cell(height)="data">
							<b-form-input v-model="data.item.height"/>
						</template>
						<template #cell(rack)="data">
							<b-form-input
								style="min-width: 100px"
								v-model="data.item.rack"
							/>
						</template>
						<template #cell(tare)="data">
							<b-form-input
								style="min-width: 100px"
								v-model="data.item.tare"
							/>
						</template>
						<template #cell(description)="data">
							<b-form-input v-model="data.item.description"/>
						</template>
						<template #cell(delete)="data">
							<b-button
								v-b-tooltip.hover
								title="Удалить место"
								variant="danger"
								size="sm"
								@click="deletePlace(data.item.place_no)"
							>
								<feather-icon icon="Trash2Icon" />
							</b-button>
						</template>
					</b-table>
					<div class="d-flex align-items-center justify-content-between">
						<div>
							<p>Всего мест: <b>{{ order.places.length }} </b></p>
						</div>
						<div>
							<b-button @click="addPlace" variant="primary" size="sm">
								Добавить место
							</b-button>
						</div>
					</div>
				</b-card-actions>
				<b-card-actions title="Товары" actionCollapse>
					<b-table
						:items="order.products"
						:fields="orderProductsFields"
						striped
					>
						<template #cell(place_no)="data">
							<validation-provider #default="{ errors }" rules="required">
								<b-form-group
									:invalid-feedback="errors[0]"
									:state="!errors.length"
								>
									<v-select
										style="min-width: 100px"
										v-model="data.item.place_no"
										label="place_no"
										:options="order.places"
										:reduce="(place) => place.place_no"
									/>
								</b-form-group>
							</validation-provider>
						</template>
						<template #cell(name)="data">
							<validation-provider v-slot="{ errors }" rules="required">
								<b-form-group
									:invalid-feedback="errors[0]"
									:state="!errors.length"
								>
									<b-form-input
										v-model="data.item.name"
										:state="errors.length > 0 ? false : null"
									/>
								</b-form-group>
							</validation-provider>
						</template>
						<template #cell(price)="data">
							<b-form-input
								v-model="data.item.price"
								type="number"
							/>
						</template>
						<template #cell(quantity)="data">
							<validation-provider v-slot="{ errors }" rules="required">
								<b-form-group
									:invalid-feedback="errors[0]"
									:state="!errors.length"
								>
									<b-form-input
										v-model="data.item.quantity"
										:state="errors.length > 0 ? false : null"
									/>
								</b-form-group>
							</validation-provider>
						</template>
						<template #cell(weight)="data">
							<b-form-input
								style="min-width: 100px"
								v-model="data.item.weight"
								type="number"
							/>
						</template>
						<template #cell(delete)="data">
							<b-button
								v-b-tooltip.hover
								title="Удалить товар"
								variant="danger"
								size="sm"
								@click="deleteProduct(data.item.id)"
							>
								<feather-icon icon="Trash2Icon" />
							</b-button>
						</template>
					</b-table>
					<div class="d-flex align-items-center justify-content-between">
						<div>
							<p>Всего товаров: <b>{{ order.products.length }} </b></p>
						</div>
						<div>
							<b-button
								v-if="order.places.length"
								@click="addProduct"
								variant="primary"
								size="sm"
							>
								Создать товар
							</b-button>
						</div>
					</div>
				</b-card-actions>
				<div class="footer order__footer px-4 py-1 d-flex">
					<b-button
						:disabled="invalid"
						variant="primary"
						class="mr-1"
						@click="validationForm"
					>
						Создать
					</b-button>
					<b-button 
						variant="secondary" 
						:to="{ name: 'orders' }"
					>
						Назад
					</b-button>
				</div>
			</validation-observer>
		</b-overlay>
	</section>
</template>

<script>
	import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
	import { vMaska } from "maska";
	import { ValidationProvider, ValidationObserver } from "vee-validate";
	import { required, email, confirmed, password } from "@validations";
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import SelectCities from "@/components/ui/selectCities/selectCities.vue";
	import SelectClients from "@/components/ui/selectClients/selectClients.vue";
	import clients from "@/api/clients";
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
		BFormRadio,
		VBTooltip,
		BFormDatepicker,
		BIcon,
		BIconTrash,
	} from "bootstrap-vue";
	import BCardActions from "@/@core/components/b-card-actions/BCardActions.vue";
	import vSelect from "vue-select";

	export default {
		components: {
			ValidationProvider,
			ValidationObserver,

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
			BFormRadio,
			BTable,
			BButton,
			BFormDatepicker,
			BIcon,
			BIconTrash,

			vSelect,
			SelectCities,
			SelectClients,
		},	
		directives: { maska: vMaska, "b-tooltip": VBTooltip },
		data() {
			return {
				orderPlacesFields: [
					{ key: "barcode", label: "Штрих-код" },
					{ key: "place_no", label: "№ места" },
					{ key: "length", label: "Длина, см" },
					{ key: "width", label: "Ширина, см" },
					{ key: "height", label: "Высота, см" },
					{ key: "weight", label: "Фактический вес, кг" },
					{ key: "status", label: "Статус" },
					{ key: "rack", label: "Rack" },
					{ key: "tare", label: "tare" },
					{ key: "description", label: "Примечание" },
				],
				orderPlacesFields: [
					{ key: "place_no", label: "№ места" },
					{ key: "length", label: "Длина, см" },
					{ key: "width", label: "Ширина, см" },
					{ key: "height", label: "Высота, см" },
					{ key: "weight", label: "Фактический вес, кг" },
					/* { key: "rack", label: "Rack" },
					{ key: "tare", label: "Tare" }, */
					{ key: "description", label: "Примечание" },
					{ key: "delete", label: "" },
				],
				orderProductsFields: [
					{ key: "place_no", label: "Номер места" },
					{ key: "name", label: "Наименование" },
					{ key: "price", label: "Стоимость за ед., руб " },
					{ key: "quantity", label: "Количество" },
					{ key: "total_price", label: "Сумма" },
					{ key: "weight", label: "Вес" },
					{ key: "delete", label: "" },
				],
				cities: [],
				counterparty: [],
				order: {
					// status: 0,
					type: "",
					mode: "",
					sender: 0,
					recipient: 0,
					payer: 0,
					comment: "",
					delivery_date: '',
					sender_phones: [{}],
					recipient_phones: [{}],
					places: [],
					products: [],
				},
				clients: [],
				products: [],
				orderStatus: [],
				phoneMask: {
					phone: true,
					phoneRegionCode: "RU",
					prefix: "+7",
				},
			};
		},
		watch: {
			'order.recipient_counterparty'() {
				if (Number.isFinite(this.order.recipient_counterparty)) {
					const id = this.order.recipient_counterparty;
					this.addCounterparty(id, 'recipient');
				};
			},
			'order.sender_counterparty'() {
				if (Number.isFinite(this.order.sender_counterparty)) {
					const id = this.order.sender_counterparty;
					this.addCounterparty(id, 'sender');
				};
			},
			'order.payer_counterparty'() {
				if (Number.isFinite(this.order.payer_counterparty)) {
					const id = this.order.payer_counterparty;
					this.addCounterparty(id, 'payer');
				};
			}
		},
		computed: {
			...mapGetters({
				loading: "moduleOrders/getLoading",
				orderMode: "moduleOrders/getOrderMode",
				orderType: "moduleOrders/getOrderType",
				placeStatus: "moduleOrders/getPlaceStatus",
				clientType: "moduleClients/getClientType",
			}),
		},
		methods: {
			...mapActions({
				fetchOrder: "moduleOrders/fetchOrder",
			}),
			...mapMutations({
				changeLoading: "moduleOrders/changeLoading",
			}),
			fetchStatus() {
				this.$api.orderStatus.getOrderStatusList().then((response) => {
					this.orderStatus = response.data.results;
				});
			},
			validationForm() {
				this.$refs.simpleRules.validate().then((success) => {
					if (success) {
						this.changeLoading(true);
						this.$api.orders
							.createOrder(this.order)
								.then((response) => {
									if (response.status === 201) {
										this.$router.push({
											name: "order",
											params: { id: response.data.id },
										});
										this.$toast({
											component: ToastificationContent,
											props: {
												title: "Успешно",
												text: "Заказ создан",
												icon: "CheckCircleIcon",
												variant: "success",
											},
										});
									} else {
										this.$toast({
											component: ToastificationContent,
											props: {
												title: "Ошибка",
												text: "Заказ не создан",
												icon: "XIcon",
												variant: "danger",
											},
										});
									}
								})
								.finally(() => {
									this.changeLoading(false);
								});
					}
				});
			},
			addPlace() {
				let arr = this.order.places.map((place) => place.place_no),
				max = arr.length ? Math.max(...arr) : 0;
				this.order.places.push({ place_no: max + 1 });
			},
			deletePlace(id) {
				let inx = this.order.places.findIndex((place) => place.place_no === id);
				if (inx >= 0) {
					this.order.places.splice(inx, 1);
				};
			},
			addProduct() {
				this.order.products.push({});
			},
			deleteProduct(id) {
				let inx = this.order.products.findIndex((product) => product.place_no === id);
				if (inx >= 0) {
					this.order.product.splice(inx, 1);
				};
			},
			changeCounterpartyParams(data, name) {
				for (let key in data) {
					if (data[key] && key === 'name') {
						this.order[name + '_counterparty'] = data.name;
						continue;
					};
					if (data[key] && key === 'client_phones') {
						if (this.order[name + '_phones'][0].number) {
							const oredrPhone = this.order[name + '_phones'];
							data.client_phones.map((it) => {
								oredrPhone.push({number: it.phone_number});
							})
						} else {
							this.order[name + '_phones'] = data.client_phones.map((it) => ({number: it.phone_number}));
						}
						continue;
					};
					if (data[key]) {
						this.order[name + '_' + key] = data[key];
						// console.log(name + '_' + key + ' - ', this.order[name + '_' + key] = data[key]);
					};
				}
			},
			addCounterparty(id, name) {
				this.$api.clients.getClient(id).then((response) => {
					this.changeCounterpartyParams(response.data, name);	
				});
			},
			popPhone(name) {
				if (this.order[name + '_phones'][0].number){
					this.order[name + '_phones'].unshift({});
				}
			},
			deletePhone(name, id) {
				this.order[name + '_phones'].splice(id, 1);
				if (this.order[name + '_phones'].length == 0){
					this.order[name + '_phones'].unshift({});
				}
			},
		},
		mounted() {
			this.fetchStatus();
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
			background: #ffffff;
			box-shadow: 0px 0px 8px rgba(11, 31, 53, 0.04),
			0px -4px 8px rgba(11, 31, 53, 0.08);
		}
	}
	.plus {
		font-size: 35px;
	}
	.bi-trash {
		width: 30px;
		height: auto;
		margin-top: 5px;
	}
</style>
