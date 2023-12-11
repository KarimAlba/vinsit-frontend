<template>
	<div style="padding-bottom: 20px;">
        <h1>Создать документ {{ nameDocument }} от {{documentId ? dayjs(editDocument.date_created).format("DD.MM.YYYY") : dataNow}}</h1>
        <b-row class="row equal-cols">
            <b-col cols="8">
                <b-card>
                    <b-row align-v="center">
                        <b-col cols="6" align-v="center" style="margin-bottom: 24px;">
                            <v-select
                                v-model="editDocument.product_type"
                                :options="productTypes"
                                :clearable="false"
                                placeholder="Тип доставки"
                            >
                            </v-select>
                        </b-col>
                        <b-col cols="6" align-v="center" style="margin-bottom: 24px;" v-if="this.$route.params.type === 'DC'">
                            <select-users
                                :reduce="(counterparty) => counterparty.id"
                                v-model="editDocument.client"
                                :disabled="false"
                                :disabledAddBtn="true"
                                :clearSearchOnBlur="false"
                                placeholder="Выдача клиенту"
                            />
                        </b-col>
                        <b-col cols="6" align-v="center" style="margin-bottom: 24px;" v-else>
                            <select-seals
                                :placeholder="'Номер пломбы'"
                                v-model="editDocument.seals"
                                :disabled="readOnly"
                            />
                        </b-col>
                        <b-col cols="6" align-v="center" style="margin-bottom: 24px;">
                            <select-offices
                                :placeholder="'Текущий офис'"
                                v-model="editDocument.current_office"
                                :disabled="readOnly"
                                :allOfices="offices"
                            />
                        </b-col>
                        <b-col cols="6" align-v="center" style="margin-bottom: 24px;" v-if="this.$route.params.type !== 'DC'">
                            <b-form-datepicker
                                label="date"
                                placeholder="Дата заказа"
                                v-model="editDocument.doc_close_datetime"
                                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                            />
                        </b-col>
                        <b-col cols="6" align-v="center" style="margin-bottom: 24px;" v-if="this.$route.params.type === 'AC'">
                            <select-offices
                                :placeholder="'Склад отправки'"
                                v-model="editDocument.final_destination_office"
                                :disabled="readOnly"
                                :allOfices="offices"
                            />
                        </b-col>
                        <b-col cols="12" align-v="center">
                            <b-row>
                                <b-col cols="6" align-v="center" style="margin-bottom: 24px;" v-if="editDocument.product_type !== 'Логистика' && this.$route.params.type !== 'DC'">
                                    <select-users
                                        :reduce="(counterparty) => counterparty.id"
                                        v-model="editDocument.provided_by"
                                        :disabled="false"
                                        :disabledAddBtn="true"
                                        :clearSearchOnBlur="false"
                                        :product_type="editDocument.product_type"
                                        placeholder="Оформил"
                                    />
                                </b-col>
                                <b-col cols="6" align-v="center" style="margin-bottom: 24px;" v-if="editDocument.product_type === 'Логистика' || this.$route.params.type === 'DC'">
                                    <label>Выберите тип</label>
                                    <v-select
                                        v-model="editDocument.clientType"
                                        :options="clientTypes"
                                        :clearable="false"
                                        placeholder="Оформил"
                                    >
                                    </v-select>
                                </b-col>
                                <b-col cols="6" align-v="center" style="margin-bottom: 24px;" v-if="editDocument.clientType && (editDocument.product_type === 'Логистика' || this.$route.params.type === 'DC')">
                                    <!-- <div v-if="editDocument.clientType === 'Клиент'">
                                        <label style="opacity: 0">1</label>
                                        <b-form-input
                                            v-model="editDocument.issued_by_client"
                                            type="text"
                                        ></b-form-input>
                                    </div>
                                    <div v-if="editDocument.clientType === 'Сотрудник'">
                                        <label style="opacity: 0">1</label>
                                        <b-form-input
                                            v-model="editDocument.issued_by"
                                            type="text"
                                        ></b-form-input>
                                    </div> -->
                                    <div v-if="editDocument.clientType === 'Клиент'">
                                        <label style="opacity: 0">1</label>
                                        <select-clients
                                            :reduce="(client) => client.id"
                                            v-model="editDocument.issued_by_client"
                                            :disabledAddBtn="true"
                                        />
                                    </div>
                                    <div v-if="editDocument.clientType === 'Сотрудник'">
                                        <label style="opacity: 0">1</label>
                                        <select-users
                                            :reduce="(counterparty) => counterparty.id"
                                            v-model="editDocument.issued_by"
                                            :disabled="false"
                                            :disabledAddBtn="true"
                                            :clearSearchOnBlur="false"
                                            :product_type="editDocument.product_type"
                                        />
                                    </div>
                                </b-col>
                            </b-row>
                        </b-col>
                        <b-col cols="6" align-v="center" style="margin-bottom: 24px;" v-if="this.$route.params.type === 'DE'">
                           <b-form-checkbox
                                v-model="editDocument.client"
                                placeholder="Клиент"
                            >
                                Клиент
                            </b-form-checkbox>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
            <b-col cols="4">
                <b-card>
                    <b-row align-v="center" style="margin-bottom: 24px;">
                        <b-col>
                            <span>Сканирование</span>
                        </b-col>
                    </b-row>
                    <b-row align-v="center" style="margin-bottom: 24px;">
                        <b-col cols="12">
                            <b-form-group>
                                <select-orders
                                    :placeholder="'Номера заказов'"
                                    :value="selectOrder"
                                    :disabled="readOnly"
                                    @input="handleAddOrder($event)"
                                />
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row align-v="center" style="margin-bottom: 24px;">
                        <b-col>
                            <b-img :src="editDocument.scan" class="mr-1" height="72" />
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>
		<b-row>
            <b-col>
                <b-card>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h4>Заказы в документе</h4>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <b-button 
                                variant="white" 
                                v-if="!readOnly" 
                                :disabled="readOnly"
                                class="whiteBtn"
                                style="margin-right: 10px;"
                            >
                                Обновить
                            </b-button>
                            <b-button 
                                variant="white"
                                v-if="!readOnly" 
                                :disabled="true"
                                class="whiteBtn"
                            >
                                Экспорт в CSV
                            </b-button>
                        </div>
                    </div>
                    <b-table
                        :items="editDocument.orders"
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
                                {{ data.item.id}}
                            </router-link
                            >
                        </template>

                        <template #cell(SK_GM)="data">
                            {{ data.item.SK_GM ? data.item.SK_GM : '-'}}
                        </template>

                        <template #cell(total_weight)="data">
                            {{ data.item.total_weight ? data.item.total_weight : '-' }}
                        </template>

                        <template #cell(date_created)="data">
                            {{ data.item.date_created ? formatDate(data.item.date_created) : '-' }}
                        </template>

                        <template #cell(sending_office)="data">
                            {{ data.item.sending_office ? data.item.sending_office : '-' }}
                        </template>

                        <template #cell(destination_office)="data">
                            {{ data.item.destination_office ? data.item.destination_office : '-' }}
                        </template>

                        <template #cell(problem)="data">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span>
                                    {{ data.item.problem ? data.item.problem : '-' }}
                                </span>
                                <b-icon-basket @click="deliteOrder(data.index)"/>
                            </div>
                        </template>
                    </b-table>
                    <b-pagination
                        v-if="showPagination"
                        :total-rows="count"
                        :per-page="perPage"
                        @change="changeCurPage"
                        :value="curPage"
                        align="right"
                    />
                </b-card>
            </b-col>
        </b-row>
        <b-row style="margin-bottom: 20px;">
            <b-col cols="12">
                <b-form-textarea
                    class="w-full ph-5"
                    v-model="editDocument.note"
                    placeholder="Примечание"
                />
            </b-col>
        </b-row>
        <b-row style="margin-bottom: 20px;" align-h="end">
            <b-button 
                variant="white"
                v-if="!readOnly" 
                :disabled="readOnly" 
                class="whiteBtn"
                style="margin-right: 10px;"
                :to="{name: 'stock-documents'}"
            >
                Отмена
            </b-button>
            <b-button 
                variant="primary"
                v-if="!readOnly" 
                :disabled="readOnly"
                style="margin-right: 15px;"
                @click="handleSave()"
            >
                Создать
            </b-button>
        </b-row>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import vSelect from "vue-select";

