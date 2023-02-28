<template>
  <section class="order pb-5">
    <b-overlay :show="loading" rounded="sm">
      <h1>Новый заказ</h1>

      <validation-observer ref="simpleRules" v-slot="{ invalid }">
        <b-card-actions title="Главная" actionCollapse>
          <b-row>
            <b-col class="mb-1" cols="12" md="4">
              <validation-provider #default="{ errors }" rules="required">
                <b-form-group
                  :invalid-feedback="errors[0]"
                  :state="!errors.length"
                >
                  <v-select
                    label="title"
                    :reduce="(mode) => mode.id"
                    placeholder="Режим заказа"
                    :options="orderMode"
                    v-model="order.mode"
                  />
                </b-form-group>
              </validation-provider>
            </b-col>

            <b-col class="mb-1" cols="12" md="4">
              <validation-provider #default="{ errors }" rules="required">
                <b-form-group
                  :invalid-feedback="errors[0]"
                  :state="!errors.length"
                >
                  <v-select
                    label="title"
                    :reduce="(type) => type.id"
                    placeholder="Тип заказа"
                    :options="orderType"
                    v-model="order.type"
                  />
                </b-form-group>
              </validation-provider>
            </b-col>

            <b-col class="mb-1" cols="12" md="4">
              <validation-provider #default="{ errors }" rules="required">
                <b-form-group
                  :invalid-feedback="errors[0]"
                  :state="!errors.length"
                >
                  <v-select
                    label="status"
                    :reduce="(status) => status.id"
                    placeholder="Статус заказа"
                    :options="orderStatus"
                    v-model="order.status"
                  />
                </b-form-group>
              </validation-provider>
            </b-col>

            <b-col class="mb-1" cols="4">
              <validation-provider #default="{ errors }" rules="required">
                <b-form-group
                  :invalid-feedback="errors[0]"
                  label="Наложенный платеж"
                >
                  <b-form-input
                    v-model="order.pay_on_order"
                    :state="errors.length > 0 ? false : null"
                    type="number"
                  ></b-form-input>
                </b-form-group>
              </validation-provider>
            </b-col>

            <b-col class="mb-1" cols="4">
              <validation-provider #default="{ errors }" rules="required">
                <b-form-group
                  :invalid-feedback="errors[0]"
                  label="Стоимость доставки"
                >
                  <b-form-input
                    v-model="order.delivery_price"
                    :state="errors.length > 0 ? false : null"
                    type="number"
                  ></b-form-input>
                </b-form-group>
              </validation-provider>
            </b-col>

            <b-col class="mb-1" cols="4">
              <b-form-group label="Договор">
                <b-form-input v-model="order.contract"></b-form-input>
              </b-form-group>
            </b-col>

            <b-col class="mb-1" cols="6">
              <b-form-group label="Местоположение">
                <b-form-input v-model="order.location"></b-form-input>
              </b-form-group>
            </b-col>

            <b-col cols="12">
              <b-form-textarea
                placeholder="Примечание"
                rows="3"
                max-rows="6"
                v-model="order.comment"
              ></b-form-textarea>
            </b-col>
          </b-row>
        </b-card-actions>

        <b-card-actions title="Плательщик" actionCollapse>
          <b-row>
            <b-col class="mb-1" cols="12" md="6">
              <b-form-group label="Плательщик">
                <select-clients
                  :reduce="(client) => client.id"
                  v-model="order.payer_counterparty"
                />
              </b-form-group>
            </b-col>

            <b-col class="mb-1" cols="12" md="6">
              <b-form-group label="Город">
                <select-cities v-model="order.payer_city" />
              </b-form-group>
            </b-col>
          </b-row>
        </b-card-actions>

        <b-card-actions title="Отправитель" actionCollapse>
          <b-row>
            <b-col class="mb-1" cols="12" md="4">
              <b-form-group label="Отправитель">
                <select-clients
                  :reduce="(client) => client.id"
                  v-model="order.sender_counterparty"
                />
              </b-form-group>
            </b-col>

            <b-col class="mb-1" cols="12" md="4">
              <b-form-group label="Город">
                <select-cities v-model="order.sender_city" />
              </b-form-group>
            </b-col>

            <b-col class="mb-1" cols="12" md="4">
              <validation-provider #default="{ errors }" rules="required">
                <b-form-group
                  label="Тип отправителя"
                  :invalid-feedback="errors[0]"
                  :state="!errors.length"
                >
                  <v-select
                    label="title"
                    :reduce="(type) => type.id"
                    :options="clientType"
                    v-model="order.sender_counterparty_type"
                  />
                </b-form-group>
              </validation-provider>
            </b-col>

            <b-col cols="12" md="8">
              <b-form-group label="ФИО отправителя">
                <b-form-input v-model="order.sender_full_name"></b-form-input>
              </b-form-group>
            </b-col>

            <b-col cols="12" md="2">
              <b-form-group label="Серия паспорта">
                <b-form-input
                  v-model="order.sender_passport_series"
                ></b-form-input>
              </b-form-group>
            </b-col>

            <b-col cols="12" md="2">
              <b-form-group label="Номер паспорта">
                <b-form-input v-model="order.sender_passport_no"></b-form-input>
              </b-form-group>
            </b-col>

            <b-col cols="12">
              <b-form-group label="Адрес">
                <b-form-textarea
                  rows="3"
                  max-rows="6"
                  v-model="order.sender_address"
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
                <b-form-group
                  :invalid-feedback="errors[0]"
                  label="Номер телефона"
                >
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
          </b-row>
        </b-card-actions>

        <b-card-actions title="Получатель" actionCollapse>
          <b-row>
            <b-col class="mb-1" cols="12" md="4">
              <b-form-group label="Получатель">
                <select-clients
                  :reduce="(client) => client.id"
                  v-model="order.recipient_counterparty"
                />
              </b-form-group>
            </b-col>

            <b-col class="mb-1" cols="12" md="4">
              <b-form-group label="Город">
                <select-cities v-model="order.recipient_city" />
              </b-form-group>
            </b-col>

            <b-col class="mb-1" cols="12" md="4">
              <validation-provider #default="{ errors }" rules="required">
                <b-form-group
                  label="Тип получателя"
                  :invalid-feedback="errors[0]"
                  :state="!errors.length"
                >
                  <v-select
                    label="title"
                    :reduce="(type) => type.id"
                    :options="clientType"
                    v-model="order.recipient_counterparty_type"
                  />
                </b-form-group>
              </validation-provider>
            </b-col>

            <b-col cols="12" md="8">
              <b-form-group label="ФИО получателя">
                <b-form-input
                  v-model="order.recipient_full_name"
                ></b-form-input>
              </b-form-group>
            </b-col>

            <b-col cols="12" md="2">
              <b-form-group label="Серия паспорта">
                <b-form-input
                  v-model="order.recipient_passport_series"
                ></b-form-input>
              </b-form-group>
            </b-col>

            <b-col cols="12" md="2">
              <b-form-group label="Номер паспорта">
                <b-form-input
                  v-model="order.recipient_passport_no"
                ></b-form-input>
              </b-form-group>
            </b-col>

            <b-col cols="12">
              <b-form-group label="Адрес">
                <b-form-textarea
                  rows="3"
                  max-rows="6"
                  v-model="order.recipient_address"
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
                <b-form-group
                  :invalid-feedback="errors[0]"
                  label="Номер телефона"
                >
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
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
        </b-card-actions>

        <!-- <b-card-actions title="Информация о грузе" actionCollapse>
          <b-table
            :items="order.places"
            :fields="orderPlacesFields"
            striped
            responsive
          >
            <template #cell(barcode)="data">
              <a class="link" :href="data.item.barcode">Штрих-код</a>
            </template>

            <template #cell(status)="data">
              {{ getPlaceStatus(data.item.status) }}
            </template>
          </b-table>

          <p>
            Всего мест: <b>{{ order.places.length }} </b>
          </p>
        </b-card-actions> -->

        <b-card-actions title="Информация о грузе" actionCollapse>
          <b-table
            :items="order.places"
            :fields="orderPlacesFields"
            striped
            responsive
          >
            <template #cell(place_no)="data">
              <validation-provider v-slot="{ errors }" rules="required">
                <b-form-group
                  :invalid-feedback="errors[0]"
                  :state="!errors.length"
                >
                  <b-form-input
                    v-model="data.item.place_no"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                    readonly
                  ></b-form-input>
                </b-form-group>
              </validation-provider>
            </template>

            <template #cell(weight)="data">
              <validation-provider v-slot="{ errors }" rules="required">
                <b-form-group
                  :invalid-feedback="errors[0]"
                  :state="!errors.length"
                  style="min-width: 100px"
                >
                  <b-form-input
                    v-model="data.item.weight"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  ></b-form-input>
                </b-form-group>
              </validation-provider>
            </template>

            <template #cell(length)="data">
              <b-form-input v-model="data.item.length"></b-form-input>
            </template>

            <template #cell(width)="data">
              <b-form-input v-model="data.item.width"></b-form-input>
            </template>

            <template #cell(height)="data">
              <b-form-input v-model="data.item.height"></b-form-input>
            </template>

            <template #cell(rack)="data">
              <b-form-input
                style="min-width: 100px"
                v-model="data.item.rack"
              ></b-form-input>
            </template>

            <template #cell(tare)="data">
              <b-form-input
                style="min-width: 100px"
                v-model="data.item.tare"
              ></b-form-input>
            </template>

            <template #cell(description)="data">
              <b-form-input v-model="data.item.description"></b-form-input>
            </template>

            <template #cell(delete)="data">
              <b-button
                v-b-tooltip.hover
                title="Удалить место"
                variant="danger"
                size="sm"
                @click="deletePlace(data.item.place_no)"
              >
                <feather-icon icon="Trash2Icon" />
              </b-button>
            </template>
          </b-table>

          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p>
                Всего мест: <b>{{ order.places.length }} </b>
              </p>
            </div>

            <div>
              <b-button @click="addPlace" variant="primary" size="sm"
                >Добавить место</b-button
              >
            </div>
          </div>
        </b-card-actions>

        <b-card-actions title="Товары" actionCollapse>
          <b-table
            :items="order.products"
            :fields="orderProductsFields"
            striped
          >
            <template #cell(place_no)="data">
              <validation-provider #default="{ errors }" rules="required">
                <b-form-group
                  :invalid-feedback="errors[0]"
                  :state="!errors.length"
                >
                  <v-select
                    style="min-width: 100px"
                    v-model="data.item.place_no"
                    label="place_no"
                    :options="order.places"
                    :reduce="(place) => place.place_no"
                  />
                </b-form-group>
              </validation-provider>
            </template>

            <template #cell(name)="data">
              <validation-provider v-slot="{ errors }" rules="required">
                <b-form-group
                  :invalid-feedback="errors[0]"
                  :state="!errors.length"
                >
                  <b-form-input
                    v-model="data.item.name"
                    :state="errors.length > 0 ? false : null"
                  ></b-form-input>
                </b-form-group>
              </validation-provider>
            </template>

            <template #cell(price)="data">
              <b-form-input
                v-model="data.item.price"
                type="number"
              ></b-form-input>
            </template>

            <template #cell(quantity)="data">
              <validation-provider v-slot="{ errors }" rules="required">
                <b-form-group
                  :invalid-feedback="errors[0]"
                  :state="!errors.length"
                >
                  <b-form-input
                    v-model="data.item.quantity"
                    :state="errors.length > 0 ? false : null"
                  ></b-form-input>
                </b-form-group>
              </validation-provider>
            </template>

            <template #cell(weight)="data">
              <b-form-input
                style="min-width: 100px"
                v-model="data.item.weight"
                type="number"
              ></b-form-input>
            </template>

            <template #cell(delete)="data">
              <b-button
                v-b-tooltip.hover
                title="Удалить товар"
                variant="danger"
                size="sm"
                @click="deleteProduct(data.item.id)"
              >
                <feather-icon icon="Trash2Icon" />
              </b-button>
            </template>
          </b-table>

          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p>
                Всего товаров: <b>{{ order.products.length }} </b>
              </p>
            </div>

            <div>
              <b-button
                v-if="order.places.length"
                @click="addProduct"
                variant="primary"
                size="sm"
                >Создать товар</b-button
              >
            </div>
          </div>
        </b-card-actions>

        <div class="footer order__footer px-4 py-1 d-flex">
          <b-button
            :disabled="invalid"
            variant="primary"
            class="mr-1"
            @click="validationForm"
            >Создать</b-button
          >
          <b-button variant="secondary" :to="{ name: 'orders' }"
            >Назад</b-button
          >
        </div>
      </validation-observer>
    </b-overlay>
  </section>
