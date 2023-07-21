<template>
	<div style="padding-bottom: 20px;">
        <h1>Создать документ {{'Выдача на доставку'}} от {{'05.10.2022'}}</h1>
        <b-row class="row equal-cols">
            <b-col cols="8">
                <b-card>
                    <b-row style="margin-bottom: 24px;">
                        <b-col cols="6">
                            <b-form-input 
                                placeholder="Офис"
                                v-model="document.office"
                            />
                        </b-col>
                        <b-col cols="6">
                            <b-form-input 
                                placeholder="Номер пломбы"
                                v-model="document.number_seal"
                            />
                        </b-col>
                    </b-row>
                    <b-row align-v="center" style="margin-bottom: 24px;">
                        <b-col cols="6" align-v="center">
                            <b-form-checkbox
                                value="true"
                                :unchecked-value="null"
                                v-model="document.route_display"
                            >
                                Отображения маршрута
                            </b-form-checkbox>
                        </b-col>
                        <b-col cols="6">
                            <b-form-input 
                                placeholder="Номер пломбы"
                                v-model="document.number_seal"
                            />
                        </b-col>
                    </b-row>
                    <b-row align-v="center" style="margin-bottom: 24px;">
                        <b-col cols="6">
                            <b-form-input 
                                placeholder="Склад"
                                v-model="document.stock"
                            />
                        </b-col>
                        <b-col cols="6">
                            <b-form-datepicker
                                label="date"
                                placeholder="Дата заказа"
                                v-model="document.date"
                                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                                @input="changeOrder($event, 'date')"
                            />
                        </b-col>
                    </b-row>
                    <b-row align-v="center" style="margin-bottom: 24px;">
                        <b-col cols="6">
                            <select-clients
                                :disabled="false"
                                :disabledAddBtn="true"
                                :reduce="(counterparty) => counterparty"
                                :value="document.counterparty"
                                @input="handleFilterFieldChange($event, 'counterparty')"
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
                            <b-form-input 
                                placeholder="В офис"
                                v-model="document.in_office"
                            />
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
                        <b-col>
                            <b-form-input 
                                placeholder="Номера заказов"
                                v-model="document.number_order"
                            />
                        </b-col>
                    </b-row>
                    <b-row align-v="center" style="margin-bottom: 24px;">
                        <b-col>
                            <b-img :src="document.scan" class="mr-1" height="72" />
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
                            <!-- :to="{ name: 'order', params: { id: data.item.id } }" -->
                        <router-link
                            style="border-bottom: 1px dotted blue"
                        >
                            {{ data.item.id }}
                        </router-link
                        >
                        </template>

                        <template #cell(SK_GM)="data">
                            {{ data.item.SK_GM ? data.item.SK_GM : '-'}}
                        </template>

                        <template #cell(weight)="data">
                            {{ data.item.weight ? data.item.weight : '-' }}
                        </template>

                        <template #cell(date)="data">
                            {{ data.item.date ? formatDate(data.item.date) : '-' }}
                        </template>

                        <template #cell(sending_office)="data">
                            {{ data.item.sending_office ? data.item.sending_office : '-' }}
                        </template>

                        <template #cell(destination_office)="data">
                            {{ data.item.destination_office ? data.item.destination_office : '-' }}
                        </template>

                        <template #cell(problems)="data">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span>
                                    {{ data.item.problems ? data.item.problems : '-' }}
                                </span>
                                <b-icon-basket/>
                            </div>
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
            </b-col>
        </b-row>
        <b-row style="margin-bottom: 20px;">
            <b-col cols="12">
                <b-form-textarea
                    class="w-full ph-5"
                    v-model="document.note"
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
            >
                Отмена
            </b-button>
            <b-button 
                variant="primary"
                v-if="!readOnly" 
                :disabled="readOnly"
                style="margin-right: 15px;"
            >
                Создать
            </b-button>
        </b-row>
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
    BFormInput,
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

export default {
	data() {
		return {
            document: {
                office: null,
                number_seal: null,
                route_display: null,
                stock: null,
                date: null,
                counterparty: null,
                in_office: null,
                number_order: null,
                scan: null,
                note: null,
            },
            fields: [
                { key: "id", label: "Номер документа" },
                { key: "SK_GM", label: "ШК ГМ" },
                { key: "weight", label: "ФИЗ. ВЕС, КГ" },
                { key: "date", label: "Дата" },
                { key: "sending_office", label: "Офис-отправитель" },
                { key: "destination_office", label: "Офис-получатель" },
                { key: "problems", label: "Проблемы" },
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
		BFormDatepicker,
        SelectClients,
        BImg,
        BFormTextarea,
        BPagination,
        BIconBasket,
	},
	watch: {
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
            // fetchDocument: "moduleDocuments/fetchDocument",
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
	},
	mounted() {
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
