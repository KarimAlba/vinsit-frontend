<template>
    <div class="block-routes-sheet">
        <b-card title="Добавление заказов">
            <b-row>
                <b-col cols="5">
                    <b-form-group>
                        <select-orders
                            :placeholder="'Номера заказов'"
                            v-model="selectOrder"
                        />
                    </b-form-group>
                </b-col>
                <div>
                    <b-button  
                        variant="primary" 
                        :disabled="!selectOrder"
                        @click="handleAddOrder"
                    >
                        Добавить заказ
                    </b-button>
                </div>
            </b-row>
        </b-card>
        <b-card>
            <b-table
                :items="mapOrders"
                :fields="fields"
                striped
                responsive
                @row-clicked="(item) => $set(item, '_showDetails', !item._showDetails)"
            >
                <!-- <template #cell(order)="data">
                    <div>
                        <feather-icon
                            icon="ChevronUpIcon" 
                            @click="handleClickUp(data.item.id)"
                            v-b-modal.modal-create-map 
                        />
                        <feather-icon
                            icon="ChevronDownIcon"
                            @click="handleClickDown(data.item.id)"
                            v-b-modal.modal-delete-map 
                        />
                    </div>
                </template> -->
                <template #cell(id)="data">
                    <span
                    >
                        {{ data.item.id }}
                    </span
                    >
                </template>

                <template #cell(recipient_city)="data">
                    <span
                    >
                        {{ data.item.recipient_city.name }}
                    </span
                    >
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
    BIcon,
    BIconChevronDown,
    BIconChevronUp,
	BFormInput,
	BFormGroup,
    BFormCheckbox,
    BPagination,
	BFormDatepicker
} from "bootstrap-vue";

import { RoleConstants } from '@/utils/role';
import store from "@/store/index";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import SelectOrders from "@/components/ui/selectOrder/selectOrder.vue";

export default {
    data() {
        return {
            fields: [
                { key: "id", label: "Номер" },
                { key: "recipient_city", label: "Город" },
                { key: "delivery_date", label: "Время доставки" },
                { key: "recipient_full_name", label: "Клиент" },
                { key: "status", label: "Статус" },
                { key: "type", label: "Тип" },
                { key: "macrozone", label: "Макрозона" },
                { key: "weight", label: "Действия" },
                { key: "dimensions", label: "Габариты" },
                { key: "total_price", label: "сумма" },
                { key: "comment", label: "Примечание" },
            ],
            tasks: [],
            selectOrder: null,
        };
    },
    components: {
        BRow,
        BCol,
        BCard,
        BTable,
        BButton,
        BBadge,
        BIcon,
        BIconChevronDown,
        BIconChevronUp,
		BFormInput,
		BFormGroup,
        BFormCheckbox,
        BPagination,
		BFormDatepicker,

        SelectOrders,
    },
    computed: {
        ...mapGetters({
            loading: "moduleRoutesSheet/getLoading",
            count: "moduleRoutesSheet/getCount",
            perPage: "moduleRoutesSheet/getCountPerPage",
            curPage: "moduleRoutesSheet/getCurPage",
            mapOrders: "moduleRoutesSheet/getMapOrders",
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
            fetchCourierMap: "moduleRoutesSheet/fetchMap",
            resetPagination: "moduleRoutesSheet/resetPagination",
        }),
        ...mapMutations({
            changeCurPage: "moduleRoutesSheet/changePage",
            setMapOrders: "moduleRoutesSheet/setMapOrders",
        }),
        handleAddOrder() {
            this.$api.couriers.editCourierMap(this.$route.params.idMap, {orders: [this.selectOrder, ...this.mapOrders.map(it => it.id)]}).then(response => {
                if (response.status <= 203) {
                    this.fetchCourierMap(this.$route.params.idMap);
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: "Успешно",
                            text: "Заказ добавлен",
                            icon: "CheckCircleIcon",
                            variant: "success",
                        },
                    });
                } else {
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: "Ошибка",
                            text: "Не удалось добавить заказ",
                            icon: "XIcon",
                            variant: "danger",
                        },
                    });
                }
                this.selectOrder = null;
            })
        },
        formatDate(date) {
            return this.dayjs(date).format("DD.MM.YYYY");
        },
        changePage(page) {
            this.changeCurPage(page);
            this.fetchDocuments();
        },
        handleClickUp(id) {
            const index = this.tasks.findIndex(it => it.id === id);
            if (index == 0) return;
            [this.tasks[index], this.tasks[index - 1]] = [this.tasks[index - 1], this.tasks[index]]
            this.tasks = [...this.tasks];
        },
        handleClickDown(id) {
            const index = this.tasks.findIndex(it => it.id === id);
            if (index == this.tasks.length - 1) return;
            [this.tasks[index], this.tasks[index + 1]] = [this.tasks[index + 1], this.tasks[index]]
            this.tasks = [...this.tasks];
        },

    },
    mounted() {
        if (this.$route.params.idMap) {
            this.fetchCourierMap(this.$route.params.idMap);
        } else {
            this.setMapOrders([]);
        }
    },
};
</script>

<style lang="scss" scoped>
    .whiteBtn {
        border-radius: 4px;
        border: 1px solid var(--light-border-underline-inverted-border-color-underline-inverted, #6D7986);
    }
</style>
