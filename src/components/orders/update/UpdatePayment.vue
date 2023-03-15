<template>
  <b-card-actions title="Информация об оплате" actionCollapse>
    <b-row>
        <b-col cols="10" class="px-2">
            <b-form-group>
                <b-row class="d-flex justify-content-between">
                    <b-form-radio
                        v-model="selected"
                        name="some-radios"
                        :value="1"
                    >
                        Отправитель нал
                    </b-form-radio>
                    <b-form-radio
                        v-model="selected"
                        name="some-radios"
                        :value="2"
                    >
                        Получатель нал
                    </b-form-radio>
                    <b-form-radio
                        v-model="selected"
                        name="some-radios"
                        :value="3"
                    >
                        По договору отправителя
                    </b-form-radio>
                    <b-form-radio
                        v-model="selected"
                        name="some-radios"
                        :value="4"
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
        <b-col class="my-1" cols="12" md="6" v-show="selected > 2">
            <b-form-group label="Договор">
            <!-- <b-form-input v-model="order.contract" :disabled="readOnly"></b-form-input> -->
                <select-contracts
                    :disabled="readOnly"
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
        <b-col class="mt-2" @click="() => additionalService = additionalService ? false : true">
            <b-icon-chevron-up v-if="!additionalService" variant="primary"/>
            <b-icon-chevron-down v-if="additionalService" variant="primary"/>
            <span class="header-additional-service">Дополнительные услуги</span>
        </b-col>
    </b-row>
    <b-row v-if="additionalService">
        <b-col>
            <b-row class="service">
                <b-col cols="12" md="8">
                    <b-form-checkbox
                        :id="``"
                        :name="``"
                        :disabled="readOnly"
                    >
                        Дополнительный сбор на объявленную стоимость
                    </b-form-checkbox>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group>
                        <b-form-input
                            type="number"
                            :disabled="readOnly"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="service">
                <b-col cols="12" md="8">
                    <b-form-checkbox
                        :id="``"
                        :name="``"
                        :disabled="readOnly"
                    >
                        Опасный груз
                    </b-form-checkbox>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group>
                        <b-form-input
                            type="number"
                            :disabled="readOnly"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="service">
                <b-col cols="12" md="8">
                    <b-form-checkbox
                        :id="``"
                        :name="``"
                        :disabled="readOnly"
                    >
                        Ожидание более 15 минут у отправителя
                    </b-form-checkbox>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group>
                        <b-form-input
                            type="number"
                            :disabled="readOnly"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="service">
                <b-col cols="12" md="8">
                    <b-form-checkbox
                        :id="``"
                        :name="``"
                        :disabled="readOnly"
                    >
                        Ожидание более 15 минут у получателя
                    </b-form-checkbox>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group>
                        <b-form-input
                            type="number"
                            :disabled="readOnly"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="service">
                <b-col cols="12" md="8">
                    <b-form-checkbox
                        :id="``"
                        :name="``"
                        :disabled="readOnly"
                    >
                        Хранение на складе
                    </b-form-checkbox>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group>
                        <b-form-input
                            type="number"
                            :disabled="readOnly"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="service">
                <b-col cols="12" md="8">
                    <b-form-checkbox
                        :id="``"
                        :name="``"
                        :disabled="readOnly"
                    >
                        Прочее
                    </b-form-checkbox>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group>
                        <b-form-input
                            type="number"
                            :disabled="readOnly"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="service">
                <b-col cols="12" md="8">
                    <b-form-checkbox
                        :id="``"
                        :name="``"
                        :disabled="readOnly"
                    >
                        Повторная поездка
                    </b-form-checkbox>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group>
                        <b-form-input
                            type="number"
                            :disabled="readOnly"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="service">
                <b-col cols="12" md="8">
                    <b-form-checkbox
                        :id="``"
                        :name="``"
                        :disabled="readOnly"
                    >
                        Аренда курьера
                    </b-form-checkbox>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group>
                        <b-form-input
                            type="number"
                            :disabled="readOnly"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="service">
                <b-col cols="12" md="8">
                    <b-form-checkbox
                        :id="``"
                        :name="``"
                        :disabled="readOnly"
                    >
                        Скан документов
                    </b-form-checkbox>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group>
                        <b-form-input
                            type="number"
                            :disabled="readOnly"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="service">
                <b-col cols="12" md="8">
                    <b-form-checkbox
                        :id="``"
                        :name="``"
                        :disabled="readOnly"
                    >
                        Подъем на этаж ручной
                    </b-form-checkbox>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group>
                        <b-form-input
                            type="number"
                            :disabled="readOnly"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="service">
                <b-col cols="12" md="8">
                    <b-form-checkbox
                        :id="``"
                        :name="``"
                        :disabled="readOnly"
                    >
                        Подъем на этаж лифтом
                    </b-form-checkbox>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group>
                        <b-form-input
                            type="number"
                            :disabled="readOnly"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="service">
                <b-col cols="12" md="8">
                    <b-form-checkbox
                        :id="``"
                        :name="``"
                        :disabled="readOnly"
                    >
                        Уведомление о выдаче заказа на доставку
                    </b-form-checkbox>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group>
                        <b-form-input
                            type="number"
                            :disabled="readOnly"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="service">
                <b-col cols="12" md="8">
                    <b-form-checkbox
                        :id="``"
                        :name="``"
                        :disabled="readOnly"
                    >
                        Упаковка
                    </b-form-checkbox>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group>
                        <b-form-input
                            type="number"
                            :disabled="readOnly"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
  </b-card-actions>
