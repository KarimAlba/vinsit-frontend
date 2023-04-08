<template>
    <b-overlay :show="loading" rounded="sm">
        <filters type="upd" />

        <b-card>
        <b-table :items="upds" :fields="fields" striped responsive>
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
            loading: "moduleAccountingUpds/getLoading",
            count: "moduleAccountingUpds/getCount",
            perPage: "moduleAccountingUpds/getCountPerPage",
            curPage: "moduleAccountingUpds/getCurPage",
            upds: "moduleAccountingUpds/getUpds",
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
            fetchUpds: "moduleAccountingUpds/fetchUpds",
        }),
        ...mapMutations({
            changeCurPage: "moduleAccountingUpds/changePage",
        }),
        async handlePdfDownload(event, id, customerId, date) {
            event.preventDefault();
            downloadPdf(this.linkToPDF(id), `УПД-#${id}-client-#${customerId}-${date}.pdf`);
        },
        formatDate(date) {
            return this.dayjs(date).format("DD.MM.YYYY");
        },
        linkToPDF(id) {
            return `${this.urlAPI}/api/v1/upds/${id}/generate_pdf/`;
        },
        changePage(page) {
            this.changeCurPage(page);
            this.fetchUpds();
        },
    },
    mounted() {
        this.fetchUpds();
    },
};
</script>
