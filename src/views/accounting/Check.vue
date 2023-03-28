<template>
  <b-overlay :show="loading" rounded="sm">
    <filters type="payment" />

    <b-card>
      <b-table :items="transformedChecks" :fields="fields" striped responsive>
        <template #cell(date_created)="data">
          {{ formatDate(data.item.date_created) }}
        </template>

        <template #cell(pdf)="data">
            <a
                class="link"
                style="color: #3d78b4;"
                @click="handlePdfDownload($event, data.item.id, data.item.customer, data.item.date_created)"
            >
                <feather-icon icon="DownloadIcon" size="16" />
                Скачать
            </a>
        </template>
      </b-table>

      <b-pagination
        v-if="showPagination"
        :total-rows="count"
        :per-page="perPage"
        @change="changePage"
        :value="curPage"
        align="right"
      ></b-pagination>
    </b-card>
  </b-overlay>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

import { BOverlay, BCard, BTable, BPagination } from "bootstrap-vue";
import downloadPdf from '../../utils/downloadPdf';

import Filters from "@/components/accounting/Filters";

export default {
  data() {
    return {
      fields: [
        { key: "id", label: "ID" },
        { key: "customer", label: "ID Клиента" },
        { key: "orders", label: "Заказы" },
        // { key: "postfix", label: "Тип чека" },
        // { key: "status", label: "Статус" },
        { key: "date_created", label: "Дата создания" },
        // { key: "date_paid", label: "Дата оплаты" },
        // { key: "paid_amount", label: "Выплаченная сумма" },
        { key: "pdf", label: "Документ" },
      ],
    };
  },
  components: {
    BOverlay,
    BCard,
    BTable,
    BPagination,

    Filters,
  },
  computed: {
    ...mapGetters({
      loading: "moduleAccountingChecks/getLoading",
      count: "moduleAccountingChecks/getCount",
      perPage: "moduleAccountingChecks/getCountPerPage",
      curPage: "moduleAccountingChecks/getCurPage",
      checks: "moduleAccountingChecks/getChecks",
    }),
    transformedChecks() {
        return this.checks.map(ch => {
            ch.orders = ch.orders.join(', ');
            return ch;
        });
    },
    showPagination() {
      return Math.ceil(this.count / this.perPage) > 1;
    },
    urlAPI() {
      return process.env.VUE_APP_API_URL;
    },
  },
  methods: {
    ...mapActions({
      fetchChecks: "moduleAccountingChecks/fetchChecks",
    }),
    ...mapMutations({
      changeCurPage: "moduleAccountingChecks/changePage",
    }),
    async handlePdfDownload(event, id, customerId, date) {
        event.preventDefault();
        downloadPdf(this.linkToPDF(id), `Чек-#${id}-client-#${customerId}-${date}.pdf`);
    },
    formatDate(date) {
      return this.dayjs(date).format("DD.MM.YYYY");
    },
    linkToPDF(id) {
      return `${this.urlAPI}/api/v1/checks/${id}/generate_pdf/`;
    },
    changePage(page) {
      this.changeCurPage(page);
      this.fetchChecks();
    },
  },
  mounted() {
    this.fetchChecks();
  },
};
</script>
