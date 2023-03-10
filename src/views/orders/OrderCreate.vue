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
						<b-col class="mb-1" cols="4">
							<b-form-group label="Договор">
								<b-form-input v-model="order.contract"/>
							</b-form-group>
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
						<b-col class="mb-1" cols="12" md="6">
							<b-form-group label="Город">
								<select-cities v-model="order.payer_city" />
							</b-form-group>
						</b-col>
					</b-row>
				</b-card-actions>
				<b-card-actions title="Отправитель" actionCollapse>
					<b-row>
						<b-col class="mb-1" cols="12" md="4">
							<b-form-group label="Отправитель">
								<select-clients
									:reduce="(client) => client.id"
									v-model="order.sender_counterparty"
								/>
							</b-form-group>
						</b-col>
						<b-col class="mb-1" cols="12" md="4">
							<b-form-group label="Город">
								<select-cities v-model="order.sender_city" />
							</b-form-group>
						</b-col>
						<b-col class="mb-1" cols="12" md="4">
							<validation-provider #default="{ errors }" rules="required">
								<b-form-group
									label="Тип отправителя"
									:invalid-feedback="errors[0]"
									:state="!errors.length"
									:class="{selectType: creationError && order.sender_counterparty}"
									style="border: 0px solid white"
								>
									<v-select
										label="title"
										:reduce="(type) => type.id"
										:options="clientType"
										v-model="order.sender_counterparty_type"
										:class="{selectType: creationError && order.sender_counterparty}"
									/>
								</b-form-group>
							</validation-provider>
						</b-col>
						<b-col cols="12" md="8">
							<b-form-group label="ФИО отправителя">
								<b-form-input v-model="order.sender_full_name"></b-form-input>
							</b-form-group>
						</b-col>
						<b-col cols="12" md="2">
							<b-form-group label="Серия паспорта">
								<b-form-input v-model="order.sender_passport_series"/>
							</b-form-group>
						</b-col>
						<b-col cols="12" md="2">
							<b-form-group label="Номер паспорта">
								<b-form-input v-model="order.sender_passport_no"/>
							</b-form-group>
						</b-col>
						<b-col cols="12">
							<b-form-group label="Адрес">
								<b-form-textarea
									rows="3"
									max-rows="6"
									v-model="order.sender_address"
								/>
							</b-form-group>
						</b-col>
						<b-col
							v-for="(phone, i) in order.sender_phones"
							:key="i"
							cols="12"
							md="4"
						>
							<validation-provider #default="{ errors }" rules="required">
								<b-form-group
									:invalid-feedback="errors[0]"
									label="Номер телефона"
									:class="{selectType: creationError && order.sender_counterparty}"
									style="border: 0px solid white"
								>
									<b-form-input
										v-model="order.sender_phone"
										:state="errors.length > 0 ? false : null"
										v-maska
										placeholder="+71234567890"
										data-maska="+7##########"
										:class="{selectType: creationError && order.sender_counterparty}"
									/>
								</b-form-group>
							</validation-provider>
						</b-col>
					</b-row>
				</b-card-actions>
				<b-card-actions title="Получатель" actionCollapse>
					<b-row>
						<b-col class="mb-1" cols="12" md="4">
							<b-form-group label="Получатель">
								<select-clients
									:reduce="(client) => client.id"
									v-model="order.recipient_counterparty"
								/>
							</b-form-group>
						</b-col>
						<b-col class="mb-1" cols="12" md="4">
							<b-form-group label="Город">
								<select-cities v-model="order.recipient_city" />
							</b-form-group>
						</b-col>
						<b-col class="mb-1" cols="12" md="4">
							<validation-provider #default="{ errors }" rules="required">
								<b-form-group
									label="Тип получателя"
									:invalid-feedback="errors[0]"
									:state="!errors.length"
									:class="{selectType: creationError && order.recipient_counterparty}"
									style="border: 0px solid white"
								>
									<v-select
										label="title"
										:reduce="(type) => type.id"
										:options="clientType"
										v-model="order.recipient_counterparty_type"
										:class="{selectType: creationError && order.recipient_counterparty}"
									/>
								</b-form-group>
							</validation-provider>
						</b-col>
						<b-col cols="12" md="8">
							<b-form-group label="ФИО получателя">
								<b-form-input v-model="order.recipient_full_name"/>
							</b-form-group>
						</b-col>
						<b-col cols="12" md="2">
							<b-form-group label="Серия паспорта">
								<b-form-input v-model="order.recipient_passport_series" />
							</b-form-group>
						</b-col>
						<b-col cols="12" md="2">
							<b-form-group label="Номер паспорта">
								<b-form-input v-model="order.recipient_passport_no"/>
							</b-form-group>
						</b-col>
						<b-col cols="12">
							<b-form-group label="Адрес">
								<b-form-textarea
									rows="3"
									max-rows="6"
									v-model="order.recipient_address"
								/>
							</b-form-group>
						</b-col>
						<b-col
							v-for="(phone, i) in order.recipient_phones"
							:key="i"
							cols="12"
							md="4"
						>
							<validation-provider #default="{ errors }" rules="required">
								<b-form-group
									:invalid-feedback="errors[0]"
									label="Номер телефона"
									:class="{selectType: creationError && order.recipient_counterparty}"
									style="border: 0px solid white"
								>
									<b-form-input
										v-model="order.recipient_phone"
										:state="errors.length > 0 ? false : null"
										v-maska
										placeholder="+71234567890"
										data-maska="+7##########"
										:class="{selectType: creationError && order.recipient_counterparty}"
									/>
								</b-form-group>
							</validation-provider>
						</b-col>
						<b-col cols="12" md="4">
						<b-form-group label="Email">
							<b-form-input
								type="email"
								v-model="order.recipient_email"
							/>
						</b-form-group>
						</b-col>
					</b-row>
				</b-card-actions>
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
                        <template #cell(seal_number)="data">
							<b-form-input v-model="data.item.seal_number"/>
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
							<b-button v-b-modal.modal-create-place variant="primary" size="sm">
								Добавить место
							</b-button>
						</div>
					</div>
				</b-card-actions>

                <!-- Places creation modal -->
                <b-modal id="modal-create-place" title="Добавить место" hide-footer>
                    <validation-observer v-slot="{ invalid }">
                        <b-row>
                            <b-col cols="12" md="12">
                                <validation-provider #default="{ errors }" rules="required">
                                <b-form-group
                                    label="# места"
                                    :invalid-feedback="errors[0]"
                                    :state="!errors.length"
                                >
                                    <b-form-input
                                    v-model="newPlace.place_no"
                                    type="number"
                                    :state="errors.length > 0 ? false : null"
                                    ></b-form-input>
                                </b-form-group>
                                </validation-provider>
                            </b-col>

                            <b-col cols="12" md="3">
                                <validation-provider #default="{ errors }" rules="required">
                                <b-form-group
                                    label="Вес"
                                    :invalid-feedback="errors[0]"
                                    :state="!errors.length"
                                >
                                    <b-form-input
                                    v-model="newPlace.weight"
                                    type="number"
                                    :state="errors.length > 0 ? false : null"
                                    ></b-form-input>
                                </b-form-group>
                                </validation-provider>
                            </b-col>

                            <b-col cols="12" md="3">
                                <b-form-group label="Ширина">
                                <b-form-input
                                    type="number"
                                    v-model="newPlace.width"
                                ></b-form-input>
                                </b-form-group>
                            </b-col>

                            <b-col cols="12" md="3">
                                <b-form-group label="Длина">
                                <b-form-input
                                    type="number"
                                    v-model="newPlace.length"
                                ></b-form-input>
                                </b-form-group>
                            </b-col>

                            <b-col cols="12" md="3">
                                <b-form-group label="Высота">
                                <b-form-input
                                    type="number"
                                    v-model="newPlace.height"
                                ></b-form-input>
                                </b-form-group>
                            </b-col>

                            <!-- <b-col cols="12" md="12">
                                <b-form-group label="Примечание">
                                <b-form-input v-model="newPlace.description"></b-form-input>
                                </b-form-group>
                            </b-col> -->
                        </b-row>
                        <b-row>
                            <b-col cols="12" md="12">
                                <validation-provider #default="{ errors }">
                                <b-form-group
                                    label="Пломба"
                                    :invalid-feedback="errors[0]"
                                    :state="!errors.length"
                                >
                                    <b-form-input
                                        v-model="newPlace.seal_number"
                                        type="number"
                                        :state="errors.length > 0 ? false : null"
                                    ></b-form-input>
                                </b-form-group>
                                </validation-provider>
                            </b-col>
                        </b-row>

                        <b-row class="justify-content-between">
                            <b-col cols="12" md="3" class="align-self-end">
                                <b-button variant="primary" :disabled="invalid" @click="addPlace">
                                    Добавить
                                </b-button>
                            </b-col>
                            <b-col cols="12" md="3" class="align-self-end">
                                <b-form-group label="Кол-во" style="margin-bottom: 0;">
                                    <b-form-input type="number" v-model="newPlaceCount"></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </validation-observer>
                </b-modal>

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
		VBTooltip,
		BFormDatepicker,
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
			BTable,
			BButton,
			BFormDatepicker,

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
					{ key: "seal_number", label: "Пломба" },
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
                newPlace: {},
                newPlaceCount: 1,
				phoneMask: {
					phone: true,
					phoneRegionCode: "RU",
					prefix: "+7",
				},
				newUser: {
					INN: '',
					address: '',
					bank_account: '',
					city: '',
					client_phones: [],
					email: '',
					// id: null,
					name: '',
					passport_no: '', 
					passport_series: '',
					position: '',
					type: null,
					web: '',
				},
				creationError: false,
			};
		},
		watch: {
			'order.recipient_counterparty'() {
				if (Number.isFinite(this.order.recipient_counterparty)) {
					const id = this.order.recipient_counterparty;
					this.addCounterparty(id, 'recipient');
					return;
				};
				if (typeof this.order.recipient_counterparty === 'string') {
					this.newUser.name = this.order.recipient_counterparty;
					this.addClient('recipient');
					return;
				};
			},
			'order.sender_counterparty'() {
				if (Number.isFinite(this.order.sender_counterparty)) {
					const id = this.order.sender_counterparty;
					this.addCounterparty(id, 'sender');
					return;
				};
				if (typeof this.order.sender_counterparty === 'string') {
					this.newUser.name = this.order.sender_counterparty;
					this.addClient('sender');
					return;
				};
			},
			'order.payer_counterparty'() {
				if (Number.isFinite(this.order.payer_counterparty)) {
					const id = this.order.payer_counterparty;
					this.addCounterparty(id, 'payer');
					return;
				};
				// if (typeof this.order.payer_counterparty === 'string') {
				// 	this.newUser.name = this.order.payer_counterparty;
				// 	this.addClient('payer');
				// 	return;
				// };
			},
			'order.recipient_phone'() {
				if (this.order.recipient_phone.length === 12) {
					// this.newUser.client_phones.push(this.order.recipient_phone);
					this.newUser.client_phones[0] = this.order.recipient_phone;
					if (this.newUser.name) {
						this.addClient('recipient');
						return;
					};
				}
			},
			'order.sender_phone'() {
				if (this.order.sender_phone.length === 12) {
					// this.newUser.client_phones.push(this.order.sender_phone);
					this.newUser.client_phones[0] = this.order.sender_phone;
					if (this.newUser.name) {
						this.addClient('sender');	
						return;
					};
				}
			},
			// 'order.payer_counterparty_type'() {
			// 	this.newUser.type = this.order.payer_counterparty_type;
			// 	if (this.newUser.name) {
			// 		this.addClient('payer');
			// 		return;
			// 	};
			// },
			'order.recipient_counterparty_type'() {
				this.newUser.type = this.order.recipient_counterparty_type;
				if (this.newUser.name) {
					this.addClient('recipient');
					return;
				};
			},
			'order.sender_counterparty_type'() {
				this.newUser.type = this.order.sender_counterparty_type;
				if (this.newUser.name) {
					this.addClient('sender');
					return;
				};
			},
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
                if (this.newPlaceCount > 0) {
                    for (let i = 0; i < this.newPlaceCount; i++) {
                        this.order.places.push({ ...this.newPlace, place_no: max + 1 + i });
                    }
                }
                this.$nextTick(() => {
                    this.$bvModal.hide("modal-create-place");
                });
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
						this.order[name + '_phone'] = +(data.client_phones[0].phone_number);
						continue;
					};
					if (data[key]) {
						this.order[name + '_' + key] = data[key];
					};
				}
			},
			addCounterparty(id, name) {
				this.$api.clients.getClient(id).then((response) => {
					this.changeCounterpartyParams(response.data, name);	
				});
			},
			addClient(name) {
				if ((!this.newUser.type) && (this.newUser.name) && (!this.newUser.client_phones.length)) {
					// this.$refs.simpleRules.validate();
					this.creationError = true;
					return;
				};
				if ((this.newUser.type) && (this.newUser.name) && (this.newUser.client_phones.length)) {
					this.creationError = false;
					this.$api.clients.addNewClient(this.newUser)
						.then((response) => {
							console.log('response - ', response);
							this.order[name + '_id'] = response.data.id;
							this.order[name + '_counterparty'] = this.newUser.name;
							this.newUser.name = '';
							this.newUser.type = '';
							this.newUser.client_phones.pop();
							// console.log(name + '_id' + ' - ' + this.order[name + '_id']);
							// console.log(name + '_counterparty' + ' - ' +this.order[name + '_counterparty']);
						})
						.catch((error) => {console.log('error - ', error)})
				};
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
	};

	.selectType {
		color: red;
		border: 2px solid red; 
		border-radius: 4px;
	};
</style>
