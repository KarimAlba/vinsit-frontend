<template>
  <b-overlay :show="loading" rounded="sm">
    <filters type="reconciliation_act" />

    <b-card>
      <b-table :items="reconciliationActs" :fields="fields" striped responsive>
        <template #cell(date_created)="data">
          {{ formatDate(data.item.date_created) }}
        </template>

        <template #cell(pdf)="data">
            <a
                class="link"
                style="color: #3d78b4;"
                @click="handlePdfDownload($event, data.item.id, data.item.client, data.item.date_created)"
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
        { key: "client", label: "ID Клиента" },
        { key: "date_created", label: "Дата создания" },
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
      loading: "moduleReconciliationActs/getLoading",
      count: "moduleReconciliationActs/getCount",
      perPage: "moduleReconciliationActs/getCountPerPage",
      curPage: "moduleReconciliationActs/getCurPage",
      reconciliationActs: "moduleReconciliationActs/getReconciliationActs",
    }),
    showPagination() {
      return Math.ceil(this.count / this.perPage) > 1;
    },
    urlAPI() {
      return process.env.VUE_APP_API_URL;
    },
  },
  methods: {
    ...mapActions({
      fetchInvoices: "moduleReconciliationActs/fetchReconciliationActs",
    }),
    ...mapMutations({
      changeCurPage: "moduleReconciliationActs/changePage",
    }),
    async handlePdfDownload(event, id, clientId, date) {
        event.preventDefault();
        downloadPdf(this.linkToPDF(id), `Акт сверки взаиморасчетов-#${id}-client-#${clientId}-${date}.pdf`);
    },
    formatDate(date) {
      return this.dayjs(date).format("DD.MM.YYYY");
    },
    linkToPDF(id) {
      return `${this.urlAPI}/api/v1/reconciliation_act/${id}/generate_pdf/`;
    },
    changePage(page) {
      this.changeCurPage(page);
      this.fetchInvoices();
    },
  },
  mounted() {
    this.fetchInvoices();
  },
};
</script>
