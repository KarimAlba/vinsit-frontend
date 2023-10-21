<template>
    <section class="order pb-5">
        <b-overlay :show="loading" rounded="sm">
        <template v-if="message">
            <h1>{{ message }}</h1>
        </template>
        <template v-else>
            <h1 class="mb-2">Новый контрагент</h1>
            <b-row>
                <b-col>
                    <b-card>
                    <b-card-title>Основная информация</b-card-title>
                    <table class="w-100">
                        <tr>
                            <td class="pb-1">Это компания?</td>
                            <td class="pb-1">
                                <b-form-checkbox
                                    id="is-company-check"
                                    v-model="client.is_company"
                                    name="is-company-check"
                                    :value="true"
                                    :unchecked-value="false"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="pb-1">Тип</td>
                            <td class="pb-1">
                                <!-- {{ getClientType(client.type) }} -->
                                <v-select
                                    label="title"
                                    :reduce="(type) => type.id"
                                    :options="clientType"
                                    :clearable="false"
                                    v-model="client.type"
                                    :disabled="readOnly"
                                />
                                <!-- @input="changeOrder($event, 'sender_counterparty_type')" -->
                            </td>
                        </tr>
                        <tr v-if="client.type === 'E'">
                            <td class="pb-1" >Форма<br>собственности</td>
                            <td>
                                <v-select
                                    label="short_name"
                                    :reduce="(type) => type.id"
                                    :options="formsOwnership"
                                    :clearable="false"
                                    v-model="client.form_of_ownership"
                                    :disabled="readOnly"
                                />
                            </td>
                        </tr>
                        <tr>
                        <td class="pb-1">Название / ФИО</td>
                        <td>
                            <validation-provider #default="{ errors }">
                                <b-form-group
                                    :invalid-feedback="errors[0]"
                                    :state="!errors.length"
                                >
                                    <b-form-input
                                        v-model="client.name"
                                        type="text"
                                        :state="errors.length > 0 ? false : null"
                                    ></b-form-input>
                                </b-form-group>
                            </validation-provider>
                        </td>
                        </tr>
                        <tr>
                            <td class="pb-1">Город</td>
                            <td>
                                <b-form-group>
                                    <select-cities
                                        v-model="client.city"
                                        :disabled="readOnly"
                                    />
                                    <!-- @input="changeOrder($event, 'sender_city')" -->
                                </b-form-group>
                            </td>
                        </tr>

                        <tr>
                        <td class="pb-1">Адрес</td>
                        <td>
                            <validation-provider #default="{ errors }">
                                <b-form-group
                                    :invalid-feedback="errors[0]"
                                    :state="!errors.length"
                                >
                                    <b-form-input
                                        v-model="client.address"
                                        type="text"
                                        :state="errors.length > 0 ? false : null"
                                    ></b-form-input>
                                </b-form-group>
                            </validation-provider>
                        </td>
                        </tr>

                        <tr v-if="client.type === 'E'">
                            <td class="d-flex flex-column align-items-start" style="padding-top: 10px">
                                Договор
                                <p class="add-phone-btn" @click="handleContractCreation">Добавить</p>
                            </td>
                            <td>
                                <p
                                    v-for="(contract, i) in contracts"
                                    :key="i"
                                    style="position: relative;"
                                >
                                <!-- <a :href="`tel:${phone.phone_number}`"
                                    >{{ i + 1 }}. {{ phone.phone_number }}</a
                                > -->
                                    <validation-provider #default="{ errors }">
                                        <b-form-input
                                            v-model="contract.value"
                                            :state="errors.length > 0 ? false : null"
                                            :disabled="readOnly"
                                            type="text"
                                            style="padding-right: 30px; box-sizing: border-box;"
                                        />
                                        <!-- @blur="changeOrder(phones, 'sender_phones')" -->
                                    </validation-provider>
                                    <span
                                        class="delete-phone-btn"
                                        v-if="contracts.length > 1"
                                        @click="deleteContract(i)"
                                    >
                                        <b-icon icon="trash"></b-icon>
                                    </span>
                                </p>
                            </td>
                        </tr>

                        <!-- <tr>
                        <td class="pb-1">Position</td>
                        <td class="pb-1">{{ client.address }}</td>
                        </tr> -->

                        <!-- <tr>
                        <td class="pb-1">Банковский Счет</td>
                        <td>
                            <validation-provider #default="{ errors }">
                                <b-form-group
                                    :invalid-feedback="errors[0]"
                                    :state="!errors.length"
                                >
                                    <b-form-input
                                        v-model="client.bank_account"
                                        type="text"
                                        :state="errors.length > 0 ? false : null"
                                    ></b-form-input>
                                </b-form-group>
                            </validation-provider>
                        </td>
                        </tr> -->
                        <tr v-if="client.type !== 'E'">
                        <td class="pb-1">Серия паспорта</td>
                        <td>
                            <validation-provider #default="{ errors }">
                                <b-form-group
                                    :invalid-feedback="errors[0]"
                                    :state="!errors.length"
                                >
                                    <b-form-input
                                        v-model="client.passport_series"
                                        :disabled="readOnly"
                                        type="number"
                                        max="4"
                                        :formatter="serieFormatter"
                                    />
                                </b-form-group>
                            </validation-provider>
                        </td>
                        </tr>
                        <tr v-if="client.type !== 'E'">
                        <td class="pb-1">Номер паспорта</td>
                        <td>
                            <validation-provider #default="{ errors }">
                                <b-form-group
                                    :invalid-feedback="errors[0]"
                                    :state="!errors.length"
                                >
                                    <b-form-input
                                        v-model="client.passport_no"
                                        :disabled="readOnly"
                                        type="number"
                                        max="6"
                                        :formatter="passportNumberFormatter"
                                    ></b-form-input>
                                </b-form-group>
                            </validation-provider>
                        </td>
                        </tr>
                        <tr v-if="client.type !== 'E'">
                            <td class="pb-1">ИНН</td>
                            <td>
                                <validation-provider #default="{ errors }">
                                    <b-form-group
                                        :invalid-feedback="errors[0]"
                                        :state="!errors.length"
                                    >
                                        <b-form-input
                                            v-model="client.INN"
                                            type="text"
                                            :state="errors.length > 0 ? false : null"
                                            maxLength="12"
                                        ></b-form-input>
                                    </b-form-group>
                                </validation-provider>
                            </td>
                        </tr>
                        <!-- <tr v-if="client.type !== 'E'">
                            <td class="pb-1">Должность</td>
                            <td>
                                <validation-provider #default="{ errors }">
                                    <b-form-group
                                        :invalid-feedback="errors[0]"
                                        :state="!errors.length"
                                    >
                                        <b-form-input
                                            v-model="client.position"
                                            type="text"
                                            :state="errors.length > 0 ? false : null"
                                        ></b-form-input>
                                    </b-form-group>
                                </validation-provider>
                            </td>
                        </tr> -->
                        <tr>
                            <td class="pb-1">Email</td>
                            <td>
                                <validation-provider #default="{ errors }">
                                    <b-form-group
                                        :invalid-feedback="errors[0]"
                                        :state="!errors.length"
                                    >
                                        <b-form-input
                                            v-model="client.email"
                                            type="text"
                                            :state="errors.length > 0 ? false : null"
                                        ></b-form-input>
                                    </b-form-group>
                                </validation-provider>
                            </td>
                        </tr>
                        <tr v-if="client.type === 'I'">
                            <td class="pb-1">Номер телефона</td>
                            <td>
                                <validation-provider #default="{ errors }">
                                    <b-form-group
                                        :invalid-feedback="errors[0]"
                                        :state="!errors.length"
                                    >
                                    <b-form-input
                                        v-model="client.client_phones[0].phone_number"
                                        :state="errors.length > 0 ? false : null"
                                        :disabled="readOnly"
                                        type="tel"
                                        placeholder="+7"
                                    />
                                    </b-form-group>
                                </validation-provider>
                            </td>
                        </tr>
                        <tr>
                            <td class="pb-1">Сайт</td>
                            <td>
                                <validation-provider #default="{ errors }">
                                    <b-form-group
                                        :invalid-feedback="errors[0]"
                                        :state="!errors.length"
                                    >
                                        <b-form-input
                                            v-model="client.web"
                                            type="text"
                                            :state="errors.length > 0 ? false : null"
                                        ></b-form-input>
                                    </b-form-group>
                                </validation-provider>
                            </td>
                        </tr>
                    </table>
                    </b-card>
                    <b-card v-if="client.type === 'E'" >
                        <b-card-title>Реквизиты</b-card-title>
                        <table class="w-100">
                            <tr>
                                <td class="pb-1">ЭДО</td>
                                <td class="pb-1">
                                    <b-form-checkbox
                                        id="edo"
                                        v-model="client.EDO"
                                        name="edo"
                                        :value="true"
                                        :unchecked-value="false"
                                    ></b-form-checkbox>
                                </td>
                            </tr>
                            <tr>
                                <td class="pb-1">ИНН</td>
                                <td>
                                    <validation-provider #default="{ errors }">
                                        <b-form-group
                                            :invalid-feedback="errors[0]"
                                            :state="!errors.length"
                                        >
                                            <b-form-input
                                                v-model="client.INN"
                                                type="text"
                                                :state="errors.length > 0 ? false : null"
                                                maxLength="10"
                                            ></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                </td>
                            </tr>
                            <tr>
                                <td class="pb-1">Расчетный счет</td>
                                <td>
                                    <validation-provider #default="{ errors }">
                                        <b-form-group
                                            :invalid-feedback="errors[0]"
                                            :state="!errors.length"
                                        >
                                            <b-form-input
                                                v-model="client.bank_account"
                                                type="text"
                                                :state="errors.length > 0 ? false : null"
                                            ></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                </td>
                            </tr>
                            <tr>
                                <td class="pb-1">ОКПО</td>
                                <td>
                                    <validation-provider #default="{ errors }">
                                        <b-form-group
                                            :invalid-feedback="errors[0]"
                                            :state="!errors.length"
                                        >
                                            <b-form-input
                                                v-model="client.OKPO"
                                                type="text"
                                                :state="errors.length > 0 ? false : null"
                                            ></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                </td>
                            </tr>
                            <tr>
                                <td class="pb-1">Банк</td>
                                <td>
                                    <validation-provider #default="{ errors }">
                                        <b-form-group
                                            :invalid-feedback="errors[0]"
                                            :state="!errors.length"
                                        >
                                            <b-form-input
                                                v-model="client.bank"
                                                type="text"
                                                :state="errors.length > 0 ? false : null"
                                            ></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                </td>
                            </tr>
                            <tr>
                                <td class="pb-1">ОКВЭД</td>
                                <td>
                                    <validation-provider #default="{ errors }">
                                        <b-form-group
                                            :invalid-feedback="errors[0]"
                                            :state="!errors.length"
                                        >
                                            <b-form-input
                                                v-model="client.OKVED"
                                                type="text"
                                                :state="errors.length > 0 ? false : null"
                                            ></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                </td>
                            </tr>
                            <tr v-if="!client.name.trim().toLowerCase().slice(0, 2).includes('ип')">
                                <td class="pb-1">КПП</td>
                                <td>
                                    <validation-provider #default="{ errors }">
                                        <b-form-group
                                            :invalid-feedback="errors[0]"
                                            :state="!errors.length"
                                        >
                                            <b-form-input
                                                v-model="client.KPP"
                                                type="text"
                                                :state="errors.length > 0 ? false : null"
                                            ></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                </td>
                            </tr>
                            <tr>
                                <td class="pb-1">БИК</td>
                                <td>
                                    <validation-provider #default="{ errors }">
                                        <b-form-group
                                            :invalid-feedback="errors[0]"
                                            :state="!errors.length"
                                        >
                                            <b-form-input
                                                v-model="client.BIK"
                                                type="text"
                                                :state="errors.length > 0 ? false : null"
                                            ></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                </td>
                            </tr>
                            <tr>
                                <td class="pb-1">ОГРН</td>
                                <td>
                                    <validation-provider #default="{ errors }">
                                        <b-form-group
                                            :invalid-feedback="errors[0]"
                                            :state="!errors.length"
                                        >
                                            <b-form-input
                                                v-model="client.OGRN"
                                                type="text"
                                                :state="errors.length > 0 ? false : null"
                                            ></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                </td>
                            </tr>
                            <tr>
                                <td class="pb-1">Корр. счет</td>
                                <td>
                                    <validation-provider #default="{ errors }">
                                        <b-form-group
                                            :invalid-feedback="errors[0]"
                                            :state="!errors.length"
                                        >
                                            <b-form-input
                                                v-model="client.correspondent_account"
                                                type="text"
                                                :state="errors.length > 0 ? false : null"
                                            ></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                </td>
                            </tr>
                            <!-- <tr>
                                <td class="pb-1">Почта для<br>бухгалтерских<br>документов</td>
                                <td>
                                    <validation-provider #default="{ errors }">
                                        <b-form-group
                                            :invalid-feedback="errors[0]"
                                            :state="!errors.length"
                                        >
                                            <b-form-input
                                                v-model="client.fin_docs_email"
                                                type="text"
                                                :state="errors.length > 0 ? false : null"
                                            ></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                </td>
                            </tr> -->
                        </table>
                    </b-card>
                </b-col>
                <b-col>
                    <b-card v-if="client.type !== 'I'">
                        <b-card-title>Контакты</b-card-title>
                        <table class="w-100">
                            <tr>
                                <td class="d-flex flex-column align-items-start" style="padding-top: 10px">
                                    <!-- Номера телефонов -->
                                    Сотрудники
                                    <p class="add-phone-btn" @click="addPhoneNumber">Добавить</p>
                                </td>
                                <td>
                                    <p
                                        v-for="(phone, i) in client.client_phones"
                                        :key="i"
                                        style="position: relative;"
                                    >
                                    <!-- <a :href="`tel:${phone.phone_number}`"
                                        >{{ i + 1 }}. {{ phone.phone_number }}</a
                                    > -->
                                        <validation-provider #default="{ errors }">
                                            <span v-if="client.client_phones.length > 1" style="text-align: left; margin-bottom: 15px;">{{ i + 1 }})</span>
                                            <b-form-input
                                                v-model="client.client_phones[i].phone_number"
                                                :state="errors.length > 0 ? false : null"
                                                :disabled="readOnly"
                                                type="tel"
                                                style="padding-right: 30px; box-sizing: border-box; margin-bottom: 15px; margin-top: 5px;"
                                                placeholder="Номер телефона"
                                            />
                                            <span
                                                class="delete-phone-btn"
                                                v-if="client.client_phones.length > 1"
                                                @click="deletePhoneNumber(i)"
                                                style="margin-top: 20px; padding: 3px;"
                                            >
                                                <b-icon icon="trash" style="width: 20px;"></b-icon>
                                            </span>
                                            <!-- @blur="changeOrder(phones, 'sender_phones')" -->
                                        </validation-provider>
                                        <validation-provider #default="{ errors }">
                                            <b-form-group
                                                :invalid-feedback="errors[0]"
                                                :state="!errors.length"
                                            >
                                                <b-form-input
                                                    v-model="client.client_phones[i].position"
                                                    type="text"
                                                    :state="errors.length > 0 ? false : null"
                                                    placeholder="Должность"
                                                ></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                        <validation-provider #default="{ errors }">
                                            <b-form-group
                                                :invalid-feedback="errors[0]"
                                                :state="!errors.length"
                                            >
                                                <b-form-input
                                                    v-model="client.client_phones[i].full_name"
                                                    type="text"
                                                    :state="errors.length > 0 ? false : null"
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
                                                    v-model="client.client_phones[i].email"
                                                    type="email"
                                                    :state="errors.length > 0 ? false : null"
                                                    placeholder="Email"
                                                ></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                    </p>
                                </td>
                            </tr>
                            <tr style="height: 20px;"></tr>
                            <tr v-if="client.type === 'E'">
                                <td style="display: flex; justify-content: flex-start; padding-top: 8px;">ЛПР</td>
                                <td>
                                    <validation-provider #default="{ errors }">
                                        <b-form-input
                                            v-model="client.responsible_person.name"
                                            :state="errors.length > 0 ? false : null"
                                            :disabled="readOnly"
                                            type="text"
                                            placeholder="ФИО"
                                            class="mb-1"
                                        />
                                    </validation-provider>
                                    <validation-provider #default="{ errors }">
                                        <b-form-input
                                            v-model="client.responsible_person.position"
                                            :state="errors.length > 0 ? false : null"
                                            :disabled="readOnly"
                                            type="text"
                                            placeholder="Должность"
                                            class="mb-1"
                                        />
                                    </validation-provider>
                                    <v-select
                                        label="name"
                                        :reduce="(type) => type.id"
                                        :options="statusResponsiblePerson"
                                        :clearable="false"
                                        v-model="client.responsible_person.status"
                                        :disabled="readOnly"
                                        placeholder="Основание"
                                    />
                                </td>
                            </tr>
                            <!-- <tr>
                                <td class="pb-1">Email</td>
                                <td>
                                    <validation-provider #default="{ errors }">
                                        <b-form-group
                                            :invalid-feedback="errors[0]"
                                            :state="!errors.length"
                                        >
                                            <b-form-input
                                                v-model="client.email"
                                                type="email"
                                                :state="errors.length > 0 ? false : null"
                                            ></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                </td>
                            </tr> -->
                        </table>
                    </b-card>
                </b-col>
            </b-row>
            <b-col>
                <b-button variant="primary" @click="createClient">Создать</b-button>
            </b-col>
      </template>
    </b-overlay>
  </section>
