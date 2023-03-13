<template>
  <b-card-actions title="Плательщик" actionCollapse>
    <b-row>
      <b-col class="mb-1" cols="12" md="4">
        <b-form-group label="Плательщик">
          <select-clients
            :reduce="(client) => client.id"
            v-model="order.payer_counterparty"
            :disabled="readOnly"
            @input="changeOrder($event, 'payer_counterparty')"
          />
        </b-form-group>
      </b-col>

      <b-col class="mb-1" cols="12" md="4">
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

      <b-col class="mb-1" cols="12" md="4">
        <b-form-group label="Город">
          <select-cities
            :value="order.payer_city"
            :disabled="readOnly"
            @input="changeOrder($event, 'payer_city')"
          />
        </b-form-group>
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
} from "bootstrap-vue";

export default {
  components: {
    BOverlay,
    BRow,
    BCol,
    BCard,
    BFormInput,
    BFormGroup,
    SelectContracts,
    SelectCities,
    SelectClients,
    BCardActions,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
    readOnly: false,
  },
  watch: {
    'order.payer_counterparty'() {
        console.log(this.order.payer_counterparty);
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
</style>