import {
    BRow,
    BCol,
    BCard,
    BTable,
    BButton,
    BBadge,
    BFormCheckbox,
    BFormInput,
    BFormGroup,
    BPagination,
    BFormDatepicker,
    BIconXCircle,
    BIconBasket,
    BImg,
    BFormTextarea,
} from "bootstrap-vue";

import { RoleConstants } from '@/utils/role';
import store from "@/store/index";
import AppDatepicker from "@/@core/components/app-datepicker/AppDatepicker";
import SelectClients from "@/components/ui/selectClients/selectClients.vue";
import SelectOffices from "@/components/ui/selectOffices/selectOffices.vue";
import SelectSeals from "@/components/ui/selectSeals/selectSeals.vue";
import SelectOrders from "@/components/ui/selectOrder/selectOrder.vue";
import SelectUsers from "@/components/ui/selectUsers/selectUsers.vue";

export default {
	data() {
		return {
            productTypes: ["Логистика", "Фулфилмент"],
            clientTypes: ["Клиент", "Сотрудник"],
            offices: null,
            selectOrder: null,
            documentTemplate: {
                // next_destination_office: 0,
                seal_number: null,
                // route_display: null,
                // stock: null,
                current_office: null,
                doc_close_datetime: null,
                provided_by: null,
                // final_destination_office: 0,
                orders: [],
                // scan: null,
                note: null,
                type: null,
            },
            fields: [
                { key: "id", label: "Номер документа" },
                { key: "SK_GM", label: "ШК ГМ" },
                { key: "total_weight", label: "ФИЗ. ВЕС, КГ" },
                { key: "date_created", label: "Дата" },
                { key: "sending_office", label: "Офис-отправитель" },
                { key: "destination_office", label: "Офис-получатель" },
                { key: "problem", label: "Проблемы" },
            ],
            orders: [],
		};
	},
	components: {
		BRow,
        BCol,
        BCard,
        BTable,
        BButton,
        BBadge,
        BIconXCircle,
        BFormCheckbox,
        BFormInput,
        BFormGroup,
		BFormDatepicker,
        SelectClients,
        SelectOffices,
        SelectSeals,
        SelectOrders,
        SelectUsers,
        BImg,
        BFormTextarea,
        BPagination,
        BIconBasket,
        vSelect,

	},
	watch: {
        'document'(nextValue) {
            if (this.documentId) {
                this.documentTemplate = nextValue;
            }
        },
	},
	computed: {
		...mapGetters({
            loading: "moduleDocuments/getLoading",
            count: "moduleDocuments/getCount",
            perPage: "moduleDocuments/getCountPerPage",
            curPage: "moduleDocuments/getCurPage",
            documents: "moduleDocuments/getDocuments",
            document: "moduleDocuments/getDocument",

            // orderMode: "moduleDocuments/getOrderMode",
            clientType: "moduleClients/getClientType",
        }),
        showPagination() {
            return Math.ceil(this.count / this.perPage) > 1;
        },
        readOnly() {
            return store.state.app.user.role !== RoleConstants.AD && store.state.app.user.role !== RoleConstants.LG;
        },
        documentId() {
            return this.$route.params.id || null;
        },
        nameDocument() {
            if (this.$route.params.type === "PR") return "Приход"
            if (this.$route.params.type === "CN") return "Консолидация"
            if (this.$route.params.type === "DE") return "Выдача на доставку"
            if (this.$route.params.type === "AC") return "Расконсолидация"
            if (this.$route.params.type === "DC") return "Выдача клиенту"
        },
        dataNow() {
            return this.dayjs(new Date).format("DD.MM.YYYY")
        },
        editDocument: {
            get() {
                return this.documentTemplate;
            },
            set(value) {
                this.documentTemplate = value;
            }
        },
	},
	methods: {
		...mapActions({
            fetchDocument: "moduleDocuments/fetchDocument",
            resetPagination: "moduleDocuments/resetPagination",
        }),
        ...mapMutations({
            changeCurPage: "moduleDocuments/changePage",
        }),
		formatDate(date) {
            return this.dayjs(date).format("DD.MM.YYYY");
        },
        getClientType(clientType) {
            return this.clientType.find((type) => type.id === clientType)?.short_title;
        },
        handleSave() {
            this.documentId 
                ? this.updateDocument()
                : this.createDocument(this.editDocument);
        },
        createDocument(newDocument) {
            const payload = {
                ...newDocument,
                is_fulfillment: this.editDocument.product_type === "Логистика" ? false : true,
                seals: [this.editDocument.seals],
                type:  this.$route.params.type,
                orders: newDocument.orders.map(it => it.id),
            }
            this.$api.documents.createDocument(payload).then((response) => {
                if (response.status !== 400) {
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                        title: "Успешно",
                        text: "Документ создан",
                        icon: "CheckCircleIcon",
                        variant: "success",
                        },
                    });
                    this.$router.push({
                        name: "stock-documents",
                    });
                } else {
                this.$toast({
                    component: ToastificationContent,
                    props: {
                    title: "Ошибка",
                    text: "Не удалось создать документ.",
                    icon: "XIcon",
                    variant: "danger",
                    },
                });
                }
            });
        },
        updateDocument() {
            const payload = {
                ...this.editDocument,
                is_fulfillment: this.editDocument.product_type === "Логистика" ? false : true,
                seals: [this.editDocument.seals],
                type:  this.$route.params.type,
                orders: this.editDocument.orders.map(it => it.id),
            }
            this.$api.documents.editDocument(this.documentId, payload).then((response) => {
                if (response.status !== 400) {
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                        title: "Успешно",
                        text: "Документ создан",
                        icon: "CheckCircleIcon",
                        variant: "success",
                        },
                    });
                    this.$router.push({
                        name: "stock-documents",
                    });
                } else {
                this.$toast({
                    component: ToastificationContent,
                    props: {
                    title: "Ошибка",
                    text: "Не удалось создать документ.",
                    icon: "XIcon",
                    variant: "danger",
                    },
                });
                }
            });
        },
        handleAddOrder(id) {
            this.$api.orders.getOrder(id).then((response) => {
                this.editDocument.orders.push(response.data);
            });
        },
        deliteOrder(index) {
            this.editDocument.orders = [...this.editDocument.orders.slice(0, index), ...this.editDocument.orders.slice(index + 1)];
        },
        fetchOffices() {
            this.$api.office.getOffices({ limit: 100 }).then((response) => {
                this.offices = response.data;
            });
        }, 
	},
	mounted() {
        this.fetchOffices();
        if (this.documentId) {
            this.fetchDocument(this.documentId);
        }
	},
};
</script>

<style lang="scss" scoped>
    .row.equal-cols {
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }

    .row.equal-cols:before, .row.equal-cols:after {
        display: block;
    }

    .row.equal-cols > [class*='col-'] {
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
    }

    .row.equal-cols > [class*='col-'] > * {
        -webkit-flex: 1 1 auto;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto; 
    }

    .whiteBtn {
        border-radius: 4px;
        border: 1px solid var(--light-border-underline-inverted-border-color-underline-inverted, #6D7986);
    }
</style>
