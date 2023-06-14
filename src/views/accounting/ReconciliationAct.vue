<template>
    <b-overlay :show="loading" rounded="sm">
        <filters type="reconciliation_act" />
        <b-card>
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
            <template #footer>
                <a class="filter-orders__btn mr-1" v-b-toggle="'filters-collapse'">
                    <feather-icon
                        :icon="visible ? 'ChevronUpIcon' : 'ChevronDownIcon'"
                        size="12"
                    />
                    <span class="filter-orders__btn-text"> Все фильтры </span>
                </a>
                <a 
                    class="filter-orders__btn" 
                    @click="() => {
                        resetFilters()
                    }"
                >
                    <feather-icon icon="XCircleIcon" size="12" />
                    <span class="filter-orders__btn-text"> Сбросить все фильтры </span>
                </a>
            </template>
        </b-card>

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
                { key: "id", label: "ID" },
                { key: "client", label: "ID Клиента" },
                { key: "date_created", label: "Дата создания" },
                { key: "pdf", label: "Документ" },
            ],
            types: [
                {key: 'O', label: 'По всем заказам'},
                {key: 'A', label: 'Только по актам'},
            ],
            search: null,
            visible: false,
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
            console.log('handler - ', val);
                // this.resetPagination();
                this.fetchInvoices();
            },
            deep: true,
        },
        'search'(value) {
            console.log('search - ', value);
            this.handleSearchField(value, this);
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
				.filter-orders__btn-text {
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
