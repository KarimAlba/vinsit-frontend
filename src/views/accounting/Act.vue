<template>
  <b-overlay :show="loading" rounded="sm">
    <filters type="act" />

    <b-card>
      <b-table :items="acts" :fields="fields" striped responsive>
        <template #cell(date_created)="data">
          {{ formatDate(data.item.date_created) }}
        </template>

        <template #cell(pdf)="data">
          <a :href="linkToPDF(data.item.id)" target="_blank">
            <feather-icon icon="DownloadIcon" size="16" />
            Скачать</a
          >
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

import Filters from "@/components/accounting/Filters";

export default {
  data() {
    return {
      fields: [
        { key: "id", label: "ID" },
        { key: "customer", label: "ID Клиента" },
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
      loading: "moduleAccountingActs/getLoading",
      count: "moduleAccountingActs/getCount",
      perPage: "moduleAccountingActs/getCountPerPage",
      curPage: "moduleAccountingActs/getCurPage",
      acts: "moduleAccountingActs/getActs",
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
      fetchActs: "moduleAccountingActs/fetchActs",
    }),
    ...mapMutations({
      changeCurPage: "moduleAccountingActs/changePage",
    }),
    formatDate(date) {
      return this.dayjs(date).format("DD.MM.YYYY");
    },
    linkToPDF(id) {
      return `${this.urlAPI}/api/v1/acts/${id}/generate_pdf/`;
    },
    changePage(page) {
      this.changeCurPage(page);
      this.fetchActs();
    },
  },
  mounted() {
    this.fetchActs();
  },
};
</script>