</template>

<script>
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { mapGetters, mapMutations } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email, confirmed, password } from "@validations";

import SelectCities from "@/components/ui/selectCities/selectCities.vue";
import SelectContracts from "@/components/ui/selectContracts/selectContracts.vue";

import {
    BRow,
    BCol,
    BIcon,
    BIconTrash,
    BOverlay,
    BCard,
    BCardTitle,
    BTable,
    BButton,
    BFormInput,
    BFormCheckbox,
    BBadge,
    BFormTextarea,
    BFormGroup,
    BFormRadio,
    VBTooltip,
    BFormDatepicker,
} from "bootstrap-vue";
import vSelect from "vue-select";

import { RoleConstants } from '@/utils/role';
import store from "@/store/index";

export default {
    components: {
        ValidationProvider,
        ValidationObserver,

        SelectContracts,
        SelectCities,

        vSelect,
        BRow,
        BCol,
        BIcon,
        BIconTrash,
        BOverlay,

        BFormInput,
        BFormGroup,
        BFormCheckbox,
        BFormDatepicker,
        BFormTextarea,
        BCard,
        BCardTitle,
        BTable,
        BButton,
    },
    data() {
        return {
            client: {
                client_phones: [
                    {
                        phone_number: '',
                        full_name: '',
                        position: '',
                        email: '',
                    }
                ],
                type: null,
                name: '',
                email: '',
                position: null,
                address: null,
                web: null,
                bank_account: null,
                INN: null,
                passport_series: null,
                passport_no: null,
                is_company: false,
                city: null,
                company: null,

                bank: null,
                KPP: null,
                BIK: null,
                correspondent_account: null,
                bank_account: null,
                OKPO: null,
                OKVED: null,
                OGRN: null,
                EDO: false,
                form_of_ownership: null,
                fin_docs_email: null,
                responsible_person: {
                    name: null,
                    position: null,
                    status: null,
                }
            },
            message: null,
            contracts: [{ value: '' }],
            formsOwnership: [],
            // statusResponsiblePerson: [
            //     'Доверенность',
            //     'Договор',
            //     'Лист записи ЕГРИП',
            //     'Положение',
            //     'Приказ',
            //     'Решение',
            //     'Свидетельство',
            //     'Талон',
            //     'Уведомление',
            //     'Устав'
            // ],
            statusResponsiblePerson: [],
        };
    },
    computed: {
        ...mapGetters({
            loading: "moduleClients/getLoading",
            clientType: "moduleClients/getClientType",
        }),
        readOnly() {
            return store.state.app.user.role !== RoleConstants.AD && store.state.app.user.role !== RoleConstants.LG;
        },
    },
    watch: {
        'client.type'(newValue, oldValue) {
            if (newValue === 'E') this.client.fin_docs_email = null;
        },
    },
    methods: {
    ...mapMutations({
      changeLoading: "moduleClients/changeLoading",
    }),
    deleteContract(index) {
        if (this.contracts.length === 1) {
            this.contracts = [{value: ''}];
            return
        }
        this.contracts = [...this.contracts.slice(0, index), ...this.contracts.slice(index + 1)];
    },
    isValidHttpUrl(string) {
      var pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
          "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
          "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
          "(\\#[-a-z\\d_]*)?$",
        "i"
      );
      return !!pattern.test(string);
    },
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
    getClientType(type) {
      return this.clientType.find((x) => x.id === type)?.title || "Не задан";
    },
    enumerationResponse(error) {
        for (let key in error) {
            if (key === 'web') {
                return 'Поле \'Сайт\' - ' + error[key] + ' ';
            };
            if (key === 'type') {
                return 'Поле \'Тип\' - ' + error[key] + ' ';
            };
            if (key === 'client_phones') {
                return 'Поле \'Email сотрудников\' - ' + error[key][0].email + ' ';
            };
            if (key === 'fin_docs_email') {
                return 'Поле \'Почта для бухгалтерских документов\' - ' + error[key] + ' ';
            };
        }
    },
    
    createClient() {
        if (!this.client.name && !this.client.type) {
            this.$toast({
                component: ToastificationContent,
                props: {
                    title: "Ошибка",
                    text: "Заполните поля \"Название / ФИО\" и \"Тип\"",
                    icon: "XIcon",
                    variant: "danger",
                },
            });
            return;
        };

        if (!this.client.name) {
            this.$toast({
                component: ToastificationContent,
                props: {
                    title: "Ошибка",
                    text: "Заполните поле \"Название / ФИО\"",
                    icon: "XIcon",
                    variant: "danger",
                },
            });
            return;
        };

        if (!this.client.type) {
            this.$toast({
                component: ToastificationContent,
                props: {
                    title: "Ошибка",
                    text: "Заполните поле \"Тип\"",
                    icon: "XIcon",
                    variant: "danger",
                },
            });
            return;
        };

        this.changeLoading(true);

        // Логику по физ лицу сюда (Проверка на тип контрагента --> ...)
        if (this.client.type === "I") {
            this.client.client_phones[0] = {
                    full_name: this.client.name,
                    email: this.client.email,
                    phone_number: this.client.client_phones[0].phone_number,
                }
        }

        if (this.client.type === "E") {
            if (this.client.client_phones.length === 1) {
                this.client.client_phones[0] = {
                    full_name: this.client.responsible_person.name,
                    position: this.client.responsible_person.position,
                    documents: [this.client.responsible_person.status],
                    is_lpr: true,
                    email: this.client.client_phones[0].email,
                    phone_number: this.client.client_phones[0].phone_number,
                }
            } else {
                this.client.client_phones.push({
                    full_name: this.client.responsible_person.name,
                    position: this.client.responsible_person.position,
                    documents: [this.client.responsible_person.status],
                    is_lpr: true,
                });
            }
        }
        // 

        console.log(this.client);

        this.$api.clients
            .addNewClient(this.client)
            .then((response) => {
                if (response.status > 203) {
                 
                //   console.log('response - ', response.data);
                  this.$toast({
                    component: ToastificationContent,
                    props: {
                        title: "Ошибка",
                        text: "Контрагент не создан. " + this.enumerationResponse(response.data),
                        icon: "XIcon",
                        variant: "danger",
                    },
                });
                } else {
                    this.changeLoading(false);
                    this.createContracts(response.data.id);
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: "Успешно",
                            text: "Контрагент создан",
                            icon: "CheckCircleIcon",
                            variant: "success",
                        },
                    });
                };
            })
            .catch(() => {
                this.$toast({
                    component: ToastificationContent,
                    props: {
                        title: "Ошибка",
                        text: "Контрагент не создан",
                        icon: "XIcon",
                        variant: "danger",
                    },
                });
            })
            .finally(() => this.changeLoading(false));
        },
        createContracts(id) {
            const allPromises = this.contracts.map(c => c.value).filter(c => c).map((client) => {
                return this.$api.clients.createClientContract(id, client).then(response => {
                    if (response.status >= 203) {
                        this.message = response.data;
                        return;
                    }
                })
            });
            Promise.all(allPromises)
                .then(values => {
                    this.$router.push({ name: 'clients' })
                })
                .catch(err => this.message = err);
        },
        addPhoneNumber() {
            if (this.client.client_phones) {
                this.client.client_phones.push({phone_number: '', full_name: '', position: ''});
                return;
            }
            this.client.client_phones = [{phone_number: '', full_name: '', position: ''}];
        },
        deletePhoneNumber(index) {
            if (this.client.client_phones && this.client.client_phones.length) {
                this.client.client_phones.splice(index, 1);
            }
        },
        handleContractCreation() {
            this.contracts.push({ value: '' });
        },
        getLprDocs() {
            this.$api.lprDocs.getLprDocs()
                .then((response) => {
                    // console.log('lpr - ', response)
                    this.statusResponsiblePerson = response.data.results;
                })
                .catch((error) => {
                    console.log('lpr - ', error)
                })
        },
        getFormsOwnership() {
            this.$api.formsOwnership.getFormsOwnership()
                .then((response) => {
                    this.formsOwnership = response.data.results;
                })
                .catch((error) => {
                    console.log('lpr - ', error)
                })
        },
    },
    mounted() {
        this.getLprDocs();
        this.getFormsOwnership();
    },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

.add-phone-btn {
    margin-top: 5px;
    min-width: 24px;
    min-height: 24px;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // border-radius: 15px;
    // border: 2px solid #3d78b4;
    // text-align: center;
    // font-size: 30px;
    color: #3d78b4;
}
.delete-phone-btn {
    position: absolute;
    top: 9px;
    right: 10px;
}
</style>
