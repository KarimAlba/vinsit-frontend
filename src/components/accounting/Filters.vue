<template>
	<div>
		<b-card>
			<validation-observer v-slot="{ invalid }">
				<b-row>
                    <b-col cols="12" md="4">
						<validation-provider #default="{ errors }">
							<b-form-group :invalid-feedback="errors[0]" label="Компания">
                                <v-select
                                    label="name"
                                    @search="onSearchCompanies"
                                    :reduce="(company) => company.id"
									v-model="form.company"
                                    :options="companies"
                                    :placeholder="'Компания'"
                                    :filterable="false"
                                >
                                    <template #no-options="{ search }">
                                        {{ search.length ? "Ничего не найдено" : "Введите запрос" }}
                                    </template>
                                </v-select>
							</b-form-group>
						</validation-provider>
					</b-col>
					<b-col cols="12" md="4">
						<validation-provider #default="{ errors }">
							<b-form-group :invalid-feedback="errors[0]" label="Клиент (физ. лица)">
								<select-clients
									:reduce="(client) => client.id"
                                    :company="form.company"
									v-model="form.client"
                                    :disabledAddBtn="true"
								/>
							</b-form-group>
						</validation-provider>
					</b-col>
                    <b-col cols="12" md="4">
						<validation-provider #default="{ errors }" rules="required">
							<b-form-group :invalid-feedback="errors[0]" label="Юр. лицо">
                                <v-select
                                    label="full_name_and_type"
                                    @search="onSearchExecutors"
                                    :reduce="(executor) => executor.id"
									v-model="form.executor"
                                    :options="executors"
                                    :placeholder="'Юр. лицо'"
                                    :filterable="true"
                                >
                                    <template #no-options="{ search }">
                                        {{ search.length ? "Ничего не найдено" : "Введите запрос" }}
                                    </template>
                                </v-select>
							</b-form-group>
						</validation-provider>
					</b-col>
				</b-row>
                <b-row>
                    <b-col cols="12" md="4">
						<validation-provider #default="{ errors }" rules="required">
							<b-form-group :invalid-feedback="errors[0]" label="Период заказа">
								<app-datepicker @selectedDates="changeDates" />
								<input type="hidden" v-model="form.start_date" />
								<input type="hidden" v-model="form.end_date" />
							</b-form-group>
						</validation-provider>
					</b-col>
                    <b-col cols="12" md="4" v-if="type !== 'reconciliation_act'">
                        <b-form-group label="Банковский счет">
                            <b-form-input
                                type="text"
                                v-model="form.bank_account"
                            />
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row v-if="type === 'reconciliation_act'">
                    <b-col cols="12" md="4">
                        <b-form-group label="Режим сверки" v-slot="{ ariaDescribedby }">
                            <b-form-radio
                                class="mb-1"
                                :aria-describedby="ariaDescribedby"
                                value="A"
                                v-model="form.type"
                            >
                                Только по актам
                            </b-form-radio>
                            <b-form-radio
                                :aria-describedby="ariaDescribedby"
                                value="O"
                                v-model="form.type"
                            >
                                По всем заказам
                            </b-form-radio>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row v-if="type === 'act'">
                    <b-col cols="12" md="4">
                        <b-form-checkbox
                            id="payment-check"
                            v-model="is_payment_check"
                            name="payment-check"
                            :value="true"
                            :unchecked-value="false"
                        >
                            Счёт
                        </b-form-checkbox>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="mt-1 d-flex justify-content-end" cols="12" md="12">
						<b-button
							:disabled="invalid"
							variant="primary"
							@click="createDocument"
						>
							Сформировать
						</b-button>
					</b-col>
                </b-row>
			</validation-observer>
		</b-card>
	</div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email, confirmed, password } from "@validations";
