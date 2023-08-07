<template>
    <div>
        <div class="mb-4 d-flex align-items-center justify-content-between">
        <span
            >Найдено: <b>{{ count }}</b></span
        >

        <div>
            <b-button variant="primary" :to="{ name: 'client-create' }" v-if="!readOnly" :disabled="readOnly">
                Создать
            </b-button
            >
        </div>
        </div>

        <b-card>
        <b-table 
            :items="clients" 
            :fields="fields" 
            striped responsive
            
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :no-local-sorting="true"
        >
            <template #cell(amo_client_id)="data">
            <router-link
                style="border-bottom: 1px dotted blue"
                :to="{ name: 'client', params: { id: data.item.id } }"
            >
                {{ data.item.amo_client_id }}
            </router-link>
            </template>

            <template #cell(id)="data">
            <router-link
                style="border-bottom: 1px dotted blue"
                :to="{ name: 'client', params: { id: data.item.id } }"
                >{{ data.item.id }}</router-link
            >
            </template>

            <template #cell(type)="data">
            {{ getClientType(data.item.type) }}
            </template>

            <template #cell(contacts)="data">
            <template v-if="data.item.client_phones.length">
                <p>Телефон:</p>
                <p v-for="(phone, i) in data.item.client_phones" :key="i">
                <a :href="`tel:${phone.phone_number}`"
                    >{{ i + 1 }}. {{ phone.phone_number }}</a
                >
                </p>
            </template>
            <template v-if="data.item.email">
                <p>
                Email:
                <a :href="`mailto:${data.item.email}`">{{ data.item.email }}</a>
                </p>
            </template>
            <template v-if="data.item.web">
                <p>
                Сайт:
                <a
                    v-if="isValidHttpUrl(data.item.web)"
                    :href="data.item.web"
                    target="_blank"
                    >{{ data.item.web }}</a
                >
                <span v-else>{{ data.item.web }}</span>
                </p>
            </template>
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

import { BRow, BCol, BCard, BTable, BButton, BPagination } from "bootstrap-vue";

import { RoleConstants } from '@/utils/role';
import store from "@/store/index";

export default {
    data() {
        return {
            fields: [
                { key: "amo_client_id", label: "AMO ID", sortable: true  },
                { key: "id", label: "ID", sortable: true  },
                { key: "name", label: "Название / ФИО", sortable: true  },
                { key: "type", label: "Тип", sortable: true  },
                { key: "address", label: "Адрес", sortable: false  },
                { key: "contacts", label: "Контакты", sortable: false  },
                { key: "position", label: "Должность", sortable: false  },
                { key: "bank_account", label: "Счет", sortable: false  },
            ],
            sortBy: 'date_created',
            sortDesc: false,
        };
    },
    components: {
        BRow,
        BCol,
        BCard,
        BTable,
        BButton,
        BPagination,
    },
    watch: {
        'sortBy'(newValue) {
            if (!newValue) return;
            this.sortTable();
        },
        'sortDesc'(newValue) {
            // console.log('newValue - ', newValue);
            this.sortTable();
        }
    },
    computed: {
        ...mapGetters({
            loading: "moduleClients/getLoading",
            clientType: "moduleClients/getClientType",
            count: "moduleClients/getCount",
            perPage: "moduleClients/getCountPerPage",
            curPage: "moduleClients/getCurPage",
            clients: "moduleClients/getClients",

            total_income: "moduleAccountingBank/getTotalIncome",
            total_outcome: "moduleAccountingBank/getTotalOutcome",
            perPage: "moduleAccountingBank/getCountPerPage",
            curPage: "moduleAccountingBank/getCurPage",
            paymentClient: "moduleAccountingBank/getPaymentClients",
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
            fetchClients: "moduleClients/fetchClients",
            resetPagination: "moduleClients/resetPagination",
        }),
        ...mapMutations({
            changeCurPage: "moduleClients/changePage",
            changeOrdering: "moduleClients/changeOrdering",
        }),
        changePage(page) {
            this.changeCurPage(page);
            this.fetchClients();
        },
        getClientType(type) {
            return this.clientType.find((x) => x.id === type)?.title || "Не указан";
        },
        isValidHttpUrl(string) {
            var pattern = new RegExp(
                "^(https?:\\/\\/)?" + // protocol
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
                "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                "(\\#[-a-z\\d_]*)?$",
                "i"
        );
        return !!pattern.test(string);
        },
        checkSortName() {
            switch(this.sortBy) {
                case 'id':
                    return 'id'
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
            };

            this.resetPagination();
            setTimeout(() => {
                this.fetchClients();
            }, 0);
        },
    },
    mounted() {
        this.fetchClients();
    },
};
</script>
