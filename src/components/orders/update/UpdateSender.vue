<template>
  <b-card-actions title="Отправитель" actionCollapse>
    <b-row>
      <b-col class="mb-1" cols="12" md="4">
        <b-form-group label="Отправитель">
          <select-clients
            :reduce="(client) => client.id"
            v-model="order.sender_counterparty"
            :disabled="readOnly"
            @input="changeOrder($event, 'sender_counterparty')"
          />
        </b-form-group>
      </b-col>

      <b-col class="mb-1" cols="12" md="4">
        <b-form-group label="Город">
          <select-cities
            v-model="order.sender_city"
            :disabled="readOnly"
            @input="changeOrder($event, 'sender_city')"
          />
        </b-form-group>
      </b-col>

      <b-col class="mb-1" cols="12" md="4">
        <b-form-group label="Тип отправителя">
          <v-select
            label="title"
            :reduce="(type) => type.id"
            :options="clientType"
            :clearable="false"
            v-model="order.sender_counterparty_type"
            :disabled="readOnly"
            @input="changeOrder($event, 'sender_counterparty_type')"
          />
        </b-form-group>
      </b-col>

      <b-col cols="12" md="8">
        <b-form-group label="ФИО отправителя">
          <b-form-input
            v-model="order.sender_full_name"
            :disabled="readOnly"
            @change="changeOrder($event, 'sender_full_name')"
          />
        </b-form-group>
      </b-col>

      <b-col cols="12" md="2">
        <b-form-group label="Серия паспорта">
          <b-form-input
            v-model="order.sender_passport_series"
            :disabled="readOnly"
            @change="changeOrder($event, 'sender_passport_series')"
          />
        </b-form-group>
      </b-col>

      <b-col cols="12" md="2">
        <b-form-group label="Номер паспорта">
          <b-form-input
            v-model="order.sender_passport_no"
            :disabled="readOnly"
            @change="changeOrder($event, 'sender_passport_no')"
          />
        </b-form-group>
      </b-col>

      <b-col cols="12">
        <b-form-group label="Адрес">
          <b-form-textarea
            rows="3"
            max-rows="6"
            v-model="order.sender_address"
            :disabled="readOnly"
            @change="changeOrder($event, 'sender_address')"
          ></b-form-textarea>
        </b-form-group>
      </b-col>

      <b-col
        v-for="(phone, i) in order.sender_phones"
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
    readOnly: false,
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