import vSelect from "vue-select";
import {
	BRow,
	BCol,
	BCard,
	BButton,
	BFormGroup,
    BFormInput,
	BFormRadio,
	BFormCheckbox,
} from "bootstrap-vue";
import AppDatepicker from "@/@core/components/app-datepicker/AppDatepicker";
import SelectClients from "@/components/ui/selectClients/selectClients.vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
	props: {
		type: {
			type: String,
			validator: function (value) {
				return ["payment", "invoice", "act", "upd", "reconciliation_act", "check"].includes(value);
			},
		},
	},
	components: {
		BRow,
		BCol,
		BCard,
		BButton,
		BFormGroup,
		BFormRadio,
		BFormCheckbox,
        BFormInput,
		AppDatepicker,
		SelectClients,
        vSelect,
		ValidationProvider,
		ValidationObserver,
	},
	data() {
		return {
            companies: [],
            executors: [],
            bank_account: '',
            is_payment_check: false,

			form: {
				client: null,
                executor: null,
                company: null,
				start_date: null,
				end_date: null,
                is_consider_saldo: false,
                type: 'O',
                bank_account: null,
			},
		};
	},
    watch: {
        'form.company'() {
            this.form.client = null;
        }
    },
	methods: {
		fetchCompanies: _.debounce((search, loading, vm) => {
            vm.$api.clients
                .getClients({ search, limit: 100, is_company: true }).then((response) => {
                    vm.companies = response.data.results;
                    loading ? loading(false) : null;
                });
        }, 500),
        fetchExecutors: _.debounce((loading, vm) => {
            vm.$api.executors.getExecutors({ limit: 100 }).then((response) => {
                vm.executors = response.data;
                loading ? loading(false) : null;
            });
        }, 500),
        onSearchCompanies(search, loading) {
            this.disabledBtn = true;
            if (search.length) {
                // this.disabledBtn = true;
                loading(true);
                this.fetchCompanies(search, loading, this);
            };
        },
        onSearchExecutors(search, loading) {
            this.disabledBtn = true;
            if (search.length) {
                // this.disabledBtn = true;
                loading(true);
                this.fetchExecutors(search, loading, this);
            };
        },
		changeDates(dates) {
			this.form.start_date = this.dayjs(dates.start).format("YYYY-MM-DD");
			this.form.end_date = this.dayjs(dates.end).format("YYYY-MM-DD");
		},
		createDocument() {
			switch (this.type) {
				case "payment":
					this.form.is_payment_check = true;
					this.form.is_invoice = false;
					this.form.is_act = false;
					this.form.is_upd = false;
				break;
				case "invoice":
					this.form.is_payment_check = false;
					this.form.is_invoice = true;
					this.form.is_act = false;
					this.form.is_upd = false;
				break;
				case "act":
					this.form.is_payment_check = this.is_payment_check;
					this.form.is_invoice = false;
					this.form.is_act = true;
					this.form.is_upd = false;
				break;
				case "upd":
					this.form.is_payment_check = false;
					this.form.is_invoice = false;
					this.form.is_act = false;
					this.form.is_upd = true;
				break;
                // case "reconciliation_act":
				// 	this.form.is_payment_check = false;
				// 	this.form.is_invoice = false;
				// 	this.form.is_act = false;
				// 	this.form.is_upd = false;
				// break;
			}

            if (this.type === 'reconciliation_act') {
                this.$api.reconciliationActs.createReconciliationAct({
                    ...this.form,
                    client: this.form.client || undefined,
                    bank_account: this.form.bank_account || undefined,
                    company: this.form.company || undefined,
                }).then((response) => {

                    if (response.status > 203) {
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: "Ошибка",
                                text: "Не удалось сформировать",
                                icon: "XIcon",
                                variant: "danger",
                            },
                        });
                        return;
                    };
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: "Успешно",
                            text: "Документ сформирован",
                            icon: "CheckCircleIcon",
                            variant: "success",
                        },
                    });
                    this.$router.go();
                });
                return;
            }

			this.$api.payDoc.createPaymentDocuments({
                ...this.form,
                client: this.form.client || undefined,
                bank_account: this.form.bank_account || undefined,
                company: this.form.company || undefined,
            }).then((response) => {
				if (response.status > 203) {
                    console.log('response - ', response)
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: "Ошибка",
                            text: "Не удалось сформировать. " + response.data.non_field_errors,
                            icon: "XIcon",
                            variant: "danger",
                        },
                    });
                    return;
                };
                this.$toast({
					component: ToastificationContent,
					props: {
						title: "Успешно",
						text: "Документ сформирован",
						icon: "CheckCircleIcon",
						variant: "success",
					},
				});
			    this.$router.go();
			});
		},
	},
	mounted() {
		this.fetchCompanies('', null, this);
		this.fetchExecutors(null, this);
	},
};
</script>

<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";
</style>
