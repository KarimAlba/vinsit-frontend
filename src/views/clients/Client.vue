<template>
    <section class="order pb-5">
        <b-overlay :show="loading" rounded="sm">
            <template v-if="message">
                <h1>{{ message }}</h1>
            </template>
            <template v-else>
                <h1 class="mb-2">Клиент №{{ client.amo_client_id || '(Отсутствует в AMO CRM)' }}</h1>
                <b-row>
                    <b-col>
                        <b-card>
                            <b-card-title>Основная информация</b-card-title>

                            <table class="w-100">
                                <tr>
                                <td class="pb-1">AMO CRM</td>
                                <td class="pb-1">{{ client.amo_client_id || '(Отсутствует в AMO CRM)' }}</td>
                                </tr>

                                <tr>
                                    <td class="pb-1">Это компания?</td>
                                    <td class="pb-1">
                                        <b-form-checkbox
                                            id="is-company-check"
                                            v-model="client.is_company"
                                            name="is-company-check"
                                            :value="true"
                                            :disabled="readOnly"
                                            :unchecked-value="false"
                                            @change="updateClient('is_company', $event)"
                                        ></b-form-checkbox>
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
                                                    :disabled="readOnly"
                                                    :state="errors.length > 0 ? false : null"
                                                    @change="updateClient('name', $event)"
                                                ></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
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

                                <tr>
                                    <td class="pb-1">Город</td>
                                    <td>
                                        <b-form-group>
                                            <select-cities
                                                v-model="client.city"
                                                :disabled="readOnly"
                                                @input="updateClient('city', $event)"
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
                                                    :disabled="readOnly"
                                                    :state="errors.length > 0 ? false : null"
                                                    @change="updateClient('address', $event)"
                                                ></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="pb-1">Договор</td>
                                    <td class="pb-1">
                                        <select-contracts
                                            :disabled="readOnly"
                                            :reduce="(cont) => cont.id"
                                            :payerId="client.id"
                                            @createContract="handleContractCreation"
                                        />
                                        <!-- @input="changeOrder($event, 'contract')" -->
                                    </td>
                                </tr>

                                <!-- <tr>
                                <td class="pb-1">Position</td>
                                <td class="pb-1">{{ client.address }}</td>
                                </tr> -->

                                <tr>
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
                                                    :disabled="readOnly"
                                                    :state="errors.length > 0 ? false : null"
                                                    @change="updateClient('bank_account', $event)"
                                                ></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                    </td>
                                </tr>
                                <tr>
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
                                                    @change="updateClient('passport_series', $event)"
                                                />
                                            </b-form-group>
                                        </validation-provider>
                                    </td>
                                </tr>
                                <tr>
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
                                                    @change="updateClient('passport_no', $event)"
                                                ></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
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
                                                    :disabled="readOnly"
                                                    :state="errors.length > 0 ? false : null"
                                                    @change="updateClient('INN', $event)"
                                                ></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                    </td>
                                </tr>
                                <tr>
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
                                                    :disabled="readOnly"
                                                    :state="errors.length > 0 ? false : null"
                                                    @change="updateClient('position', $event)"
                                                ></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                    </td>
                                </tr>
                            </table>
                            </b-card>
                        </b-col>
                        <b-col>
                            <b-card>
                            <b-card-title>Контакты</b-card-title>

                            <table class="w-100">
                                <tr>
                                    <td class="d-flex flex-column align-items-start" style="padding-top: 10px">
                                        Номера телефонов
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
                                                <b-form-input
                                                    debounce="500"
                                                    v-model="phone.phone_number"
                                                    :state="errors.length > 0 ? false : null"
                                                    :disabled="readOnly"
                                                    type="tel"
                                                    style="padding-right: 30px; box-sizing: border-box;"
                                                />
                                                <!-- @blur="changeOrder(phones, 'sender_phones')" -->
                                            </validation-provider>
                                            <span
                                                class="delete-phone-btn"
                                                v-if="client.client_phones.length > 1"
                                                @click="deletePhoneNumber(i)"
                                            >
                                                <b-icon icon="trash"></b-icon>
                                            </span>
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                <td class="pb-1">Email</td>
                                <td>
                                    <!-- <a :href="`mailto:${client.email}`">{{ client.email }}</a> -->
                                    <validation-provider #default="{ errors }">
                                        <b-form-group
                                            :invalid-feedback="errors[0]"
                                            :state="!errors.length"
                                        >
                                            <b-form-input
                                                v-model="client.email"
                                                type="email"
                                                :disabled="readOnly"
                                                :state="errors.length > 0 ? false : null"
                                                @change="updateClient('email', $event)"
                                            ></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                </td>
                                </tr>

                                <tr>
                                <td class="pb-1">Сайт</td>
                                <td>
                                    <!-- <a
                                    v-if="isValidHttpUrl(client.web)"
                                    :href="client.web"
                                    target="_blank"
                                    >{{ client.web }}</a
                                    >
                                    <span v-else>{{ client.web }}</span> -->
                                    <validation-provider #default="{ errors }">
                                        <b-form-group
                                            :invalid-feedback="errors[0]"
                                            :state="!errors.length"
                                        >
                                            <b-form-input
                                                v-model="client.web"
                                                type="text"
                                                :disabled="readOnly"
                                                :state="errors.length > 0 ? false : null"
                                                @change="updateClient('web', $event)"
                                            ></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                </td>
                                </tr>
                            </table>
                        </b-card>
                    </b-col>
                </b-row>

                <b-button v-b-modal.modal-delete variant="danger">Удалить</b-button>

                <b-modal
                id="modal-delete"
                title="Удалить?"
                @ok="deleteClient"
                ok-title="Удалить"
                ok-variant="danger"
                header-bg-variant="danger"
                cancel-title="Отмена"
                size="sm"
                >
                <p>Удалить клиента?</p>
                </b-modal>
            </template>
        </b-overlay>
    </section>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email, confirmed, password } from "@validations";