</template>

<script>
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

import { vMaska } from "maska";

import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email, confirmed, password } from "@validations";

import { mapActions, mapGetters, mapMutations } from "vuex";

import SelectCities from "@/components/ui/selectCities/selectCities.vue";
import SelectClients from "@/components/ui/selectClients/selectClients.vue";

import {
  BOverlay,
  BRow,
  BCol,
  BTabs,
  BTab,
  BCard,
  BFormInput,
  BFormCheckbox,
  BCardTitle,
  BBadge,
  BFormTextarea,
  BFormGroup,
  BTable,
  BButton,
  VBTooltip,
} from "bootstrap-vue";
import BCardActions from "@/@core/components/b-card-actions/BCardActions.vue";
import vSelect from "vue-select";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,

    BOverlay,
    BRow,
    BCol,
    BTabs,
    BTab,
    BCard,
    BCardTitle,
    BCardActions,
    BFormInput,
    BFormCheckbox,
    BBadge,
    BFormTextarea,
    BFormGroup,
    BTable,
    BButton,

    vSelect,
    SelectCities,
    SelectClients,
  },
  directives: { maska: vMaska, "b-tooltip": VBTooltip },
  data() {
    return {
      orderPlacesFields: [
        { key: "barcode", label: "Штрих-код" },
        { key: "place_no", label: "№ места" },
        { key: "length", label: "Длина, см" },
        { key: "width", label: "Ширина, см" },
        { key: "height", label: "Высота, см" },
        { key: "weight", label: "Фактический вес, кг" },
        { key: "status", label: "Статус" },
        { key: "rack", label: "Rack" },
        { key: "tare", label: "tare" },
        { key: "description", label: "Примечание" },
      ],

      orderPlacesFields: [
        { key: "place_no", label: "№ места" },
        { key: "length", label: "Длина, см" },
        { key: "width", label: "Ширина, см" },
        { key: "height", label: "Высота, см" },
        { key: "weight", label: "Фактический вес, кг" },
        /* { key: "rack", label: "Rack" },
        { key: "tare", label: "Tare" }, */
        { key: "description", label: "Примечание" },
        { key: "delete", label: "" },
      ],

      orderProductsFields: [
        { key: "place_no", label: "Номер места" },
        { key: "name", label: "Наименование" },
        { key: "price", label: "Стоимость за ед., руб " },
        { key: "quantity", label: "Количество" },
        { key: "total_price", label: "Сумма" },
        { key: "weight", label: "Вес" },
        { key: "delete", label: "" },
      ],

      cities: [],
      counterparty: [],
      order: {
        status: 1,
        type: "",
        mode: "",
        sender: 0,
        recipient: 0,
        payer: 0,
        comment: "",

        sender_phones: [{}],
        recipient_phones: [{}],

        places: [],
        products: [],
      },

      clients: [],
      products: [],
      orderStatus: [],

      phoneMask: {
        phone: true,
        phoneRegionCode: "RU",
        prefix: "+7",
      },
    };
  },
  computed: {
    ...mapGetters({
      loading: "moduleOrders/getLoading",

      orderMode: "moduleOrders/getOrderMode",
      orderType: "moduleOrders/getOrderType",
      placeStatus: "moduleOrders/getPlaceStatus",

      clientType: "moduleClients/getClientType",
    }),
  },
  methods: {
    ...mapActions({
      fetchOrder: "moduleOrders/fetchOrder",
    }),
    ...mapMutations({
      changeLoading: "moduleOrders/changeLoading",
    }),
    fetchStatus() {
      this.$api.orderStatus.getOrderStatusList().then((response) => {
        this.orderStatus = response.data.results;
      });
    },
    validationForm() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          this.changeLoading(true);

          this.$api.orders
            .createOrder(this.order)
            .then((response) => {
              if (response.status === 201) {
                this.$router.push({
                  name: "order",
                  params: { id: response.data.id },
                });

                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: "Успешно",
                    text: "Заказ создан",
                    icon: "CheckCircleIcon",
                    variant: "success",
                  },
                });
              } else {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: "Ошибка",
                    text: "Заказ не создан",
                    icon: "XIcon",
                    variant: "danger",
                  },
                });
              }
            })
            .finally(() => {
              this.changeLoading(false);
            });
        }
      });
    },
    addPlace() {
      let arr = this.order.places.map((place) => place.place_no),
        max = arr.length ? Math.max(...arr) : 0;

      this.order.places.push({ place_no: max + 1 });
    },
    deletePlace(id) {
      let inx = this.order.places.findIndex((place) => place.place_no === id);

      if (inx >= 0) {
        this.order.places.splice(inx, 1);
      }
    },
    addProduct() {
      this.order.products.push({});
    },
    deleteProduct(id) {
      let inx = this.order.products.findIndex(
        (product) => product.place_no === id
      );

      if (inx >= 0) {
        this.order.product.splice(inx, 1);
      }
    },
  },
  mounted() {
    this.fetchStatus();
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

.order {
  &__footer {
    position: fixed;
    z-index: 1030;
    bottom: 0;

    right: 0;
    left: 0;

    background: #ffffff;

    box-shadow: 0px 0px 8px rgba(11, 31, 53, 0.04),
      0px -4px 8px rgba(11, 31, 53, 0.08);
  }
}
</style>
