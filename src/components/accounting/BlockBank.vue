<template>
    <div class="block-bank">
        <b-modal v-model="showModal" :hide-footer="true">
            <h1 class="">Загрузка выписки из банка</h1>
            <h5>Выберите файл выписки для загрузки документов</h5>
            <div class="modal-btn-container">
                <b-form-file v-model="file" plain accept=".txt" v-bind:class="{notSelected: !checkFile}"></b-form-file>
                <b-button variant="primary" @click="createPaymentOrder">
                    Создать
                </b-button>
            </div>
        </b-modal>
        <div class="mb-4 d-flex align-items-center justify-content-between">
            <span >Найдено: <b>{{ count }}</b></span >
            <div>
                <b-button variant="primary" v-if="!readOnly" :disabled="readOnly" @click="showModal = !showModal">
                    Создать по выписке
                </b-button>
            </div>
            <div>
                <b-button variant="primary" :to="{ name: 'payment-order',  params: { type: 'I' } }" v-if="!readOnly" :disabled="readOnly">
                    Создать входящее поручение
                </b-button>
            </div>
            <div>
                <b-button variant="primary" :to="{ name: 'payment-order',  params: { type: 'O' }  }" v-if="!readOnly" :disabled="readOnly">
                    Создать исходящее поручение
                </b-button
                >
            </div>
        </div>
        <b-card>
            <b-table
                :items="resultBankList"
                :fields="fields"
                striped
                responsive
                :tbody-tr-class="rowClass"
                @row-clicked="(item) => $set(item, '_showDetails', !item._showDetails)"
            >
                <template #cell(show_details)="data">
                    <b-form-checkbox v-if="!data.item.count" plain class="vs-checkbox-con">
                    <span class="vs-checkbox">
                        <span class="vs-checkbox--check">
                        <i class="vs-icon feather icon-check" />
                        </span>
                    </span>
                    </b-form-checkbox>
                </template>
        
                <template #cell(number)="data">
                    <router-link
                        style="border-bottom: 1px dotted blue"
                        :to="{ name: 'payment-order', params: { type: getType(data.item.type), id: data.item.id }  }"
                    >
                        {{ data.item.number}}
                    </router-link>
                </template>
        
                <template #cell(location)="data">
                    {{ data.item.location || "Не определено" }}
                </template>

                <template #cell(counterparty)="data">
                    <div style="max-width: 320px;">
                        <p style="white-space: pre-line;">{{ data.item.counterparty }}</p>
                        <p v-if="data.item.count" class="small-text">по {{count}} документам</p>
                    </div>
                    
                </template>

                <template #cell(income)="data">
                    <span 
                        v-if="!data.item.count"
                        v-bind:class="
                            {
                                income: data.item.type !== 'Исходящее платежное поручение', 
                                nothing: data.item.type === 'Исходящее платежное поручение'
                            }" 
                    >
                        {{ data.item.type !== 'Исходящее платежное поручение' ? data.item.sum : "-" }}
                    </span>
                    <span v-if="data.item.count">
                        {{ total_income }}
                    </span>
                </template>

                <template #cell(write_offs)="data">
                    <span  
                        v-if="!data.item.count"
                        v-bind:class="
                            {
                                write_offs: data.item.type === 'Исходящее платежное поручение', 
                                nothing: data.item.type !== 'Исходящее платежное поручение'
                            }" 
                    >
                        {{ data.item.type === 'Исходящее платежное поручение' ? data.item.sum : "-" }}
                    </span>
                    <span v-if="data.item.count">
                        {{ total_outcome }}
                    </span>
                </template>
        
                <template #cell(date_created)="data">
                    {{ data.item.date_created ? formatDate(data.item.date_created) : null }}
                </template>
        
                <template #cell(financial_transaction)="data">
                    <p class="document">{{ data.item.financial_transaction }}</p>
                    <!-- <p class="document-info">{{ data.item.financial_transaction }}</p> -->
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
        BModal,
        BFormFile,
        BBadge,
        BFormCheckbox,
        BPagination,
    } from "bootstrap-vue";

    import { RoleConstants } from '@/utils/role';
    import store from "@/store/index";
    import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

    export default {
        data() {
            return {
                fields: [
                    { key: "show_details", label: "" },
                    { key: "number", label: "Номер" },
                    { key: "date_created", label: "Дата" },
                    { key: "financial_transaction", label: "Документ" },
                    { key: "counterparty", label: "Контрагент" },
                    { key: "income", label: "Поступления, ₽" },
                    { key: "write_offs", label: "Списания, ₽" },
                    { key: "comment", label: "Комментарий" },
                ],
                showModal: false,
                file: null,
                checkFile: true,
            };
        },
        components: {
            BRow,
            BCol,
            BCard,
            BTable,
            BButton,
            BModal,
            BFormFile,
            BBadge,
            BFormCheckbox,
            BPagination,
        },
        computed: {
            ...mapGetters({
                loading: "moduleAccountingBank/getLoading",
                count: "moduleAccountingBank/getCount",
                total_income: "moduleAccountingBank/getTotalIncome",
                total_outcome: "moduleAccountingBank/getTotalOutcome",
                perPage: "moduleAccountingBank/getCountPerPage",
                curPage: "moduleAccountingBank/getCurPage",
                paymentOrders: "moduleAccountingBank/getPaymentOrders",
            }),
            showPagination() {
                return Math.ceil(this.count / this.perPage) > 1;
            },
            readOnly() {
                return store.state.app.user.role !== RoleConstants.AD && store.state.app.user.role !== RoleConstants.LG;
            },
            resultBankList() {
                const result = this.paymentOrders.concat(
                    {
                        show_details: null,
                        id: null,
                        date_created: null,
                        document: null,
                        document_info:null,
                        counterparty: 'ИТОГО',
                        income: 0,
                        write_offs: 0,
                        comment: null,
                        count: 1,
                    });
                    console.log('res', result)
                return result
            },
        },
        watch: {
        },
        methods: {
            ...mapActions({
                fetchPaymentOrders: "moduleAccountingBank/fetchPaymentOrders",
                resetPagination: "moduleAccountingBank/resetPagination",
            }),
            ...mapMutations({
                changeCurPage: "moduleAccountingBank/changePage",
            }),
            getType(type) {
                return type ? (type.includes('Исходящее') ? 'O' : 'I') : 'O'
            },
            getColorStatus(status) {
                return (
                this.orderStatus.find((x) => x.title === status)?.color || "secondary"
                );
            },
            formatDate(date) {
                    return this.dayjs(date).format("DD.MM.YYYY");
            },
            changePage(page) {
                this.changeCurPage(page);
                this.fetchPaymentOrders();
            },
            getClientType(clientType) {
                return this.clientType.find((type) => type.id === clientType)
                ?.short_title;
            },
            rowClass(item, type) {
                if (!item || type !== 'row') return
                if (item.counterparty === 'ИТОГО') return 'end-row-style'
            },
            createPaymentOrder() {
                if (!this.file) {
                    this.checkFile = false;
                    return;
                };
                const formData = new FormData();
                formData.append('file', this.file, this.file.name);
                this.showModal = false;
                this.checkFile = true;
                this.$api.bank.createPaymentOrderFile(formData)
                    .then((response) => {
                        if (response.status === 200) {
                            this.$toast({
                                component: ToastificationContent,
                                props: {
                                    title: "Form Submitted",
                                    icon: "EditIcon",
                                    variant: "success",
                                },
                            });
                            this.changePage(1);
                            return;
                        } else {
                            this.$toast({
                                component: ToastificationContent,
                                props: {
                                    title: response.data.detail,
                                    icon: "EditIcon",
                                    variant: "danger",
                                },
                            });
                        }
                    })
                    .catch((error) => {
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: error.message,
                                icon: "EditIcon",
                                variant: "danger",
                            },
                        });
                    });
                this.file = null;
            },
        },
        mounted() {
            this.resetPagination();
            this.fetchPaymentOrders();
        },
    };
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

td {
    text-align: center;
}

tr { 
    white-space: nowrap;
}

p {
    margin: 0;
    padding: 0;
}

.income {
    color: #42AD00;
}

.write_offs {
    color: #E56262;
}

.nothing {
    font-size: 35px;
    color: #0B1F35;
}

.document {
    width: max-content;
}

.document-info {
    text-align: left;
    font-size: 10px;
    line-height: 14px;
    color: #8B8B8B;
}

.end-row-style, .end-row-style span{
    color: #0B1F35;
    font-weight: 700;
}

.small-text {
    font-weight: normal;
    font-size: 12px;
    color: #8B8B8B;
}

.modal-btn-container {
    margin-top: 20px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center;
}

.notSelected {
    color: red;
}

</style>