import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

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
        ToastificationContent,

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
            client: {},
            message: null,
            initialized: false,
        };
    },
    watch: {
        'client.client_phones': {
            handler() {
                if (!this.initialized) {
                    return;
                }
                this.updateClient('client_phones', this.client.client_phones.filter(p => p.phone_number));
            },
            deep: true,
        },
        'client.type'() {
            if (!this.initialized) {
                return;
            }
            this.updateClient('type', this.client.type);
        }
    },
    computed: {
        ...mapGetters({
            loading: "moduleClients/getLoading",
            clientType: "moduleClients/getClientType",
        }),
        idClient() {
            return this.$route.params.id || null;
        },
        readOnly() {
            return store.state.app.user.role !== RoleConstants.AD && store.state.app.user.role !== RoleConstants.LG;
        },
    },
    methods: {
        ...mapMutations({
            changeLoading: "moduleClients/changeLoading",
        }),
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
        fetchClient() {
            this.changeLoading(true);

            this.$api.clients
                .getClient(this.idClient)
                .then((response) => {
                    if (response.status == 404) {
                        this.message = "Клиент не найден";
                        this.changeLoading(false);
                        return;
                    }
                    this.client = response.data;
                    if (!response.data.client_phones || !response.data.client_phones.length) {
                        this.client.client_phones = [{ phone_number: '' }]
                    }
                    this.changeLoading(false);
                    setTimeout(() => this.initialized = true, 500);
                })
                .finally(() => this.changeLoading(false));
        },
        updateClient(propName, value) {
            if (this.readOnly) {
                return;
            }
            this.changeLoading(true);
            
            this.$api.clients
                .changeClient(
                    this.idClient,
                    {
                        [propName]: value
                    }
                )
                .then((response) => {
                    if (response.status > 203) {
                        const text = response.data.client_phones
                            ? 'Не удалось обновить. ' + response.data.client_phones[0].phone_number
                            : 'Не удалось обновить';
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: "Ошибка",
                                text: text,
                                icon: "XIcon",
                                variant: "danger",
                            },
                        });
                        return;
                    };
                    this.changeLoading(false);
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: "Успешно",
                            text: "Информация изменена",
                            icon: "CheckCircleIcon",
                            variant: "success",
                        },
                    });
                })
                .finally(() => this.changeLoading(false));
        },
        deleteClient() {
            if (this.readOnly) {
                return;
            }
            this.changeLoading(true);

            this.$api.clients.deleteClient(this.idClient).then((response) => {
                this.changeLoading(false);
                this.$router.push({ name: "clients" });
            });
        },
        addPhoneNumber() {
            if (this.readOnly) {
                return;
            }
            if (this.client.client_phones) {
                this.client.client_phones.push({phone_number: ''});
                return;
            }
            this.client.client_phones = [{phone_number: ''}];
        },
        deletePhoneNumber(index) {
            if (this.readOnly) {
                return;
            }
            if (this.client.client_phones && this.client.client_phones.length) {
                this.client.client_phones.splice(index, 1);
            }
        },
        handleContractCreation(contract) {
            if (this.readOnly) return;
            this.$api.clients.createClientContract(this.client.id, contract)
                .then(response => {
                    if (response.status > 203) {
                        return;
                    }
                    this.client.contracts.unshift(response.data);
                })
        },
    },
    mounted() {
        this.fetchClient(this.idClient);
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