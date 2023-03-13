<template>
  <section class="order pb-5">
    <b-overlay :show="loading" rounded="sm">
      <h1>Заказ №{{ idOrder }}</h1>

      <b-tabs>
        <b-tab active title="Форма заказа">
          <update-main v-if="editableOrder" :order="editableOrder" :readOnly="readOnly" />
          <update-payer v-if="editableOrder" :order="editableOrder" :readOnly="readOnly" />
          <b-row>
            <b-col colls="6">
              <update-sender v-if="editableOrder" :order="editableOrder" :readOnly="readOnly" @updateSender="getOrder" />
            </b-col>
            <b-col colls="6">
              <update-recipient v-if="editableOrder" :order="editableOrder" :readOnly="readOnly" @updateRecipient="getOrder" />
            </b-col>
          </b-row>
          <update-places
            v-if="editableOrder"
            :readOnly="readOnly"
            :order="idOrder"
            :places="editableOrder.places"
            v-model="editableOrder.places"
          />
          <update-products
            v-if="editableOrder"
            :readOnly="readOnly"
            :order="idOrder"
            :products="editableOrder.products"
            :places="editableOrder.places"
            v-model="editableOrder.products"
          />
        </b-tab>

        <b-tab title="История заказа">
          <b-row>
            <b-col>
              <b-card>
                <b-card-title>Основная информация</b-card-title>

                <table class="w-100">
                  <tr>
                    <td class="pb-1">Договор</td>
                    <td class="pb-1">{{ editableOrder.contract }}</td>
                  </tr>

                  <tr v-if="order.status">
                    <td class="pb-1">Статус</td>
                    <td class="pb-1">
                      <b-badge variant="success">
                        {{ editableOrder.status }}
                      </b-badge>
                    </td>
                  </tr>

                  <tr>
                    <td class="pb-1">Дата создания заказа</td>
                    <td class="pb-1">
                      {{ formatDate(editableOrder.date_created) }}
                    </td>
                  </tr>

                  <tr>
                    <td class="pb-1">Дата изменения статуса</td>
                    <td class="pb-1">
                      {{ formatDate(editableOrder.status_changed_date) }}
                    </td>
                  </tr>

                  <tr>
                    <td class="pb-1">Дата доставки</td>
                    <td class="pb-1">
                      {{ formatDate(editableOrder.delivery_date) }}
                    </td>
                  </tr>

                  <tr>
                    <td class="pb-1">Договор</td>
                    <td class="pb-1">{{ editableOrder.contract }}</td>
                  </tr>

                  <tr>
                    <td class="pb-1">Наложенный платеж</td>
                    <td class="pb-1">{{ editableOrder.pay_on_order }}</td>
                  </tr>

                  <tr>
                    <td class="pb-1">Стоимость доставки</td>
                    <td class="pb-1">{{ editableOrder.delivery_price }}</td>
                  </tr>

                  <tr>
                    <td class="pb-1">Итоговая стоимость</td>
                    <td class="pb-1">{{ editableOrder.total_price }}</td>
                  </tr>

                  <tr>
                    <td class="pb-1">Местоположение</td>
                    <td class="pb-1">{{ editableOrder.location }}</td>
                  </tr>
                </table>
              </b-card>
            </b-col>
            <b-col>
              <b-card>
                <b-card-title>Место в заказе</b-card-title>

                <table class="w-100">
                  <tr>
                    <td class="pb-1">Штрих-код</td>
                    <td class="pb-1">
                      <a class="link" target="_blank" :href="editableOrder.barcode">{{
                        order.id
                      }}</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="pb-1">Общий физический вес</td>
                    <td class="pb-1">{{ editableOrder.total_weight }} кг</td>
                  </tr>

                  <tr>
                    <td class="pb-1">Общий объемный вес</td>
                    <td class="pb-1">{{ editableOrder.total_volume_weight }}</td>
                  </tr>

                  <tr>
                    <td class="pb-1">Вес к оплате</td>
                    <td class="pb-1">{{ editableOrder.payable_weight }} кг</td>
                  </tr>
                </table>
              </b-card>
            </b-col>
          </b-row>

          <history-orders v-if="editableOrder && $store.state.app.user.role === roles.AD" :idOrder="idOrder" />
        </b-tab>
      </b-tabs>

      <div class="footer order__footer px-4 py-1">
        <div>
          <h3><b>Итого</b></h3>
          <p class="my-0">Стоимость услуг: {{ totalPrice }} руб</p>
        </div>

        <div>
          <b-button
            @click="handlePdfDownload"
            class="mr-2"
            variant="success"
          >
            <feather-icon icon="FileTextIcon" />
            Скачать PDF</b-button
          >
          <b-button v-b-modal.modal-delete variant="danger" v-if="$store.state.app.user.role === roles.AD">Удалить</b-button>
        </div>
      </div>

      <b-modal
        id="modal-delete"
        title="Удалить?"
        @ok="deleteOrder"
        ok-title="Удалить"
        ok-variant="danger"
        header-bg-variant="danger"
        cancel-title="Отмена"
        size="sm"
      >
        <p>Удалить заказ?</p>
      </b-modal>
    </b-overlay>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

