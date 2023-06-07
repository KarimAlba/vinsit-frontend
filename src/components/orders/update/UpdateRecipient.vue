<template>
    <b-card-actions title="Получатель" actionCollapse>
        <b-row>
        <b-col class="mb-1" cols="12">
            <b-form-group label="Тип контрагента *">
            <v-select
                label="title"
                :reduce="(type) => type.id"
                :options="clientType"
                :clearable="false"
                v-model="order.recipient_counterparty_type"
                :disabled="readOnly"
                @input="changeOrder($event, 'recipient_counterparty_type')"
            />
            </b-form-group>
        </b-col>

        <b-col class="mb-1" cols="12">
            <b-form-group label="Город *">
            <select-cities
                v-model="order.recipient_city"
                :disabled="readOnly"
                @input="changeOrder($event, 'recipient_city')"
            />
            </b-form-group>
        </b-col>

        <b-col class="mb-1" cols="12">
            <b-form-group label="Наименование контрагента *">
            <select-clients
                :reduce="(client) => client.id"
                v-model="order.recipient_counterparty"
                :disabled="readOnly"
                @input="changeOrder($event, 'recipient_counterparty')"
                @createClient="(name) => handleClientCreation(name)"
                :clearSearchOnBlur="false"
            />
            </b-form-group>
        </b-col>

        <b-col cols="12">
            <b-form-group label="ФИО *">
            <b-form-input
                v-model="order.recipient_full_name"
                :disabled="readOnly"
                @change="changeOrder($event, 'recipient_full_name')"
            />
            </b-form-group>
        </b-col>

        <b-col cols="12">
            <b-form-group label="Адрес">
            <b-form-textarea
                rows="3"
                max-rows="6"
                v-model="order.recipient_address"
                :disabled="readOnly"
                @change="changeOrder($event, 'recipient_address')"
            ></b-form-textarea>
            </b-form-group>
        </b-col>

        <b-col cols="12">
            <b-form-group label="Email *">
                <b-form-input 
                    v-model="order.recipient_email"
                    @change="changeOrder($event, 'recipient_email')"
                />
            </b-form-group>
        </b-col>

        <b-col cols="12" md="4" v-if="order.recipient_counterparty_type !== 'E'">
            <b-form-group label="Серия паспорта">
                <b-form-input
                    v-model="order.recipient_passport_series"
                    :disabled="readOnly"
                    @change="changeOrder($event, 'recipient_passport_series')"
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
                    :disabled="readOnly"
                    @change="changeOrder($event, 'recipient_passport_no')"
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
                        :disabled="readOnly"
                        @change="changeOrder($event, 'recipient_bank_account')"
                    />
                </b-form-group>
            </b-col>

            <b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
                <b-form-group label="ОКПО">
                    <b-form-input
                        v-model="order.recipient_okpo"
                        :disabled="readOnly"
                        @change="changeOrder($event, 'recipient_okpo')"
                    />
                </b-form-group>
            </b-col>

            <b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
                <b-form-group label="Банк">
                    <b-form-input
                        v-model="order.recipient_bank"
                        :disabled="readOnly"
                        @change="changeOrder($event, 'recipient_bank')"
                    />
                </b-form-group>
            </b-col>

            <b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
                <b-form-group label="ОКВЭД">
                    <b-form-input
                        v-model="order.recipient_okved"
                        :disabled="readOnly"
                        @change="changeOrder($event, 'recipient_okved')"
                    />
                </b-form-group>
            </b-col> -->

            <!-- Добавить доп проверку -->
            <!-- <b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
                <b-form-group label="КПП">
                    <b-form-input
                        v-model="order.recipient_KPP"
                        :disabled="readOnly"
                        @change="changeOrder($event, 'recipient_KPP')"
                    />
                </b-form-group>
            </b-col>

            <b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
                <b-form-group label="БИК">
                    <b-form-input
                        v-model="order.recipient_BIK"
                        :disabled="readOnly"
                        @change="changeOrder($event, 'recipient_BIK')"
                    />
                </b-form-group>
            </b-col>

            <b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
                <b-form-group label="ОГРН">
                    <b-form-input
                        v-model="order.recipient_OGRN"
                        :disabled="readOnly"
                        @change="changeOrder($event, 'recipient_OGRN')"
                    />
                </b-form-group>
            </b-col>

            <b-col cols="12" v-if="order.recipient_counterparty_type === 'E'">
                <b-form-group label="Корр. счет">
                    <b-form-input
                        v-model="order.recipient_correspondent_account"
                        :disabled="readOnly"
                        @change="changeOrder($event, 'recipient_correspondent_account')"
                    />
                </b-form-group>
            </b-col> -->

        <!-- <b-col cols="12" md="4" >
            <b-form-group label="Email">
            <b-form-input
                type="email"
                v-model="order.recipient_email"
                :disabled="readOnly"
                @change="changeOrder($event, 'recipient_email')"
            />
            </b-form-group>
        </b-col> -->

        <b-col
            cols="12"
        >
            <validation-observer ref="simpleRules">
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
                            <b-col class="text-center text-white border border-dark bg-secondary font-weight-bold plus" cols="2" @click="addPhone">
                                +
                            </b-col>
                        </b-row>
                        <b-row 
                            v-for="(phone, i) in phones"
                            :key="i"
                        >
                            <b-col
                                class="d-flex text-center border border-secondary"
                                cols="2"
                            >
                                <b-form-checkbox
                                    id="checkbox-1"
                                    v-model="phone.to_print"
                                    name="checkbox-1"
                                    class="align-self-center justify-self-center"
                                    :disabled="readOnly"
                                    @change="onPhoneSelect(i)"
                                ></b-form-checkbox>
                            </b-col>
                            <b-col class=" border border-secondary px-0" cols="8">
                                <!-- <b-form-input
                                    v-model="phone.phone_number"
                                    :state="errors.length > 0 ? false : null"
                                    :disabled="readOnly"
                                    v-maska
                                    placeholder="+71234567890"
                                    data-maska="+7##########"
                                    @blur="changeOrder(phones, 'recipient_phones')"
                                /> -->
                                <b-form-input
                                    v-model="phone.phone_number"
                                    :state="errors.length > 0 ? false : null"
                                    :disabled="readOnly"
                                    type="tel"
                                    placeholder="Номер телефона"
                                    @blur="changeOrder(phones, 'recipient_phones')"
                                    style="margin-top: 15px"
                                />
                                <validation-provider #default="{ errors }">
                                    <b-form-group
                                        :invalid-feedback="errors[0]"
                                        :state="!errors.length"
                                    >
                                        <b-form-input
                                            v-model="phones[i].position"
                                            type="text"
                                            :state="errors.length > 0 ? false : null"
                                            placeholder="Должность"
                                            @blur="changeOrder(phones, 'recipient_phones')"
                                            style="margin-top: 15px;"
                                        ></b-form-input>
                                    </b-form-group>
                                </validation-provider>
                                <validation-provider #default="{ errors }" >
                                    <b-form-group
                                        :invalid-feedback="errors[0]"
                                        :state="!errors.length"
                                    >
                                        <b-form-input
                                            v-model="phones[i].full_name"
                                            type="text"
                                            :state="errors.length > 0 ? false : null"
                                            @blur="changeOrder(phones, 'recipient_phones')"
                                            placeholder="ФИО"
                                        ></b-form-input>
                                    </b-form-group>
                                </validation-provider>
                                <validation-provider #default="{ errors }">
                                    <b-form-group
                                        :invalid-feedback="errors[0]"
                                        :state="!errors.length"
                                    >
                                        <b-form-input
                                            v-model="phones[i].email"
                                            type="email"
                                            :state="errors.length > 0 ? false : null"
                                            placeholder="Email"
                                        ></b-form-input>
                                    </b-form-group>
                                </validation-provider>
                            </b-col>
                            <b-col class="text-center border border-secondary" cols="2" @click="deletePhone(i)">
                                <b-icon icon="trash"></b-icon>
                            </b-col>
                        </b-row>
                    </b-form-group>
                </validation-provider>
            </validation-observer>
        </b-col>

        <!-- <b-col
            v-for="(phone, i) in order.recipient_phones"
            :key="i"
            cols="12"
            md="4"
        >
            <validation-provider #default="{ errors }" rules="required">
            <b-form-group :invalid-feedback="errors[0]" label="Номер телефона">
                <b-form-input
                v-model="phone.phone_number"
                :disabled="readOnly"
                :state="errors.length > 0 ? false : null"
                v-maska
                placeholder="+71234567890"
                data-maska="+7##########"
                ></b-form-input>
            </b-form-group>
            </validation-provider>
        </b-col> -->
        </b-row>
    </b-card-actions>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email, confirmed, password } from "@validations";
