<template>
    <b-overlay :show="loading" rounded="sm">
        <filters type="invoice" />
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
            <b-collapse v-model="visible" id="filters-collapse">
                <b-row>
                    <b-col class="mb-1" cols="12" md="4">
                        <!-- <b-form-group>
                            <v-select
                                label="label"
                                :options="types"
                                :reduce="item => item.key"
                                v-model="filters.type"
                            >
                            </v-select>
                        </b-form-group> -->
                    </b-col>
                </b-row>
            </b-collapse>
            <template #footer>
                <a class="filter-act__btn mr-1" v-b-toggle="'filters-collapse'">
                    <feather-icon
                        :icon="visible ? 'ChevronUpIcon' : 'ChevronDownIcon'"
                        size="12"
                    />
                    <span class="filter-act__btn-text"> Все фильтры </span>
                </a>
                <a 
                    class="filter-act__btn" 
                    @click="() => {
                        resetFilters()
                    }"
                >
                    <feather-icon icon="XCircleIcon" size="12" />
                    <span class="filter-act__btn-text"> Сбросить все фильтры </span>
                </a>
            </template>
        </b-card>

        <b-card>
        <b-table 
            :items="invoices" 
            :fields="fields" 
            striped 
            responsive

            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :no-local-sorting="true"    
        >
            <template #cell(customer)="data">
                {{ data.item.customer.name }}
            </template>

            <template #cell(date_created)="data">
                {{ formatDate(data.item.date_created) }}
            </template>

            <template #cell(type)="data">
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

import {
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BCollapse,
    VBToggle,
    BOverlay, 
    BCard, 
    BTable, 
    BPagination 
} from "bootstrap-vue";
import downloadPdf from '../../utils/downloadPdf';

import Filters from "@/components/accounting/Filters";
import vSelect from "vue-select";

export default {
    data() {
        return {
            fields: [
                { key: "id", label: "ID", sortable: true },
                // { key: "customer", label: "ID Клиента", sortable: true },
                { key: "customer", label: "Имя клиента", sortable: true },
                { key: "date_created", label: "Дата создания", sortable: true },
                { key: "type", label: "Документ", sortable: false },
            ],

            search: null,
            visible: false,
            sortBy: 'date_created',
            sortDesc: false,
        };
    },
    components: {
        BOverlay,
        BCard,
        BTable,
        BPagination,

        BRow,
        BCol,
        BFormGroup,
        BFormInput,
        BFormCheckbox,
        BCollapse,
        VBToggle,

        Filters,
        vSelect,
    },
    watch: {
        filters: {
            handler(val) {
            // console.log('handler - ', val);
                this.fetchInvoices();
            },
            deep: true,
        },
        'search'(value) {
            // console.log('search - ', value);
            this.handleSearchField(value, this);
        },
        'sortBy'(newValue) {
            if (!newValue) return;
            // console.log('newValue - ', newValue);
            this.sortTable();
        },
        'sortDesc'(newValue) {
            // console.log('newValue - ', newValue);
            this.sortTable();
        }
    },
    directives: {
        "b-toggle": VBToggle,
    },
    computed: {
        ...mapGetters({
            loading: "moduleInvoices/getLoading",
            count: "moduleInvoices/getCount",
            perPage: "moduleInvoices/getCountPerPage",
            curPage: "moduleInvoices/getCurPage",
            filters: "moduleInvoices/getFilters",
            invoices: "moduleInvoices/getInvoices",
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
            fetchInvoices: "moduleInvoices/fetchInvoices",
            resetFilters: "moduleInvoices/resetFilters",
            resetPagination: "moduleInvoices/resetPagination",
        }),
        ...mapMutations({
            changeCurPage: "moduleInvoices/changePage",
            changeOrdering: "moduleInvoices/changeOrdering",
        }),
        async handlePdfDownload(event, id, customerId, date) {
            event.preventDefault();
            downloadPdf(this.linkToPDF(id), `Счет-фактура-#${id}-client-#${customerId}-${date}.pdf`);
        },
        formatDate(date) {
            return this.dayjs(date).format("DD.MM.YYYY");
        },
        linkToPDF(id) {
            return `${this.urlAPI}/api/v1/invoices/${id}/generate_pdf/`;
        },
        changePage(page) {
            this.changeCurPage(page);
            this.fetchInvoices();
        },
        checkSortName() {
            switch(this.sortBy) {
                // case 'write_offs':
                //     return 'financial_transaction';
                default:
                    return this.sortBy;
            };
        },
        sortTable() {
            let ordering = this.checkSortName();

            if (this.sortDesc) {
                this.changeOrdering(ordering);
            } else {
                this.changeOrdering(`-${ordering}`);
            }

            this.resetPagination();
            setTimeout(() => {
                this.fetchInvoices();
            }, 0);
        },
        handleSearchField: _.debounce((value, vm) => {
            vm.filters.search = value;
        }, 500),
    },
    mounted() {
        this.fetchInvoices();
        this.resetFilters();
    },
};
</script>
