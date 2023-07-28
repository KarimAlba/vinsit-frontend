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

                <template #cell(customer)="data">
                    {{ data.item.customer.name }}
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
            />
        </b-card>
    </b-overlay>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

import { 
    BOverlay, 
    BCard, 
    BTable, 
    BPagination, 
    BRow, 
    BCol, 
    BFormInput, 
    BFormGroup,
    BCollapse,
    VBToggle,
} from "bootstrap-vue";
import downloadPdf from '../../utils/downloadPdf';

import Filters from "@/components/accounting/Filters";
import vSelect from "vue-select";

export default {
    data() {
        return {
            fields: [
                { key: "id", label: "ID", sortable: true },
                // { key: "customer", label: "ID клиента", sortable: true },
                { key: "customer", label: "Имя клиента", sortable: true },
                { key: "date_created", label: "Дата создания", sortable: true },
                { key: "type", label: "Документ", sortable: true },
            ],
            types: [
                {key: 'O', label: 'По всем заказам'},
                {key: 'A', label: 'Только по актам'},
            ],

            search: null,
            visible: false,
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
        BCollapse,
        VBToggle,

        Filters,
        vSelect
    },
    watch: {
        filters: {
            handler(val) {
            // console.log('handler - ', val);
                this.fetchActs();
            },
            deep: true,
        },
        'search'(value) {
            console.log('search - ', value);
            this.handleSearchField(value, this);
        },
        'sortBy'(newValue) {
            if (!newValue) return;
            console.log('newValue - ', newValue);
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
            loading: "moduleAccountingActs/getLoading",
            count: "moduleAccountingActs/getCount",
            perPage: "moduleAccountingActs/getCountPerPage",
            curPage: "moduleAccountingActs/getCurPage",
            acts: "moduleAccountingActs/getActs",
            filters: "moduleAccountingActs/getFilters",
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
            resetFilters: "moduleAccountingActs/resetFilters",
            resetPagination: "moduleAccountingActs/resetPagination",
        }),
        ...mapMutations({
            changeCurPage: "moduleAccountingActs/changePage",
            changeOrdering: "moduleAccountingActs/changeOrdering",
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
        checkSortName() {
            switch(this.sortBy) {
                case 'type':
                    return 'orders';
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
                this.fetchActs();
            }, 0);
        },
        changePage(page) {
            this.changeCurPage(page);
            this.fetchActs();
        },
        handleSearchField: _.debounce((value, vm) => {
            vm.filters.search = value;
        }, 500),
    },
    mounted() {
        this.fetchActs();
        this.resetFilters();
    },
};
</script>
