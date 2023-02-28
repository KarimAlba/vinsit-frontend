<template>
  <b-card-actions title="Плательщик" actionCollapse>
    <b-row>
      <b-col class="mb-1" cols="12" md="6">
        <b-form-group label="Плательщик">
          <select-clients
            :reduce="(client) => client.id"
            v-model="order.payer_counterparty"
            @input="changeOrder($event, 'payer_counterparty')"
          />
        </b-form-group>
      </b-col>

      <b-col class="mb-1" cols="12" md="6">
        <b-form-group label="Договор">
          <b-form-input v-model="order.contract"></b-form-input>
        </b-form-group>
      </b-col>

      <b-col class="mb-1" cols="12" md="6">
        <b-form-group label="Город">
          <select-cities
            v-model="order.payer_city"
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

    SelectCities,
    SelectClients,
    BCardActions,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  methods: {
    changeOrder(newVal, key) {
      let payload = {};
      payload[key] = newVal;

      this.$api.orders.updateOrder(this.order.id, payload).then((response) => {
        if (response.status !== 400) {
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
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
