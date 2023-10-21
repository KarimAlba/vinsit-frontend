<template>
	<section class="order pb-5">
		<b-overlay :show="loading" rounded="sm">
			<h1>Новый заказ</h1>
			<validation-observer ref="simpleRules">
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
				<!-- <b-card-actions title="Плательщик" actionCollapse>
					<b-row>
						<b-col class="mb-1" cols="12" md="4">
							<b-form-group label="Плательщик">
								<select-clients
									:reduce="(client) => client.id"
									v-model="order.payer_counterparty"
                                    @input="changeOrder($event, 'payer_counterparty')"
                                    @createClient="(name) => handleClientCreation(name, 'payer')"
								/>
							</b-form-group>
						</b-col>
						<b-col class="mb-1" cols="4">
							<b-form-group label="Договор">
                                <select-contracts
									:reduce="(cont) => cont.id"
									v-model="order.contract"
                                    :payerId="order.payer_counterparty"
                                    @input="changeOrder($event, 'contract')"
                                    @createContract="handleContractCreation"
								/>
							</b-form-group>
						</b-col>
						<b-col class="mb-1" cols="12" md="4">
							<b-form-group label="Город">
								<select-cities v-model="order.payer_city" />
							</b-form-group>
						</b-col>
					</b-row>
				</b-card-actions> -->
                
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
                                            :class="{selectType: creationError.creationErrorSender && !order.sender_counterparty_type}"
                                            style="border: 0px solid white"
                                        >
                                            <v-select
                                                label="title"
                                                :reduce="(type) => type.id"
                                                :options="clientType"
                                                v-model="order.sender_counterparty_type"
                                                :class="{selectType: creationError.creationErrorSender && !order.sender_counterparty_type}"
                                            />
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
                                            @input="changeOrder($event, 'sender_counterparty')"
                                            @createClient="(name) => handleClientCreation(name, 'sender')"
                                        />
									</b-form-group>
								</b-col>
								<!-- <b-col cols="12">
									<b-form-group label="ФИО *">
										<b-form-input v-model="order.sender_full_name"></b-form-input>
									</b-form-group>
								</b-col> -->
								<b-col cols="12">
									<b-form-group label="Адрес *">
										<b-form-input v-model="order.sender_address"/>
									</b-form-group>
								</b-col>
								<b-col cols="12">
									<b-form-group 
										:label="order.sender_counterparty_type !== 'I' ? 'Email *' : 'Email'"
									>
										<b-form-input v-model="order.sender_email"/>
									</b-form-group>
								</b-col>
								<b-col cols="12" md="4" v-if="order.sender_counterparty_type !== 'E'">
									<b-form-group label="Серия паспорта">
										<b-form-input
                                            v-model="order.sender_passport_series"
                                            type="number"
                                            max="4"
                                            :formatter="serieFormatter"
                                        />
									</b-form-group>
								</b-col>
								<b-col cols="12" md="4" v-if="order.sender_counterparty_type !== 'E'">
									<b-form-group label="Номер паспорта">
										<b-form-input
                                            v-model="order.sender_passport_no"
                                            type="number"
                                            max="6"
                                            :formatter="passportNumberFormatter"
                                        />
									</b-form-group>
								</b-col>

								<!-- <b-col cols="12" v-if="order.sender_counterparty_type === 'E'">
									<b-form-group label="Расчетный счет">
										<b-form-input
											v-model="order.sender_bank_account"
										/>
									</b-form-group>
								</b-col>

								<b-col cols="12" v-if="order.sender_counterparty_type === 'E'">
									<b-form-group label="ОКПО">
										<b-form-input
											v-model="order.sender_OKPO"
										/>
									</b-form-group>
								</b-col>

								<b-col cols="12" v-if="order.sender_counterparty_type === 'E'">
									<b-form-group label="Банк">
										<b-form-input
											v-model="order.sender_bank"
										/>
									</b-form-group>
								</b-col>

								<b-col cols="12" v-if="order.sender_counterparty_type === 'E'">
									<b-form-group label="ОКВЭД">
										<b-form-input
											v-model="order.sender_OKVED"
										/>
									</b-form-group>
								</b-col> -->

								<!-- Добавить доп проверку -->
								<!-- <b-col cols="12" v-if="order.sender_counterparty_type === 'E'">
									<b-form-group label="КПП">
										<b-form-input
											v-model="order.sender_KPP"
										/>
									</b-form-group>
								</b-col>

								<b-col cols="12" v-if="order.sender_counterparty_type === 'E'">
									<b-form-group label="БИК">
										<b-form-input
											v-model="order.sender_BIK"
										/>
									</b-form-group>
								</b-col>

								<b-col cols="12" v-if="order.sender_counterparty_type === 'E'">
									<b-form-group label="ОГРН">
										<b-form-input
											v-model="order.sender_OGRN"
										/>
									</b-form-group>
								</b-col>

								<b-col cols="12" v-if="order.sender_counterparty_type === 'E'">
									<b-form-group label="Корр. счет">
										<b-form-input
											v-model="order.sender_correspondent_account"
										/>
									</b-form-group>
								</b-col> -->

								<b-col
									cols="12"
								>
									<validation-provider #default="{ errors }" rules="required">
										<b-form-group
											:invalid-feedback="errors[0]"
											label="Сотрудники *"
										>
											<!-- <b-row class="">
												<b-col class="text-center text-white border border-dark bg-secondary py-1" cols="2">
                            					</b-col>
												<b-col class="text-center text-white border border-dark bg-secondary py-1" cols="8">
													Номер телефона
												</b-col>
												<b-col class="text-center text-white border border-dark bg-secondary font-weight-bold plus" cols="4" @click="addPhone('sender')">
													+
												</b-col>
											</b-row> -->
											<b-row class="">
												<b-col class="text-center text-white border border-dark bg-secondary py-1" cols="2">
												</b-col>
												<b-col class="text-center text-white border border-dark bg-secondary py-1" cols="8">
													Сотрудники
												</b-col>
												<b-col class="text-center text-white border border-dark bg-secondary font-weight-bold plus" cols="2" @click="addPhone('sender')">
													+
												</b-col>
											</b-row>
											<b-row 
												v-for="(phone, i) in order.sender_phones"
												:key="i"
											>
												<b-col
													class="d-flex text-center border border-secondary"
													cols="2"
												>
													<b-form-checkbox
														:id="phone + phone.phone_number + ''"
														:name="phone.phone_number"
														class="align-self-center justify-self-center"
														@change="onPhoneSelect('sender_phones', i)"
													></b-form-checkbox>
												</b-col>
												<b-col class=" border border-secondary px-0" cols="8">
													<!-- <b-form-input
														v-model="phone.phone_number"
														:state="errors.length > 0 ? false : null"
														v-maska
														placeholder="+71234567890"
														data-maska="+7##########"
													/> -->
													<b-form-input
														v-model="phone.phone_number"
														:state="errors.length > 0 ? false : null"
														type="tel"
														placeholder="Номер телефона"
														style="margin-top: 15px;"
													/>
													<!-- <b-form-input
														v-model="order.sender_phones[i].position"
														type="text"
														:state="errors.length > 0 ? false : null"
														placeholder="Должность"
														style="margin-top: 15px;"
													/> -->
													<b-form-input
														v-model="order.sender_phones[i].full_name"
														type="text"
														:state="errors.length > 0 ? false : null"
														placeholder="ФИО"
														style="margin-top: 15px; margin-bottom: 15px;"
													/>
													<!-- <b-form-input
														v-model="order.sender_phones[i].email"
														type="email"
														:state="errors.length > 0 ? false : null"
														placeholder="Email"
														style="margin-top: 15px; margin-bottom: 15px;"
													/> -->
												</b-col>
												<b-col class="text-center border border-secondary" cols="2" @click="deletePhone('sender', i)">
													<b-icon icon="trash" style="margin-top: 50px;"></b-icon>
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
                                            :class="{selectType: creationError.creationErrorRecipient && !order.recipient_counterparty_type}"
                                            style="border: 0px solid white"
                                        >
                                            <v-select
                                                label="title"
                                                :reduce="(type) => type.id"
                                                :options="clientType"
                                                v-model="order.recipient_counterparty_type"
                                                :class="{selectType: creationError.creationErrorRecipient && !order.recipient_counterparty_type}"
                                            />
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
                                            @input="changeOrder($event, 'recipient_counterparty')"
                                            @createClient="(name) => handleClientCreation(name, 'recipient')"
                                        />
									</b-form-group>
								</b-col>
								<!-- <b-col cols="12">
									<b-form-group label="ФИО *">
										<b-form-input v-model="order.recipient_full_name"/>
									</b-form-group>
								</b-col> -->
								<b-col cols="12">
									<b-form-group label="Адрес *">
										<b-form-input v-model="order.recipient_address"/>
									</b-form-group>
								</b-col>
								<b-col cols="12">
									<b-form-group 
										:label="order.recipient_counterparty_type !== 'I' ? 'Email *' : 'Email'"
									>
										<b-form-input v-model="order.recipient_email"/>
									</b-form-group>
								</b-col>
								<b-col cols="12" md="4" v-if="order.recipient_counterparty_type !== 'E'">
									<b-form-group label="Серия паспорта">
										<b-form-input
                                            v-model="order.recipient_passport_series"
                                            type="number"
                                            max="4"
                                            :formatter="serieFormatter"
                                        />
									</b-form-group>
								</b-col>
								<b-col cols="12" md="4" v-if="order.recipient_counterparty_type !== 'E'">
									<b-form-group label="Номер паспорта">
										<b-form-input
                                            v-model="order.recipient_passport_no"
                                            type="number"
                                            max="6"
                                            :formatter="passportNumberFormatter"
                                        />
									</b-form-group>
								</b-col>
								

								<!-- <b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
									<b-form-group label="Расчетный счет">
										<b-form-input
											v-model="order.recipient_bank_account"
										/>
									</b-form-group>
								</b-col>

								<b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
									<b-form-group label="ОКПО">
										<b-form-input
											v-model="order.recipient_OKPO"
										/>
									</b-form-group>
								</b-col>

								<b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
									<b-form-group label="Банк">
										<b-form-input
											v-model="order.recipient_bank"
										/>
									</b-form-group>
								</b-col>

								<b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
									<b-form-group label="ОКВЭД">
										<b-form-input
											v-model="order.recipient_OKVED"
										/>
									</b-form-group>
								</b-col> -->

								<!-- Добавить доп проверку -->
								<!-- <b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
									<b-form-group label="КПП">
										<b-form-input
											v-model="order.recipient_KPP"
										/>
									</b-form-group>
								</b-col>

								<b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
									<b-form-group label="БИК">
										<b-form-input
											v-model="order.recipient_BIK"
										/>
									</b-form-group>
								</b-col>

								<b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
									<b-form-group label="ОГРН">
										<b-form-input
											v-model="order.recipient_OGRN"
										/>
									</b-form-group>
								</b-col>

								<b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
									<b-form-group label="Корр. счет">
										<b-form-input
											v-model="order.recipient_correspondent_account"
										/>
									</b-form-group>
								</b-col> -->

								<b-col
									cols="12"
								>
									<validation-provider #default="{ errors }" rules="required">
										<b-form-group
											:invalid-feedback="errors[0]"
											label="Сотрудники *"
										>
											<b-row class="">
												<b-col class="text-center text-white border border-dark bg-secondary py-1" cols="2">
												</b-col>
												<b-col class="text-center text-white border border-dark bg-secondary py-1" cols="8">
													Сотрудники
												</b-col>
												<b-col class="text-center text-white border border-dark bg-secondary font-weight-bold plus" cols="2" @click="addPhone('recipient')">
													+
												</b-col>
											</b-row>
											<b-row 
												v-for="(phone, i) in order.recipient_phones"
												:key="i"
											>
												<b-col class="d-flex text-center border border-secondary" cols="2">
													<b-form-checkbox
														:id="phone + phone.phone_number + ''"
														:name="phone.phone_number"
														class="align-self-center justify-self-center"
														@change="onPhoneSelect('recipient_phones', i)"
													></b-form-checkbox>
												</b-col>
												<b-col class=" border border-secondary px-0" cols="8">
													<!-- <b-form-input
														v-model="phone.phone_number"
														:state="errors.length > 0 ? false : null"
														v-maska
														placeholder="+71234567890"
														data-maska="+7##########"
													/> -->
													<b-form-input
														v-model="phone.phone_number"
														:state="errors.length > 0 ? false : null"
														type="tel"
														placeholder="Номер телефона"
														style="margin-top: 15px;"
													/>
													<!-- <b-form-input
														v-model="order.recipient_phones[i].position"
														type="text"
														:state="errors.length > 0 ? false : null"
														placeholder="Должность"
														style="margin-top: 15px;"
													/> -->
													<b-form-input
														v-model="order.recipient_phones[i].full_name"
														type="text"
														:state="errors.length > 0 ? false : null"
														placeholder="ФИО"
														style="margin-top: 15px; margin-bottom: 15px;"
													/>
													<!-- <b-form-input
														v-model="order.recipient_phones[i].email"
														type="email"
														:state="errors.length > 0 ? false : null"
														placeholder="Email"
														style="margin-top: 15px; margin-bottom: 15px;"
													/> -->
												</b-col>
												<b-col class="text-center border border-secondary" cols="2" @click="deletePhone('recipient', i)">
													<b-icon icon="trash" style="margin-top: 50px;"></b-icon>
												</b-col>
											</b-row>
										</b-form-group>
									</validation-provider>
								</b-col>
							</b-row>
						</b-card-actions>
					</b-col>
				</b-row>
				<b-card-actions title="Информация об оплате" actionCollapse>
					<b-row>
						<b-col cols="10" class="px-2">
							<b-form-group>
								<b-row class="d-flex justify-content-between">
									<b-form-radio
										v-model="order.payment_type"
										name="some-radios"
										:value="'SC'"
									>
										Отправитель нал
									</b-form-radio>
									<b-form-radio
										v-model="order.payment_type"
										name="some-radios"
										:value="'RC'"
									>
										Получатель нал
									</b-form-radio>
									<b-form-radio
										v-model="order.payment_type"
										name="some-radios"
										:value="'CS'"
									>
										По договору отправителя
									</b-form-radio>
									<b-form-radio
										v-model="order.payment_type"
										name="some-radios"
										:value="'CR'"
									>
										По договору получателя
									</b-form-radio>
								</b-row>
							</b-form-group>
						</b-col>
					</b-row>
					<b-row>
						<b-col class="my-1" cols="12" md="6">
							<b-form-group label="Наименование контрагента *">
								<select-clients
									:reduce="(client) => client.id"
									:disabled="true"
									:value="order.payer_counterparty"
								/>
							</b-form-group>
						</b-col>
						<b-col class="my-1" cols="12" md="6" v-show="order.payment_type == 'CS' || order.payment_type == 'CR'">
							<b-form-group label="Договор">
							<!-- <b-form-input v-model="order.contract" :disabled="readOnly"></b-form-input> -->
								<select-contracts
									:reduce="(cont) => cont.id"
									:value="order.contract"
									:payerId="order.payer_counterparty"
									@input="changeOrder($event, 'contract')"
									@createContract="handleContractCreation"
								/>
							</b-form-group>
						</b-col>
					</b-row>
					<!-- <b-row class="">
						<b-col class="text-start py-1" cols="4">
							Услуга
						</b-col>
						<b-col class="text-start py-1" cols="4">
							Срок доставки, дни
						</b-col>
						<b-col class="text-start py-1" cols="4">
							Стоимость, руб
						</b-col>
					</b-row>
					<b-row 
						class="service-table"
						v-for="(service, i) in services"
						:key="i"
					>
						<b-col  class="py-1" cols="4">
							{{service.name}}
						</b-col>
						<b-col class="py-1" cols="4">
							{{service.date}}
						</b-col>
						<b-col class="py-1" cols="4">
							{{service.price}}
						</b-col>
					</b-row> -->
					<b-row>
						<b-col cols="5" class="mt-2" @click="() => additionalService = !additionalService">
							<b-icon-chevron-up v-if="additionalService" variant="primary"/>
							<b-icon-chevron-down v-if="!additionalService" variant="primary"/>
							<span class="header-additional-service">Дополнительные услуги</span>
						</b-col>
					</b-row>
					<b-row v-if="additionalService && services.length">
						<b-col>
							<b-row 
								class="service" 
								v-for="(service, i) in services" 
								:key="service.id"
							>
								<b-col cols="12" md="8">
									<b-form-checkbox
										:id="`checkbox-${[service.id]}-service`"
                                        :name="`checkbox-${[service.id]}-service`"
                                        @change="handleOrderService(service)"
									>
										{{service.name}}
									</b-form-checkbox>
								</b-col>
								<b-col cols="12" md="4">
									<b-form-group>
										<b-form-input
											type="number"
                                            :id="`input-${[service.id]}-service-price`"
											:name="`input-${[service.id]}-service-price`"
                                            @input="handleOrderServicePrice($event, service)"
											:state="(validationServices.findIndex(item => item.service === service.id) !== -1) ? false : null"
										/>
									</b-form-group>
								</b-col>
							</b-row>
						</b-col>
					</b-row>
				</b-card-actions>
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
    import SelectContracts from "@/components/ui/selectContracts/selectContracts.vue";

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
		BIconChevronUp,
		BIconChevronDown,
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
			BIconChevronUp,
			BIconChevronDown,

			vSelect,
			SelectCities,
			SelectClients,
            SelectContracts,
		},
		directives: { maska: vMaska, "b-tooltip": VBTooltip },
		data() {
			return {
                services: [],
				validationServices: [],
            	additionalService: true,
				// orderPlacesFields: [
				// 	{ key: "barcode", label: "Штрих-код" },
				// 	{ key: "place_no", label: "№ места" },
				// 	{ key: "length", label: "Длина, см" },
				// 	{ key: "width", label: "Ширина, см" },
				// 	{ key: "height", label: "Высота, см" },
				// 	{ key: "weight", label: "Фактический вес, кг" },
				// 	{ key: "status", label: "Статус" },
				// 	{ key: "rack", label: "Rack" },
				// 	{ key: "tare", label: "tare" },
				// 	// { key: "description", label: "Примечание" },
				// ],
				orderPlacesFields: [
					{ key: "place_no", label: "№ места" },
					{ key: "length", label: "Длина, см" },
					{ key: "width", label: "Ширина, см" },
					{ key: "height", label: "Высота, см" },
					{ key: "weight", label: "Фактический вес, кг" },
					{ key: "seal_number", label: "Пломба" },
					/* { key: "rack", label: "Rack" },
					{ key: "tare", label: "Tare" }, */
					// { key: "description", label: "Примечание" },
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
                contracts: [],
				order: {
					// status: 0,
					type: "",
					mode: "",
					sender: 0,
					recipient: 0,
					payer: 0,
					comment: "",
					delivery_date: '',
                    contract: null,
					payment_type: 'SC',
                    payer_counterparty: null,
                    sender_counterparty: null,
                    sender_counterparty_type: '',
					sender_phones: [{}],
                    sender_address: '',
                    sender_passport_series: '',
                    sender_passport_no: '',
                    sender_city: null,
                    recipient_city: null,
                    recipient_counterparty: null,
                    recipient_counterparty_type: '',
					recipient_phones: [{}],
                    recipient_address: '',
                    recipient_email: '',
                    recipient_passport_series: '',
                    recipient_passport_no: '',
					places: [],
					products: [],
                    order_services: [],
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
					// bank_account: '',
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

					bank: null,
					KPP: null,
					BIK: null,
					correspondent_account: null,
					bank_account: null,
					OKPO: null,
					OKVED: null,
					OGRN: null,
					EDO: null,
				},
				creationError: {
					creationErrorSender: false,
					creationErrorRecipient: false,
				},
			};
		},
		watch: {
			'order.recipient_counterparty'() {
				// console.log('watch 1 - ', this.order.sender_counterparty)
				if (Number.isFinite(this.order.recipient_counterparty)) {
					const id = this.order.recipient_counterparty;
					this.addCounterparty(id, 'recipient');
					if (this.order.payment_type == 'RC' || this.order.payment_type == 'CR') {
						this.order.payer_counterparty = this.order.recipient_counterparty
					}
					return;
				};
			},
			'order.sender_counterparty'() {
				if (Number.isFinite(this.order.sender_counterparty)) {
					// console.log('watch 2 - ', this.order.sender_counterparty)
					const id = this.order.sender_counterparty;
					this.addCounterparty(id, 'sender');
					if (this.order.payment_type == 'SC' || this.order.payment_type == 'CS') {
						this.order.payer_counterparty = this.order.sender_counterparty
					}
					return;
				};	
			},
			'order.payer_counterparty'() {
				if (Number.isFinite(this.order.payer_counterparty)) {
					// console.log('watch 3 - ', this.order.sender_counterparty)
					const id = this.order.payer_counterparty;
					this.addCounterparty(id, 'payer');
                    // this.addPayerContracts(id);
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
					this.creationError.creationErrorRecipient = false;
					this.newUser.client_phones.splice(0, 1, {phone_number : this.order.recipient_phone});
				}
			},
			'order.sender_phone'() {
				if (this.order.sender_phone.length === 12) {
					this.creationError.creationErrorSender = false;
					this.newUser.client_phones.splice(0, 1, {phone_number : this.order.sender_phone});
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
			},
			'order.sender_counterparty_type'() {
				this.newUser.type = this.order.sender_counterparty_type;
			},
			'order.payment_type' () {
				this.order.payer_counterparty = 
					(this.order.payment_type == 'SC' || this.order.payment_type == 'CS') 
						?
						this.order.sender_counterparty
						:
						this.order.recipient_counterparty
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
            serieFormatter(value) {
                if (!value) {
                    return null;
                }
                return Number(String(value).substring(0, 4));
            },
            passportNumberFormatter(value) {
                 if (!value) {
                    return null;
                }
                return Number(String(value).substring(0, 6));
            },
			fetchStatus() {
				this.$api.orderStatus.getOrderStatusList()
					.then((response) => {
						this.orderStatus = response.data.results;
					});
			},
            changeOrder(value, key) {
                this.order[key] = value;
            },
			onPhoneSelect(counterparty, index) {
				if (!this.order[counterparty][index].to_print) {
					this.order[counterparty][index].to_print = true;
					return;
				}
				this.order[counterparty][index].to_print = false;
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
										console.log('response - ', response)
										let error = '';
										if (response.data.order_services) {
											this.validationServices = this.order.order_services.filter(item => !item.price);
											console.log('this.validationServices - ', this.validationServices);
											error = 'Поле \'Дополнительные услуги\' не может быть пустым'
										}
										this.$toast({
											component: ToastificationContent,
											props: {
												title: "Ошибка",
												text: "Заказ не создан. " + error,
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
            handleOrderService(currentService) {
                // console.log('currentService - ', currentService)
                const serviceIndex = this.order.order_services.findIndex(serv => serv.service === currentService.id);
                if (serviceIndex === -1) {
                    const newService = {
                        service: currentService.id,
                        price: null,
                    };
                    this.order.order_services.push(newService);
					// this.validationServices.push(newService);
                    return;
                }
				// this.validationServices.push(this.order.order_services[serviceIndex]);
                this.order.order_services.splice(serviceIndex, 1);
			},
            handleOrderServicePrice(event, currentService) {
                const serviceIndex = this.order.order_services.findIndex(serv => serv.service === currentService.id);
				const valIndex = this.validationServices.findIndex(item => item.service === currentService.id);
				if (valIndex !== -1) {
					this.validationServices = this.validationServices.filter(item => item.service !== currentService.id);
				}
                if (serviceIndex === -1) return;
                this.order.order_services[serviceIndex].price = +event;
			},
			deleteProduct(id) {
				let inx = this.order.products.findIndex((product) => product.place_no === id);
				if (inx >= 0) {
					this.order.products.splice(inx, 1);
				};
			},
			changeCounterpartyParams(data, name) {
				// console.log('data - ', data)
				for (let key in data) {
					if (data[key] && key === 'id') {
						this.order = {...this.order, [name + '_counterparty']: data.id};
						continue;
					};
					if (data[key] && key === 'type') {
						this.order = {...this.order, [name + '_counterparty_type']: data.type};
						continue;
					};
					if (data[key] && key === 'name') {
						this.order = {...this.order, [name + '_full_name']: data.name};
						continue;
					};
					if (data[key] && key === 'client_phones') {
                        if (data.client_phones && data.client_phones.length) {
                            this.order = {...this.order, [name + '_phones']: data.client_phones.map((it) => ({...it}))}
                        } else {
                            this.order = {...this.order, [name + '_phones']: [{phone_number: ''}]};
                        }
						continue;
					};
					if (data[key]) {
						this.order = {...this.order, [name + '_' + key]: data[key]};
					};
				}
			},
			addCounterparty(id, name) {
				this.$api.clients.getClient(id).then((response) => {
					this.changeCounterpartyParams(response.data, name);	
				});
			},
            // addPayerContracts(id) {
            //     this.$api.clients.getClientContracts(id).then(response => {
            //         if (response.status > 203) {
            //             return;
            //         }
            //         this.contracts = response.data;
            //     })
            // },
			addPhone(name) {
				if (this.order[name + '_phones'][0].phone_number){
					// this.order[name + '_phones'].unshift({});
					this.order[name + '_phones'].push({});
				}
			},
			deletePhone(name, index) {
				this.order[name + '_phones'].splice(index, 1);
				if (this.phones.length === 0){
					this.phones.unshift({
						phone_number: ''
					})
				}
				// if (this.order[name + '_phones'].length !== 0){
					// this.order[name + '_phones'].unshift({});
				// 	this.order[name + '_phones'].pop({});
				// }
            },
			addClient(propName) {
				this.$api.clients.addNewClient(this.newUser)
					.then((response) => {
						// console.log('response - ', response);
                        if (response.status > 203) {
                            return;
                        }
						this.order[propName + '_counterparty'] = response.data.id;
						// this.newUser.name = '';
						// this.newUser.type = '';
						// this.newUser.client_phones.pop();
						this.creationError.creationErrorRecipient = false;
						this.creationError.creationErrorSender = false;
					})
					.catch((error) => {console.log('error - ', error)})
			},
			handleClientCreation(clientName, orderPropName) {
				this.newUser.name = clientName.trim();
                if (orderPropName === 'sender') {
                    this.newUser = {
                        INN: '',
                        address: this.order.sender_address,
                        bank_account: '',
                        city: this.order.sender_city ? this.order.sender_city.id : null,
                        client_phones: this.order.sender_phones,
                        email: '',
                        // id: null,
                        name: clientName.trim(),
                        passport_no: this.order.sender_passport_no, 
                        passport_series: this.order.sender_passport_series,
                        position: '',
                        type: this.order.sender_counterparty_type,
                        web: '',
                    };
                } else if (orderPropName === 'recipient') {
                    this.newUser = {
                        INN: '',
                        address: this.order.recipient_address,
                        bank_account: '',
                        city: this.order.recipient_city ? this.order.recipient_city.id : null,
                        client_phones: this.order.recipient_phones,
                        email: this.order.recipient_email,
                        // id: null,
                        name: clientName.trim(),
                        passport_no: this.order.recipient_passport_no, 
                        passport_series: this.order.recipient_passport_series,
                        position: '',
                        type: this.order.recipient_counterparty_type,
                        web: '',
                    };
                }
				if ((!this.newUser.type) && (this.newUser.name)) {
					if (orderPropName === 'sender') this.creationError.creationErrorSender = true;
					if (orderPropName === 'recipient') this.creationError.creationErrorRecipient = true;
					return;
				};
				this.addClient(orderPropName);
			},
            handleContractCreation(contract) {
                this.$api.clients.createClientContract(this.order.payer_counterparty, contract)
                    .then(response => {
                        if (response.status > 203) {
                            return;
                        }
                        this.order.contract = response.data.id
                    })
            },
            addServicesList() {
                this.$api.services.getServices(0, 30)
                    .then(response => {
                        if (response.status > 203) return;
                        this.services = response.data;
                    })
            },
		},
		mounted() {
			this.fetchStatus();
            this.addServicesList();
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

	.selectType {
		color: red;
		border: 2px solid red; 
		border-radius: 4px;
	};

	.service {
		border-bottom: 1px solid #E7E9EB;

		
		.form-group {
			margin-top: 1rem;
		}

		div {
			display: flex;
			align-items: center;
		}

		.form-group {
			width: 100%;
		}

	}


	.additional-service {
		.card-header {
			justify-content: start;
			flex-direction: row-reverse;
		}
	}

	.header-additional-service {
		margin-left: 5px;
		color: #3D78B4;
		font-size: 14px;
		text-decoration: underline;
	}

	.service-table:nth-child(2n - 1) {
		background: #0B1F3508;
	}

	.validation-service {
		border-color: red
	}
</style>
