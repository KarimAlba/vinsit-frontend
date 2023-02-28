<template>
  <b-card-actions title="Получатель" actionCollapse>
    <b-row>
      <b-col class="mb-1" cols="12" md="4">
        <b-form-group label="Получатель">
          <select-clients
            :reduce="(client) => client.id"
            v-model="order.recipient_counterparty"
            @input="changeOrder($event, 'recipient_counterparty')"
          />
        </b-form-group>
      </b-col>

      <b-col class="mb-1" cols="12" md="4">
        <b-form-group label="Город">
          <select-cities
            v-model="order.recipient_city"
            @input="changeOrder($event, 'recipient_city')"
          />
        </b-form-group>
      </b-col>

      <b-col class="mb-1" cols="12" md="4">
        <b-form-group label="Тип получателя">
          <v-select
            label="title"
            :reduce="(type) => type.id"
            :options="clientType"
            :clearable="false"
            v-model="order.recipient_counterparty_type"
            @input="changeOrder($event, 'recipient_counterparty_type')"
          />
        </b-form-group>
      </b-col>

      <b-col cols="12" md="8">
        <b-form-group label="ФИО получателя">
          <b-form-input
            v-model="order.recipient_full_name"
            @change="changeOrder($event, 'recipient_full_name')"
          />
        </b-form-group>
      </b-col>

      <b-col cols="12" md="2">
        <b-form-group label="Серия паспорта">
          <b-form-input
            v-model="order.recipient_passport_series"
            @change="changeOrder($event, 'recipient_passport_series')"
          />
        </b-form-group>
      </b-col>

      <b-col cols="12" md="2">
        <b-form-group label="Номер паспорта">
          <b-form-input
            v-model="order.recipient_passport_no"
            @change="changeOrder($event, 'recipient_passport_no')"
          />
        </b-form-group>
      </b-col>

      <b-col cols="12">
        <b-form-group label="Адрес">
          <b-form-textarea
            rows="3"
            max-rows="6"
            v-model="order.recipient_address"
            @change="changeOrder($event, 'recipient_address')"
          ></b-form-textarea>
        </b-form-group>
      </b-col>

      <b-col
        v-for="(phone, i) in order.recipient_phones"
        :key="i"
        cols="12"
        md="4"
      >
        <validation-provider #default="{ errors }" rules="required">
          <b-form-group :invalid-feedback="errors[0]" label="Номер телефона">
            <b-form-input
              v-model="phone.phone_number"
              :state="errors.length > 0 ? false : null"
              v-maska
              placeholder="+71234567890"
              data-maska="+7##########"
            ></b-form-input>
          </b-form-group>
        </validation-provider>
      </b-col>

      <b-col cols="12" md="4">
        <b-form-group label="Email">
          <b-form-input
            type="email"
            v-model="order.recipient_email"
            @change="changeOrder($event, 'recipient_email')"
          />
        </b-form-group>
      </b-col>
    </b-row>
  </b-card-actions>
</template>

<script>
import { mapGetters } from "vuex";

import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

import SelectCities from "@/components/ui/selectCities/selectCities.vue";
import SelectClients from "@/components/ui/selectClients/selectClients.vue";
import vSelect from "vue-select";
import BCardActions from "@/@core/components/b-card-actions/BCardActions.vue";

import {
  BOverlay,
  BRow,
  BCol,
  BCard,
  BFormInput,
  BFormGroup,
  BFormTextarea,
} from "bootstrap-vue";

export default {
  components: {
    BOverlay,
    BRow,
    BCol,
    BCard,
    BFormInput,
    BFormGroup,
    BFormTextarea,

    SelectCities,
    SelectClients,
    vSelect,
    BCardActions,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      clientType: "moduleClients/getClientType",
    }),
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
