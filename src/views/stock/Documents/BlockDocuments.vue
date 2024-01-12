<template>
    <div class="block-documents">
        <div class="mb-4 d-flex align-items-center justify-content-end">
            <div class="d-flex align-items-center justify-content-right" style="margin-right: 18px;">
                <b-button 
                    variant="white" 
                    v-if="!readOnly" 
                    class="whiteBtn"
                    @click="handleExportCSVClick"
                >
                    Экспорт в CSV
                </b-button>
            </div>
            <div class="d-flex align-items-center justify-content-right" style="margin-right: 18px;">
                <b-button variant="primary" :to="{ name: 'stock-document', params: { type: 'PR' } }" v-if="!readOnly" :disabled="readOnly">
                    PR
                </b-button>
            </div>
            <div class="d-flex align-items-center justify-content-right" style="margin-right: 18px;">
                <b-button variant="primary" :to="{ name: 'stock-document', params: { type: 'CN' } }" v-if="!readOnly" :disabled="readOnly">
                    CN
                </b-button>
            </div>
            <div class="d-flex align-items-center justify-content-right" style="margin-right: 18px;">
                <b-button variant="primary" :to="{ name: 'stock-document', params: { type: 'DE' } }" v-if="!readOnly" :disabled="readOnly">
                    DE
                </b-button>
            </div>
            <div class="d-flex align-items-center justify-content-right" style="margin-right: 18px;">
                <b-button variant="primary" :to="{ name: 'stock-document', params: { type: 'AC' } }" v-if="!readOnly" :disabled="readOnly">
                    AC
                </b-button>
            </div>
            <div class="d-flex align-items-center justify-content-right">
                <b-button variant="primary" :to="{ name: 'stock-document', params: { type: 'DC' } }" v-if="!readOnly" :disabled="readOnly">
                    DC
                </b-button>
            </div>
        </div>
        <b-card>
            <b-table
                :items="documents"
                :fields="fields"
                striped
                responsive
                @row-clicked="(item) => $set(item, '_showDetails', !item._showDetails)"
            >
                <template #cell(id)="data">
                    <router-link
                        style="border-bottom: 1px dotted blue"
                        :to="{ name: 'stock-document', params: { id: data.item.id, type: data.item.type } }"
                    >
                        {{ data.item.id }}
                    </router-link
                    >
                </template>

                <template #cell(date_created)="data">
                    {{ data.item.date_created ? formatDate(data.item.date_created) : '-'}}
                </template>

                <template #cell(doc_close_datetime)="data">
                    {{ data.item.doc_close_datetime ? formatDate(data.item.doc_close_datetime) : '-' }}
                </template>

                <template #cell(type)="data">
                    {{ data.item.type ? data.item.type : '-' }}
                </template>

                <template #cell(provided_by)="data">
                    {{ data.item.provided_by ? data.item.provided_by.full_name : '-' }}
                </template>

                <template #cell(current_office)="data">
                    {{ data.item.current_office ? data.item.current_office.name : '-' }}
                </template>

                <template #cell(office)="data">
                    {{ data.item.office ? data.item.office.name : '-' }}
                </template>

                <template #cell(next_destination_office)="data">
                    {{ data.item.next_destination_office ? data.item.next_destination_office : '-' }}
                </template>

                <template #cell(places_amount)="data">
                    {{ data.item.places_amount ? data.item.places_amount : '-' }}
                </template>

                <template #cell(seal_number)="data">
                    {{ data.item.seal_number ? data.item.seal_number : '-' }}
                </template>

                <template #cell(note)="data">
                    {{ data.item.note ? data.item.note : '-' }}
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
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import downloadPdf from '../../../utils/downloadPdf';
import moment from "moment";

import {
    BRow,
    BCol,
    BCard,
    BTable,
    BButton,
    BBadge,
    BFormCheckbox,
    BPagination,
} from "bootstrap-vue";

import { RoleConstants } from '@/utils/role';
import store from "@/store/index";

export default {
    data() {
        return {
            fields: [
                { key: "id", label: "Номер документа" },
                { key: "date_created", label: "Дата" },
                { key: "doc_close_datetime", label: "Дата и время закрытия" },
                { key: "type", label: "Тип документа" },
                { key: "provided_by", label: "Оформил" },
                { key: "current_office", label: "Офис текущий" },
                { key: "office", label: "Офис откуда" },
                { key: "final_destination_office", label: "Офис куда" },
                { key: "places_amount", label: "Количество грузомест" },
                { key: "seal_number", label: "Пломбы" },
                { key: "note", label: "Примечание" },
                // { key: "sender_full_name", label: "Отправитель" },
                // { key: "sender_city.name", label: "Город отправителя" },
                // { key: "recipient_full_name", label: "Получатель" },
                // { key: "recipient_city.name", label: "Город получателя" },
                // { key: "payer_counterparty.name", label: "Плательщик" },
                // { key: "contract.contract", label: "Договор" },
            ],
            documentStatus: [],
        };
    },
    components: {
        BRow,
        BCol,
        BCard,
        BTable,
        BButton,
        BBadge,
        BFormCheckbox,
        BPagination,
    },
    computed: {
        ...mapGetters({
            loading: "moduleDocuments/getLoading",
            count: "moduleDocuments/getCount",
            perPage: "moduleDocuments/getCountPerPage",
            curPage: "moduleDocuments/getCurPage",
            documents: "moduleDocuments/getDocuments",

            // orderMode: "moduleDocuments/getOrderMode",
            clientType: "moduleClients/getClientType",
        }),
        showPagination() {
            return Math.ceil(this.count / this.perPage) > 1;
        },
        readOnly() {
            return store.state.app.user.role !== RoleConstants.AD && store.state.app.user.role !== RoleConstants.LG;
        },
		moment() {
			return moment;
		},
    },
    methods: {
        ...mapActions({
            fetchDocuments: "moduleDocuments/fetchDocuments",
            resetPagination: "moduleDocuments/resetPagination",
        }),
        ...mapMutations({
            changeCurPage: "moduleDocuments/changePage",
        }),
        getColorStatus(status) {
            return (
                this.documentStatus.find((x) => x.title === status)?.color || "secondary"
            );
        },
        formatDate(date) {
            return this.dayjs(date).format("DD.MM.YYYY");
        },
        changePage(page) {
            this.changeCurPage(page);
            this.fetchDocuments();
        },
        getClientType(clientType) {
            return this.clientType.find((type) => type.id === clientType)?.short_title;
        },
        handleExportCSVClick() {
			const documentIds = this.documents.map(item => item.id)
			downloadPdf(
				`http://45.9.43.181:8001/api/v1/stock_document/export_csv/?ids=${[documentIds]}`,
				`documents_${moment(Date.now()).format("YYYY-MM-DD")}`
			);
            // this.$api.documents.exportCSV([18])
            //     .then(response => console.log(response))
            //     .catch(error => console.log(error))
        }
    },
    mounted() {
        this.resetPagination();
        this.fetchDocuments();
    },
};
</script>

<style lang="scss" scoped>
    .whiteBtn {
        border-radius: 4px;
        border: 1px solid var(--light-border-underline-inverted-border-color-underline-inverted, #6D7986);
    }
</style>
