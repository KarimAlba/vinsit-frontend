<template>
    <div class="block-routes-sheet">
        <b-card title="Добавление заказов">
            <b-row>
                <b-col cols="5">
                    <b-form-group>
                        <select-orders
                            :placeholder="'Номера заказов'"
                            v-model="selectOrder"
                            @input="handleAddOrder($event)"
                        />
                    </b-form-group>
                </b-col>
                <div>
                    <b-button variant="primary" :disabled="!selectOrder">
                        Добавить заказ
                    </b-button>
                </div>
            </b-row>
        </b-card>
        <b-card>
            <b-table
                :items="tasks"
                :fields="fields"
                striped
                responsive
                @row-clicked="(item) => $set(item, '_showDetails', !item._showDetails)"
            >
                <template #cell(order)="data">
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
                </template>
                <template #cell(id)="data">
                    <span
                        style="color: blue; text-decoration: underline; cursor: pointer;"
                    >
                        {{ data.item.id }}
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
                { key: "order", label: ""},
                { key: "id", label: "Номер" },
                { key: "city", label: "Город" },
                { key: "time", label: "Время доставки" },
                { key: "client", label: "Клиент" },
                { key: "status", label: "Статус" },
                { key: "type", label: "Тип" },
                { key: "macrozone", label: "Макрозона" },
                { key: "weight", label: "Действия" },
                { key: "dimensions", label: "Габариты" },
                { key: "summ", label: "сумма" },
                { key: "comment", label: "Примечание" },
            ],
            tasks: [
                {
                    id: 1,
                    city: "City",
                    time: null,
                    client: "Alena",
                    status: "ok",
                    type: null,
                    macrozone: null,
                    weight: '1,34',
                    dimensions: null,
                    summ: 0,
                    comment: "comment"
                },
                {
                    id: 2,
                    city: "City",
                    time: null,
                    client: "Alena",
                    status: "ok",
                    type: null,
                    macrozone: null,
                    weight: '1,34',
                    dimensions: null,
                    summ: 0,
                    comment: "comment"
                },
                {
                    id: 3,
                    city: "City",
                    time: null,
                    client: "Alena",
                    status: "ok",
                    type: null,
                    macrozone: null,
                    weight: '1,34',
                    dimensions: null,
                    summ: 0,
                    comment: "comment"
                },
                {
                    id: 4,
                    city: "City",
                    time: null,
                    client: "Alena",
                    status: "ok",
                    type: null,
                    macrozone: null,
                    weight: '1,34',
                    dimensions: null,
                    summ: 0,
                    comment: "comment"
                }
            ],
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
            loading: "moduleCouriers/getLoading",
            count: "moduleCouriers/getCount",
            perPage: "moduleCouriers/getCountPerPage",
            curPage: "moduleCouriers/getCurPage",
            maps: "moduleCouriers/getMaps",
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
            fetchCourierMaps: "moduleCouriers/fetchMaps",
            resetPagination: "moduleCouriers/resetPagination",
        }),
        ...mapMutations({
            changeCurPage: "moduleCouriers/changePage",
        }),
        handleAddOrder() {

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
        this.resetPagination();
    },
};
</script>

<style lang="scss" scoped>
    .whiteBtn {
        border-radius: 4px;
        border: 1px solid var(--light-border-underline-inverted-border-color-underline-inverted, #6D7986);
    }
</style>
