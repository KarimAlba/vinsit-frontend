<template>
    <div class="block-documents">
        <div class="mb-4 d-flex align-items-center justify-content-end">
            <div class="d-flex align-items-center justify-content-right" style="margin-right: 18px;">
                <b-button 
                    variant="white" 
                    :to="{ name: 'create-stock-document' }" 
                    v-if="!readOnly" 
                    :disabled="readOnly"
                    class="whiteBtn"
                >
                    Экспорт в CSV
                </b-button>
            </div>
            <div class="d-flex align-items-center justify-content-right" style="margin-right: 18px;">
                <b-button variant="primary" :to="{ name: 'create-stock-document' }" v-if="!readOnly" :disabled="readOnly">
                    PR
                </b-button>
            </div>
            <div class="d-flex align-items-center justify-content-right" style="margin-right: 18px;">
                <b-button variant="primary" :to="{ name: 'create-stock-document' }" v-if="!readOnly" :disabled="readOnly">
                    CN
                </b-button>
            </div>
            <div class="d-flex align-items-center justify-content-right">
                <b-button variant="primary" :to="{ name: 'create-stock-document' }" v-if="!readOnly" :disabled="readOnly">
                    DE
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
                    :to="{ name: 'order', params: { id: data.item.id } }"
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

                <template #cell(issued_by)="data">
                    {{ data.item.issued_by ? data.item.issued_by : '-' }}
                </template>

                <template #cell(current_office)="data">
                    {{ data.item.current_office ? data.item.current_office : '-' }}
                </template>

                <template #cell(office)="data">
                    {{ data.item.office ? data.item.office : '-' }}
                </template>

                <template #cell(next_destination_office)="data">
                    {{ data.item.next_destination_office ? data.item.next_destination_office : '-' }}
                </template>

                <template #cell(places_amount)="data">
                    {{ data.item.places_amount ? data.item.places_amount : '-' }}
                </template>

                <template #cell(seal_numbers)="data">
                    {{ data.item.seal_numbers ? data.item.seal_numbers : '-' }}
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
                { key: "issued_by", label: "Оформил" },
                { key: "current_office", label: "Офис текущий" },
                { key: "office", label: "Офис откуда" },
                { key: "next_destination_office", label: "Офис куда" },
                { key: "places_amount", label: "Количество грузомест" },
                { key: "seal_numbers", label: "Пломбы" },
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
        }
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
