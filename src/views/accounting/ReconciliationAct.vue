<template>
  <div>
    <b-card>
      <b-row>
        <b-col cols="12" md="4">
          <b-form-group label="Фирма">
            <v-select label="title" :options="arr" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <b-form-group label="Клиент">
            <v-select label="title" :options="arr" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <b-form-group label="Период заказа">
            <app-datepicker />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <b-form-group label="Режим сверки" v-slot="{ ariaDescribedby }">
            <b-form-radio
              class="mb-1"
              :aria-describedby="ariaDescribedby"
              value="A"
              >Только по счетам</b-form-radio
            >
            <b-form-radio :aria-describedby="ariaDescribedby" value="B"
              >По всем заказам</b-form-radio
            >
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4"> </b-col>
        <b-col class="mt-1 d-flex justify-content-end" cols="12" md="12">
          <b-button variant="primary"> Сформировать </b-button>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import {
  BRow,
  BCol,
  BCard,
  BButton,
  BFormGroup,
  BFormRadio,
} from "bootstrap-vue";
import vSelect from "vue-select";
import AppDatepicker from "@/@core/components/app-datepicker/AppDatepicker";

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BButton,
    BFormGroup,
    BFormRadio,
    AppDatepicker,
    vSelect,
  },
  data() {
    return {
      arr: [],
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
