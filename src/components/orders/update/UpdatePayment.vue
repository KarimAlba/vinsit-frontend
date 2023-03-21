<template>
  <b-card-actions title="Информация об оплате" actionCollapse>
    <b-row>
        <b-col cols="10" class="px-2">
            <b-form-group>
                <b-row class="d-flex justify-content-between">
                    <b-form-radio
                        id="SC"
                        v-model="order.payment_type"
                        name="some-radios"
                        :value="'SC'"
                    >
                        Отправитель нал
                    </b-form-radio>
                    <b-form-radio
                        id="RC"
                        v-model="order.payment_type"
                        name="some-radios"
                        :value="'RC'"
                    >
                        Получатель нал
                    </b-form-radio>
                    <b-form-radio
                        id="CS"
                        v-model="order.payment_type"
                        name="some-radios"
                        :value="'CS'"
                    >
                        По договору отправителя
                    </b-form-radio>
                    <b-form-radio
                        id="CR"
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
        <b-col class="my-1" cols="12" md="6" v-show="order.payment_type === 'CS' || order.payment_type === 'CR'">
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
            <b-icon-chevron-up v-if="additionalService" variant="primary"/>
            <b-icon-chevron-down v-if="!additionalService" variant="primary"/>
            <span class="header-additional-service">Дополнительные услуги</span>
        </b-col>
    </b-row>
    <b-row v-if="additionalService && orderServices.length">
        <b-col>
            <!-- <payment-service
                v-for="service in orderServices"
                :key="service.id"
                :orderPaymentService="service"
            /> -->
            <b-row class="service"  v-for="(service, index) in orderServices" :key="orderServices[index].id">
                <b-col cols="12" md="8">
                    <!-- @change="handleOrderService(service)"
                    :checked="checkService(service.service)" -->
                    <input
                        type="checkbox"
                        :name="service.name"
                        :id="String(service.id)"
                        v-model="service.included"
                        class="service-checkbox"
                    >
                    <span class="service-name">{{ service.name }}</span>
                    <!-- <b-form-checkbox
                        :id="String(orderServices[index].id)"
                        :name="orderServices[index].name"
                        v-model="orderServices[index].included"
                    >
                        {{orderServices[index].name}}
                    </b-form-checkbox> -->
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group>
                        <b-form-input
                            type="number"
                            v-model="orderServices[index].price"
                            debounce="500"
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
            services: [],
            orderServices: [],
            initialized: false,
        };
    },
    watch: {
        'order.payer_counterparty'() {
            // this.payer = this.order.payer_counterparty;
        },
        'order.payment_type'() {
            if (!this.initialized) return;
            setTimeout(() => this.changeOrder(this.order.payment_type, 'payment_type'), 1000);
            if (this.order.payment_type[0] !== 'C') {
                this.changeOrder(null, 'contract');
            }
            if (this.order.payment_type === 'SC' || this.order.payment_type === 'CS') {
                this.changeOrder(this.order.sender_counterparty, 'payer_counterparty');
            } else {
                this.changeOrder(this.order.recipient_counterparty, 'payer_counterparty');
            }
        },
        'order.sender_counterparty'() {
            if (this.order.payment_type === 'SC' || this.order.payment_type === 'CS') {
                this.changeOrder(this.order.sender_counterparty, 'payer_counterparty');
            }
        },
        'order.recipient_counterparty'() {
            if (this.order.payment_type === 'RC' || this.order.payment_type === 'CR') {
                this.changeOrder(this.order.recipient_counterparty, 'payer_counterparty');
            }
        },
        'order.order_services'() {
            if (this.order.order_services && !this.orderServices.length && !this.initialized) {
                const results = this.services.map((service) => {
                    const serviceFromOrder = this.order.order_services.find(orderService =>
                        orderService.service === service.name
                    );
                    const servicePrice = serviceFromOrder && Number(serviceFromOrder.price)
                        ? Number(serviceFromOrder.price)
                        : null;
                    return {
                        id: service.id,
                        name: service.name,
                        price: servicePrice,
                        included: this.order.order_services.map(elem => elem.service).includes(service.name),
                    };
                });
                this.orderServices = results;
                setTimeout(() => this.initialized = true, 500);
            }
        },
        'orderServices': {
            handler() {
                if (!this.initialized) return;
                const body = this.orderServices.filter(orderService => orderService.included).map(orderService => ({
                    service: orderService.id,
                    price: Number(orderService.price) || 0,
                }));
                this.changeOrder(body, 'order_services');
            },
            deep: true,
        },
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
                    } else if (key === 'payment_type') {
                        // nothing to change
                    } else {
                        this.setEditableOrder({
                            ...this.order,
                            [key]: newVal,
                            total_price: response.data.total_price,
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
        addServicesList() {
            this.$api.services.getServices(0, 30)
                .then(response => {
                    if (response.status > 203) {
                        return;
                    }
                    this.services = response.data;
                })
        },
        checkService(serviceId) {
            const serviceIndex = this.order?.order_services.findIndex(serv => serv.service === serviceId);
            return serviceIndex !== -1 ? true : false;
        },
        handleOrderService(service) {
            const serviceIndex = this.order.order_services?.findIndex(item => item.service === service.service);
            if (serviceIndex === -1) {
                this.order.order_services.push(service);
                this.changeOrder(this.order.order_services,'order_services');
                return;
            }
            this.order.order_services.splice(serviceIndex, 1);
            this.changeOrder(this.order.order_services,'order_services');
        },
    },
    mounted() {
        this.addServicesList();
    }
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

    &-checkbox {
        width: 18px;
        height: 18px;
    }

    &-name {
        margin-left: 16px;
        font-size: 16px;
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
