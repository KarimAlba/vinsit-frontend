<template>
	<div style="padding-bottom: 20px;">
<<<<<<< HEAD:src/views/stock/Documents/Document.vue
        <h1>Создать документ {{title}} {{ nameDocument }} от {{idDocument ? dayjs(editDocument.date_created).format("DD.MM.YYYY") : dataNow}}</h1>
=======
        <h1>Создать документ {{ this.$route.params.title}} от {{'05.10.2022'}}</h1>
>>>>>>> 2af5abf67f51a9497da00220b297b023ebba08aa:src/views/stock/Documents/CreateDocument.vue
        <b-row class="row equal-cols">
            <b-col cols="8">
                <b-card>
                    <b-row style="margin-bottom: 24px;">
                        <b-col cols="6">
                            <b-form-group>
                                <select-offices
                                    :placeholder="'Текущий офис'"
                                    v-model="editDocument.current_office"
                                    :disabled="readOnly"
                                    :allOfices="offices"
                                />
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <b-form-input 
                                placeholder="Номер пломбы"
                                v-model="editDocument.seal_number"
                                type="number"
                            />
                        </b-col>
                    </b-row>
                    <b-row align-v="center" style="margin-bottom: 24px;">
                        <b-col cols="6" align-v="center">
                            <b-form-checkbox
                                value="true"
                                :unchecked-value="null"
                                v-model="editDocument.route_display"
                            >
                                Отображения маршрута
                            </b-form-checkbox>
                        </b-col>
                        <!-- <b-col cols="6">
                            <b-form-input 
                                placeholder="Номер пломбы"
                                v-model="editDocument.number_seal"
                            />
                        </b-col> -->
                    </b-row>
                    <b-row align-v="center" style="margin-bottom: 24px;">
                        <b-col cols="6">
                            <b-form-group>
                                <select-offices
                                    :placeholder="'Офис назначения груза'"
                                    v-model="editDocument.final_destination_office	"
                                    :disabled="readOnly"
                                    :allOfices="offices"
                                />
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <b-form-datepicker
                                label="date"
                                placeholder="Дата заказа"
                                v-model="editDocument.doc_close_datetime"
                                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                            />
                        </b-col>
                    </b-row>
                    <b-row align-v="center" style="margin-bottom: 24px;">
                        <b-col cols="6">
                            <select-users
                                :disabled="false"
                                :disabledAddBtn="true"
                                :reduce="(counterparty) => counterparty.id"
                                v-model="editDocument.provided_by"
                                placeholder="Оформил"
                                :clearable="false"
                            />
                        </b-col>
                        <b-col cols="6">
                           <b-row align-v="center" justify-content-center>
                                <b-icon-x-circle class="ml-2 mr-1"/>
                                <span>Нет данных для отображения</span>
                           </b-row>
                        </b-col>
                    </b-row>
                    <b-row align-v="center" style="margin-bottom: 24px;">
                        <b-col cols="6">
                            <b-form-group>
                                <select-offices
                                    :placeholder="'Офис следующего назначения груза'"
                                    v-model="editDocument.next_destination_office"
                                    :disabled="readOnly"
                                    :allOfices="offices"
                                />
                            </b-form-group>
                        </b-col>
                        <!-- <b-col cols="6">
                        </b-col> -->
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
                                :disabled="readOnly"
                                class="whiteBtn"
                            >
                                Экспорт в CSV
                            </b-button>
                        </div>
                    </div>
                    <b-table
                        :items="orders"
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
                                <b-icon-basket/>
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
import SelectOrders from "@/components/ui/selectOrder/selectOrder.vue";
import SelectUsers from "@/components/ui/selectUsers/selectUsers.vue";

export default {
	data() {
		return {
            offices: null,
            selectOrder: null,
            documentTemplate: {
                next_destination_office: 0,
                seal_number: null,
                // route_display: null,
                // stock: null,
                current_office: null,
                doc_close_datetime: null,
                provided_by: null,
                final_destination_office: 0,
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
            if (this.idDocument) {
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
        idDocument() {
            return this.$route.params.id || null;
        },
        nameDocument() {
            if (this.$route.params.type === "PR") return "Первичный приход"
            if (this.$route.params.type === "CN") return "Консолидация"
            if (this.$route.params.type === "DE") return "Выдача на доставку"
            if (this.$route.params.type === "AC") return "Расконсолидация"
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
            // createDocument: "moduleDocuments/createDocument",
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
            this.createDocument(this.editDocument)
        },
        createDocument(newDocument) {
            console.log('doc', newDocument)
            newDocument.type = this.$route.params.type;
            this.$api.documents.createDocument(newDocument).then((response) => {
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
                this.editDocument.orders.push(id);
                this.orders = [...this.orders, response.data]
            });
        },
        fetchOffices() {
            this.$api.office.getOffices({ limit: 100 }).then((response) => {
                this.offices = response.data;
                loading ? loading(false) : null;
            });
        }, 
	},
	mounted() {
        this.fetchOffices();
        if (this.idDocument) {
            this.fetchDocument(this.idDocument);
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
