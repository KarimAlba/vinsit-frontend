<template>
    <div>
        <div class="mb-4 d-flex align-items-center justify-content-between">
        <span
            >Найдено: <b>{{ count }}</b></span
        >
        </div>

        <b-card>
        <b-table :items="payers" :fields="fields" striped responsive>
            <template #cell(id)="data">
            <router-link
                style="border-bottom: 1px dotted blue"
                :to="{ name: 'payer', params: { id: data.item.id } }"
                >{{ data.item.id }}</router-link
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
        ></b-pagination>
        </b-card>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

import { BRow, BCol, BCard, BTable, BButton, BPagination } from "bootstrap-vue";

export default {
    data() {
        return {
        fields: [
            { key: "id", label: "ID" },
            { key: "counterparty", label: "Контрагент" },
            { key: "city", label: "Город" },
        ],
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
    computed: {
        ...mapGetters({
            loading: "modulePayers/getLoading",
            clientType: "modulePayers/getClientType",
            count: "modulePayers/getCount",
            perPage: "modulePayers/getCountPerPage",
            curPage: "modulePayers/getCurPage",
            payers: "modulePayers/getPayers",
        }),
        showPagination() {
            return Math.ceil(this.count / this.perPage) > 1;
        },
    },
    methods: {
        ...mapActions({
            fetchPayers: "modulePayers/fetchPayers",
        }),
        ...mapMutations({
            changeCurPage: "modulePayers/changePage",
        }),
        changePage(page) {
            this.changeCurPage(page);
            this.fetchPayers();
        },
    },
    mounted() {
        this.fetchPayers();
    },
};
</script>