import { vMaska } from "maska";

import SelectCities from "@/components/ui/selectCities/selectCities.vue";
import SelectClients from "@/components/ui/selectClients/selectClients.vue";
import vSelect from "vue-select";
import BCardActions from "@/@core/components/b-card-actions/BCardActions.vue";

import {
    BOverlay,
    BRow,
    BCol,
    BCard,
    BIcon,
    BIconTrash,
    BFormInput,
    BFormGroup,
    VBTooltip,
    BFormTextarea,
    BFormCheckbox,
} from "bootstrap-vue";

export default {
    components: {
        ValidationProvider,
        ValidationObserver,
        BOverlay,
        BRow,
        BCol,
        BCard,
        BFormInput,
        BFormGroup,
        BFormTextarea,
        BFormCheckbox,
        SelectCities,
        SelectClients,
        vSelect,
        BIcon,
        BIconTrash,
        BCardActions,
        VBTooltip,
    },
    directives: { maska: vMaska, "b-tooltip": VBTooltip },
    props: {
        order: {
            type: Object,
            required: true,
        },
        readOnly: false,
    },
    data: () => ({
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
        phones: [],
        creationError: {
            creationErrorSender: false,
            creationErrorRecipient: false,
        },
    }),
    watch: {
        'order'() {
            this.phones = this.order.recipient_phones;
        },
    },
    computed: {
        ...mapGetters({
            clientType: "moduleClients/getClientType",
        }),
    },
    methods: {
        ...mapMutations({
            setSender: "moduleOrders/setOrderSender",
            setRecipient: "moduleOrders/setOrderRecipient",
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
        onPhoneSelect(index) {
            this.changeOrder(this.phones, 'recipient_phones');
        },
        async changeOrder(newVal, key) {
            let payload = {};
            payload[key] = newVal;
            if (key === 'recipient_counterparty') {
                await this.$api.clients.getClient(newVal).then(response => {
                    payload['recipient_phones'] = response.data.client_phones
                        .map((p, i) => ({
                            ...p,
                            to_print: i ? false : true
                        }))
                    payload['recipient_address'] = response.data.address;
                    payload['recipient_city'] = response.data.city;
                });
            }
            this.$api.orders.updateOrder(this.order.id, payload).then((response) => {
                if (response.status !== 400) {
                    if (key === 'recipient_counterparty') {
                        this.$emit('updateRecipient');
                        this.newUser.name = '';
                        this.newUser.type = '';
                        this.newUser.client_phones = [];
                    }
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
        addClient() {
            this.$api.clients.addNewClient(this.newUser)
                .then((response) => {
                    // console.log('response - ', response);
                    // this.order['recipient_id'] = response.data.id;
                    if (response.status > 203) {
                        return;
                    }
                    this.changeOrder(response.data.id, 'recipient_counterparty');
                    this.creationError.creationErrorRecipient = false;
                })
                .catch((error) => {console.log('error - ', error)})
        },
        handleClientCreation(clientName) {
            this.newUser = {
                INN: '',
                address: this.order.recipient_address,
                bank_account: '',
                city: this.order.recipient_city ? this.order.recipient_city.id : null,
                client_phones: [],
                email: '',
                // id: null,
                name: clientName.trim(),
                passport_no: this.order.recipient_passport_no, 
                passport_series: this.order.recipient_passport_series,
                position: '',
                type: this.order.recipient_counterparty_type,
                web: '',
            };
            if ((!this.newUser.type) && (this.newUser.name) && (!this.newUser.client_phones.length)) {
                this.creationError.creationErrorRecipient = true;
                return;
            };
            this.addClient();
        },
        addPhone() {
            // this.order[name + '_phones'].unshift({});
            this.phones.unshift({phone_number: ''});
        },
        deletePhone(index) {
            this.phones.splice(index, 1);
            this.changeOrder(this.phones, 'recipient_phones')
            if (this.phones.length === 0){
                this.phones.unshift({
                    phone_number: ''
                })
            }
        },
    },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";


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
</style>
