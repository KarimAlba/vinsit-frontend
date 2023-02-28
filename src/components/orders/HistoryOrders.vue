<template>
  <b-card-actions title="История заказа" actionCollapse>
    <b-row align-h="between">
      <b-col cols="3"> Всего изменений: {{ totalRows }} </b-col>

      <b-col cols="3">
        <b-form-input
          class="mb-2"
          placeholder="Поиск"
          v-model="filter"
          debounce="500"
        ></b-form-input>
      </b-col>
    </b-row>

    <b-table
      id="table-history-orders"
      :items="history"
      :fields="fields"
      striped
      responsive
      :per-page="perPage"
      :current-page="currentPage"
      :filter="filter"
      @filtered="filteredTable"
    >
      <template #cell(history_content)="data">
        <p>
          <template v-if="data.item.oldValue">
            Поле <b>{{ data.item.valByKeyObj }}</b> изменено c
            <b>{{ data.item.oldValue }}</b> на <b>{{ data.item.newValue }}</b>
          </template>
          <template v-else>
            Полю <b>{{ data.item.valByKeyObj }}</b> добавлено новое значение
            <b>{{ data.item.newValue }}</b>
          </template>
        </p>
      </template>

      <template #cell(history_date)="data">
        {{ formatDate(data.item.history_date) }}
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      aria-controls="table-history-orders"
    ></b-pagination>
  </b-card-actions>
</template>

<script>
import _ from "lodash";
import { mapGetters } from "vuex";

import {
  BRow,
  BCol,
  BCard,
  BFormInput,
  BTable,
  BButton,
  BBadge,
  BPagination,
} from "bootstrap-vue";

import BCardActions from "@/@core/components/b-card-actions/BCardActions.vue";

export default {
  props: {
    idOrder: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      perPage: 20,
      currentPage: 1,
      totalRows: 0,
      filter: "",

      fields: [
        { key: "history_date", label: "Дата изменения" },
        { key: "history_content", label: "Информация" },
      ],

      fieldsForHistory: {
        places: "Места в заказе",
        total_weight: "Вес",
        order_products: "Товары в заказе",
        amo_crm_id: "AMO CRM ID",
        name: "Name",
        status_changed_date: "Дата изменения статуса",
        type: "Тип заказа",
        mode: "Режим заказа",
        location: "Местоположение",
        pay_on_order: "Наложенный платеж",
        contract: "Договор",
        comment: "Примечание",
        total_price: "Итоговая стоимость",
        delivery_price: "Стоимость доставки",
        delivery_date: "Дата доставки",
        barcode: "Штрихкод",
        date_created: "Дата создания",
        sender_passport_series: "Серия паспорта отправителя",
        sender_passport_no: "Номер паспорта отправителя",
        sender_counterparty_type: "Тип контрагента отправителя",
        sender_address: "Адрес отправителя",
        sender_full_name: "ФИО отправителя",
        recipient_passport_series: "Серия паспорта получателя",
        recipient_passport_no: "Номер паспорта получателя",
        recipient_counterparty_type: "Тип контрагента получателя",
        recipient_address: "Адрес получателя",
        recipient_full_name: "ФИО получателя",
        recipient_email: "Email получателя",
        status: "Статус",
        sender_counterparty: "Контрагент отправителя",
        sender_city: "Город отправителя",
        recipient_counterparty: "Контрагент получателя",
        recipient_city: "Город получателя",
        payer_counterparty: "Контрагент плательщика",
        payer_city: "Город плательщика",
      },

      orderStatus: [],
      history: [],
    };
  },
  components: {
    BRow,
    BCol,
    BCard,
    BTable,
    BButton,
    BBadge,
    BCardActions,
    BPagination,
    BFormInput,
  },
  computed: {
    ...mapGetters({
      orderMode: "moduleOrders/getOrderMode",
      orderType: "moduleOrders/getOrderType",
      clientType: "moduleClients/getClientType",
    }),
  },
  methods: {
    fetchOrderHistory() {
      this.$api.orders.getOrderHistory(this.idOrder).then((response) => {
        this.createHistoryArr(response.data.history);
      });
    },
    getColorStatus(status) {
      return (
        this.orderStatus.find((x) => x.title === status)?.color || "secondary"
      );
    },
    formatDate(date) {
      return this.dayjs(date).format("DD.MM.YYYY HH:mm");
    },
    fetchStatus() {
      this.$api.orderStatus.getOrderStatusList().then((response) => {
        this.orderStatus = response.data.results;
      });
    },
    getClientType(clientType) {
      return this.clientType.find((type) => type.id === clientType)
        ?.short_title;
    },
    createHistoryArr(array) {
      let arr = [];

      for (let index = 0; index < array.length; index++) {
        let changes = _.differenceWith(
          _.toPairs(array[index + 1]),
          _.toPairs(array[index]),
          _.isEqual
        );

        changes.forEach((change) => {
          if (_.has(this.fieldsForHistory, change[0])) {
            let key = change[0],
              valByKeyObj = this.fieldsForHistory[key],
              oldValue = array[index][key],
              newValue = array[index + 1][key];

            if (key === "mode") {
              if (oldValue)
                oldValue = this.orderMode.find((x) => x.id === oldValue).title;
              newValue = this.orderMode.find((x) => x.id === newValue).title;
            }

            if (key === "type") {
              if (oldValue)
                oldValue = this.orderType.find((x) => x.id === oldValue).title;
              newValue = this.orderType.find((x) => x.id === newValue).title;
            }

            if (
              key === "recipient_counterparty_type" ||
              key === "sender_counterparty_type"
            ) {
              if (oldValue)
                oldValue = this.clientType.find((x) => x.id === oldValue).title;
              newValue = this.clientType.find((x) => x.id === newValue).title;
            }

            if (key === "status") {
              if (oldValue)
                oldValue = this.orderStatus.find(
                  (x) => x.id === oldValue
                ).status;
              newValue = this.orderStatus.find((x) => x.id === newValue).status;
            }

            arr.push({ valByKeyObj, oldValue, newValue });
          }
        });
      }

      this.totalRows = arr.length;
      this.history = arr;
    },
    filteredTable(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  mounted() {
    this.fetchOrderHistory();

    this.fetchStatus();
  },
};
</script>