import UpdateMain from "@/components/orders/update/UpdateMain.vue";
import UpdatePayer from "@/components/orders/update/UpdatePayer.vue";
import UpdateSender from "@/components/orders/update/UpdateSender.vue";
import UpdateRecipient from "@/components/orders/update/UpdateRecipient.vue";
import UpdateProducts from "@/components/orders/update/UpdateProducts.vue";
import UpdatePlaces from "@/components/orders/update/UpdatePlaces.vue";

import HistoryOrders from "@/components/orders/HistoryOrders.vue";

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
} from "bootstrap-vue";
import BCardActions from "@/@core/components/b-card-actions/BCardActions.vue";
import vSelect from "vue-select";
import downloadPdf from '../../utils/downloadPdf';
import { RoleConstants } from '@/utils/role';
import store from "@/store/index";
import '@/libs/dayjs'

export default {
  components: {
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

    UpdateMain,
    UpdatePayer,
    UpdateSender,
    UpdateRecipient,
    UpdateProducts,
    UpdatePlaces,

    HistoryOrders,
    vSelect,
  },
  data() {
    return {
      orderHistory: [],
      roles: RoleConstants,
    };
  },
  computed: {
    ...mapGetters({
      loading: "moduleOrders/getLoading",
      order: "moduleOrders/getOrder",
      editableOrder: "moduleOrders/getEditableOrder",
      orderMode: "moduleOrders/getOrderMode",
      orderType: "moduleOrders/getOrderType",
      placeStatus: "moduleOrders/getPlaceStatus",
    }),
    readOnly() {
        return store.state.app.user.role !== this.roles.AD && store.state.app.user.role !== this.roles.LG;
    },
    idOrder() {
      return this.$route.params.id || null;
    },
    urlAPI() {
      return process.env.VUE_APP_API_URL;
    },
    linkToPDF() {
      return `${this.urlAPI}/api/v1/order/${this.idOrder}/generate_pdf/`;
    },
    totalPrice() {
      return (
        parseFloat(this.editableOrder.delivery_price) +
        parseFloat(this.editableOrder.pay_on_order)
      ).toFixed(2);
    },
  },
  methods: {
    ...mapActions({
      fetchOrder: "moduleOrders/fetchOrder",
    }),
    ...mapMutations({
      changeLoading: "moduleOrders/changeLoading",
    }),
    getPlaceStatus(status) {
      return this.placeStatus.find((x) => x.id === status).title || "Не задан";
    },
    formatDate(date) {
      return this.dayjs(date).isValid()
        ? this.dayjs(date).format("DD.MM.YYYY")
        : "Отсутствует";
    },
    deleteOrder() {
      this.changeLoading(true);

      this.$api.orders.deleteOrder(this.idOrder).then((response) => {
        this.changeLoading(false);

        this.$router.push({ name: "orders" });
      });
    },
    async handlePdfDownload() {
        downloadPdf(this.linkToPDF, `order${this.idOrder}.pdf`);
    },
	getOrder() {
		this.fetchOrder(this.idOrder);
	},
  },
  mounted() {
    this.fetchOrder(this.idOrder);
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
    display: flex;
    align-items: center;
    justify-content: space-between;

    background: #ffffff;

    box-shadow: 0px 0px 8px rgba(11, 31, 53, 0.04),
      0px -4px 8px rgba(11, 31, 53, 0.08);
  }
}
</style>
