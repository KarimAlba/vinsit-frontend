<template>
    <b-overlay :show="loading" rounded="sm">
        <filters type="reconciliation_act" />
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
                        <b-form-group>
                            <v-select
                                label="label"
                                :options="types"
                                :reduce="item => item.key"
                                v-model="filters.type"
                            >
                            </v-select>
                        </b-form-group>
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
                :items="reconciliationActs" 
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
            />
        </b-card>
    </b-overlay>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

import downloadPdf from '../../utils/downloadPdf';

import Filters from "@/components/accounting/Filters";
import vSelect from "vue-select";

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

export default {
    data() {
        return {
            fields: [
                { key: "id", label: "ID", sortable: true },
                { key: "client", label: "ID клиента", sortable: true },
                { key: "name", label: "Имя клиента", sortable: true },
                { key: "date_created", label: "Дата создания", sortable: true },
                { key: "pdf", label: "Документ", sortable: true },
            ],
            types: [
                {key: 'O', label: 'По всем заказам'},
                {key: 'A', label: 'Только по актам'},
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
            loading: "moduleReconciliationActs/getLoading",
            count: "moduleReconciliationActs/getCount",
            perPage: "moduleReconciliationActs/getCountPerPage",
            curPage: "moduleReconciliationActs/getCurPage",
            filters: "moduleReconciliationActs/getFilters",
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
            resetFilters: "moduleReconciliationActs/resetFilters",
            resetPagination: "moduleReconciliationActs/resetPagination",
        }),
        ...mapMutations({
            changeCurPage: "moduleReconciliationActs/changePage",
            changeOrdering: "moduleReconciliationActs/changeOrdering",
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
        changePage(page) {
            this.changeCurPage(page);
            this.fetchInvoices();
        },
        handleSearchField: _.debounce((value, vm) => {
            vm.filters.type = value;
        }, 500),
    },
    mounted() {
        this.fetchInvoices();
        this.resetFilters();
    },
};
</script>

<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";

	.filter-orders {
		&__btn {
			display: inline-flex;
			align-items: center;

			&:hover {
				.filter-act__btn-text {
					color: $primary;
					border-color: $primary;
				}
			}
		}

		&__btn-text {
			margin-left: 5px;
			border-bottom: 1px dashed #000;
		}
	}
</style>
