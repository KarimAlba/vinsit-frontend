<template>
  <validation-observer>
    <b-card-actions title="Главная" actionCollapse>
      <b-row>
        <b-col class="mb-1" cols="12" md="4">
          <validation-provider #default="{ errors }" rules="required">
            <b-form-group :invalid-feedback="errors[0]" :state="!errors.length">
              <v-select
                label="title"
                :reduce="(mode) => mode.id"
                placeholder="Режим заказа"
                :options="orderMode"
                v-model="order.mode"
                :disabled="readOnly"
                @input="changeOrder($event, 'mode')"
              />
            </b-form-group>
          </validation-provider>
        </b-col>

        <b-col class="mb-1" cols="12" md="4">
          <validation-provider #default="{ errors }" rules="required">
            <b-form-group :invalid-feedback="errors[0]" :state="!errors.length">
              <v-select
                label="title"
                :reduce="(type) => type.id"
                placeholder="Тип заказа"
                :options="orderType"
                v-model="order.type"
                :disabled="readOnly"
                @input="changeOrder($event, 'type')"
              />
            </b-form-group>
          </validation-provider>
        </b-col>

        <b-col class="mb-1" cols="12" md="4">
          <validation-provider #default="{ errors }" rules="required">
            <b-form-group :invalid-feedback="errors[0]" :state="!errors.length">
              <v-select
                label="status"
                :reduce="(status) => status.id"
                placeholder="Статус заказа"
                :options="orderStatus"
                v-model="order.status"
                :disabled="readOnly"
                @input="changeOrder($event, 'status')"
              />
            </b-form-group>
          </validation-provider>
        </b-col>

        <b-col class="mb-1" cols="4">
          <b-form-group label="Наложенный платеж">
            <b-form-input
                v-model="order.pay_on_order"
                :disabled="readOnly"
                type="number"
                @change="changeOrder($event, 'pay_on_order')"
            ></b-form-input>
          </b-form-group>
        </b-col>

        <b-col class="mb-1" cols="4">
          <b-form-group label="Стоимость доставки">
            <b-form-input
                v-model="order.delivery_price"
                :disabled="readOnly"
                type="number"
                @change="changeOrder($event, 'delivery_price')"
            ></b-form-input>
          </b-form-group>
        </b-col>

        <b-col class="mb-1" cols="4">
            <b-form-group label="Дата доставки товара">
                <b-form-datepicker
                    label="date"
                    v-model="order.delivery_date"
					@input="changeOrder($event, 'delivery_date')"
                />
            </b-form-group>
        </b-col>

        <!-- <b-col class="mb-1" cols="4">
          <b-form-group label="Договор">
            <b-form-input
              v-model="order.contract"
              @change="changeOrder($event, 'contract')"
            ></b-form-input>
          </b-form-group>
        </b-col> -->

        <b-col class="mb-1" cols="6">
          <b-form-group label="Местоположение">
            <b-form-input
                v-model="order.location"
                :disabled="readOnly"
                @change="changeOrder($event, 'location')"
            ></b-form-input>
          </b-form-group>
        </b-col>

        <b-col cols="12">
          <b-form-textarea
            placeholder="Примечание"
            rows="3"
            max-rows="6"
            v-model="order.comment"
            :disabled="readOnly"
            @change="changeOrder($event, 'comment')"
          ></b-form-textarea>
        </b-col>
      </b-row>
    </b-card-actions>
  </validation-observer>
</template>

<script>
import { mapGetters } from "vuex";

import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";

import vSelect from "vue-select";

import {
  BOverlay,
  BRow,
  BCol,
  BCard,
  BFormInput,
  BFormGroup,
  BFormTextarea,
  BFormDatepicker,
} from "bootstrap-vue";

import BCardActions from "@/@core/components/b-card-actions/BCardActions.vue";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    BOverlay,
    BRow,
    BCol,
    BCard,
    BFormInput,
    BFormGroup,
    BFormTextarea,
    BFormDatepicker,

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
  data() {
    return {
      orderStatus: [],
    };
  },
  computed: {
    ...mapGetters({
      orderMode: "moduleOrders/getOrderMode",
      orderType: "moduleOrders/getOrderType",
    }),
  },
	methods: {
		changeOrder(newVal, key) {
			let payload = {};
			payload[key] = newVal;

			this.$api.orders.updateOrder(this.order.id, payload).then((response) => {
				if (response.status !== 400) {
					this.$emit('updateMain');
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
		fetchStatus() {
            this.$api.orderStatus.getOrderStatusList().then((response) => {
                this.orderStatus = response.data.results;
            });
		},
	},
	mounted() {
		this.fetchStatus();
	},
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