</template>

<script>
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

import SelectCities from "@/components/ui/selectCities/selectCities.vue";
import SelectClients from "@/components/ui/selectClients/selectClients.vue";
import SelectContracts from "@/components/ui/selectContracts/selectContracts.vue";
import { mapMutations } from "vuex";

import BCardActions from "@/@core/components/b-card-actions/BCardActions.vue";

import {
  BOverlay,
  BRow,
  BCol,
  BCard,
  BFormInput,
  BFormGroup,
  BFormRadio,
  BFormCheckbox,
  BIcon,
  BIconChevronUp,
  BIconChevronDown,
  BTable,
} from "bootstrap-vue";

export default {
    components: {
        BOverlay,
        BRow,
        BCol,
        BCard,
        BFormInput,
        BFormGroup,
        BFormRadio,
        SelectContracts,
        SelectCities,
        SelectClients,
        BCardActions,
        BFormCheckbox,
        BIcon,
        BIconChevronUp,
        BIconChevronDown,
        BTable,
    },
    props: {
        order: {
            type: Object,
            required: true,
        },
        readOnly: false,
    },
    data() {
        return {
            additionalService: true,
            services: [
                {
                    name: '-',
                    date: '-',
                    price: '-'
                },
                {
                    name: '-',
                    date: '-',
                    price: '-'
                },
                {
                    name: '-',
                    date: '-',
                    price: '-'
                }
            ],
            selected: 1,
        };
    },
    watch: {
        'order.payer_counterparty'() {
            console.log(this.order.payer_counterparty);
            this.payer = this.order.payer_counterparty;
        },
        'selected'() {
            if (this.selected % 2) {
                this.changeOrder(this.order.sender_counterparty, 'payer_counterparty')
            } else {
                this.changeOrder(this.order.recipient_counterparty, 'payer_counterparty')
            }
        },
        'order.sender_counterparty'() {
            if (this.selected % 2) {
                this.changeOrder(this.order.sender_counterparty, 'payer_counterparty')
            } else {
                this.changeOrder(this.order.recipient_counterparty, 'payer_counterparty')
            }
        },
        'order.recipient_counterparty'() {
            this.recipient_counterparty = this.order.recipient_counterparty;
        }
    },
    methods: {
        ...mapMutations({
            setEditableOrder: "moduleOrders/setEditableOrder",
        }),
        changeOrder(newVal, key) {
            let payload = {};
            payload[key] = newVal;

            this.$api.orders.updateOrder(this.order.id, payload).then((response) => {
                if (response.status !== 400) {
                    if (key === 'payer_counterparty') {
                        if (!newVal) {
                            this.setEditableOrder({
                                ...this.order,
                                [key]: newVal,
                                payer_city: null,
                            });
                            return;
                        }
                        this.$api.clients.getClient(newVal).then(response => {
                            if (response.status > 203) return;
                            this.setEditableOrder({
                                ...this.order,
                                [key]: newVal,
                                payer_city: response.data.city,
                            });
                        });
                    } else {
                        this.setEditableOrder({
                            ...this.order,
                            [key]: newVal,
                        });
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
        handleContractCreation(contract) {
            this.$api.clients.createClientContract(this.order.payer_counterparty, contract)
                .then(response => {
                    if (response.status > 203) {
                        return;
                    }
                    this.changeOrder(response.data.id, 'contract');
                })
        },
    },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

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
;
}

</style>
