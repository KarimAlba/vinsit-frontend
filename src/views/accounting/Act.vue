<template>
    <b-overlay :show="loading" rounded="sm">
        <filters type="act" />
        <b-card>
            <b-row>
                <b-col cols="12">
                    <b-form-group label="Поиск">
                        <b-form-input
                            debounce="500"
                            v-model="search"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <!-- <b-row>
                <b-col class="mb-1" cols="12" md="4">
                    <b-form-group>
                        <v-select
                            label="label"
                            :options="types"
                            :reduce="item => item.key"
                            v-model="type"
                        >
                        </v-select>
                    </b-form-group>
                </b-col>
            </b-row> -->
        </b-card>
        <b-card>
            <b-table 
                :items="acts" 
                :fields="fields" 
                striped responsive
                
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :no-local-sorting="true"
            >
                <template #cell(date_created)="data">
                    {{ formatDate(data.item.date_created) }}
                </template>

                <template #cell(name)="data">
                    {{ data.item.name }}
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
            />
        </b-card>
    </b-overlay>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

import { BOverlay, BCard, BTable, BPagination, BRow, BCol, BFormInput, BFormGroup } from "bootstrap-vue";
import downloadPdf from '../../utils/downloadPdf';

import Filters from "@/components/accounting/Filters";
import vSelect from "vue-select";

export default {
    data() {
        return {
            fields: [
                { key: "id", label: "ID" },
                { key: "customer", label: "ID клиента" },
                { key: "name", label: "Имя клиента" },
                { key: "date_created", label: "Дата создания" },
                { key: "pdf", label: "Документ" },
            ],
            types: [
                {key: 'O', label: 'По всем заказам'},
                {key: 'A', label: 'Только по актам'},
            ],
            search: null,
            sortBy: 'date_created',
            sortDesc: false,
            type: null,
        };
    },
    components: {
        BOverlay,
        BCard,
        BTable,
        BPagination,
        BRow, 
        BCol, 
        BCard, 
        BFormInput, 
        BFormGroup,

        Filters,
        vSelect
    },
    watch: {
        'search'(value) {
            console.log('search - ', value);
            this.handleSearchField(value, this);
        },
        'sortBy'(newValue) {
            // console.log('newValue - ', newValue);
            this.sortTable();
        },
        'sortDesc'(newValue) {
            // console.log('newValue - ', newValue);
            this.sortTable();
        }
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
            // changeOrdering: "moduleAccountingBank/changeOrdering",
        }),
        async handlePdfDownload(event, id, customerId, date) {
            event.preventDefault();
            downloadPdf(this.linkToPDF(id), `Акт-#${id}-client-#${customerId}-${date}.pdf`);
        },
        formatDate(date) {
            return this.dayjs(date).format("DD.MM.YYYY");
        },
        linkToPDF(id) {
            return `${this.urlAPI}/api/v1/acts/${id}/generate_pdf/`;
        },
        sortTable() {
            let ordering = 'date_created';

            if (this.sortBy === 'number') {
                ordering = 'number';
            };
            if (this.sortBy === 'counterparty') {
                ordering = 'counterparty_name';
            };
            if (this.sortBy === 'financial_transaction') {
                ordering = 'financial_transaction_name';
            };

            if (this.sortDesc) {
                this.changeOrdering(ordering);
            } else {
                this.changeOrdering(`-${ordering}`);
            }

            this.resetPagination();
            setTimeout(() => {
                this.fetchPaymentOrders();
            }, 0);
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
