<template>
  <div>
    <b-card>
      <validation-observer v-slot="{ invalid }">
        <b-row>
          <b-col cols="12" md="4">
            <validation-provider #default="{ errors }" rules="required">
              <b-form-group :invalid-feedback="errors[0]" label="Клиент">
                <select-clients
                  :reduce="(client) => client.id"
                  v-model="form.client"
                />
              </b-form-group>
            </validation-provider>
          </b-col>
          <b-col cols="12" md="4">
            <validation-provider #default="{ errors }" rules="required">
              <b-form-group :invalid-feedback="errors[0]" label="Период заказа">
                <app-datepicker @selectedDates="changeDates" />
                <input type="hidden" v-model="form.start_date" />
                <input type="hidden" v-model="form.end_date" />
              </b-form-group>
            </validation-provider>
          </b-col>

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

import {
  BRow,
  BCol,
  BCard,
  BButton,
  BFormGroup,
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
        return ["payment", "invoice", "act", "upd"].includes(value);
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

    AppDatepicker,
    SelectClients,

    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      clients: [],

      form: {
        client: null,
        start_date: null,
        end_date: null,
      },
    };
  },
  methods: {
    fetchClients() {
      this.$api.clients.getClients().then((response) => {
        this.clients = response.data.results;
      });
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
          this.form.is_payment_check = false;
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
      }

      this.$api.payDoc.createPaymentDocuments(this.form).then((response) => {
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
    this.fetchClients();
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
