<template>
    <div>
        <div class="mb-4 d-flex align-items-center justify-content-between">
        <span
            >Найдено: <b>{{ count }}</b></span
        >
        </div>

        <b-card>
        <b-table :items="senders" :fields="fields" striped responsive>
            <template #cell(id)="data">
                <router-link
                    style="border-bottom: 1px dotted blue"
                    :to="{ name: 'sender', params: { id: data.item.id } }"
                >
                    {{ data.item.id }}
                </router-link>
            </template>

            <template #cell(counterparty)="data">
                <router-link
                    v-if="data.item.counterparty"
                    style="border-bottom: 1px dotted blue"
                    :to="{ name: 'client', params: { id: data.item.counterparty.id } }"
                >
                    {{ data.item.counterparty.name }}
                </router-link>
            </template>

            <template #cell(passport)="data">
                <p>{{ data.item.passport_series }} {{ data.item.passport_no }}</p>
            </template>

            <template #cell(contacts)="data">
                <template v-if="data.item.sender_phones.length">
                    <p>Телефон:</p>
                    <p v-for="(phone, i) in data.item.sender_phones" :key="i">
                    <a :href="`tel:${phone.phone_number}`"
                        >{{ i + 1 }}. {{ phone.phone_number }}</a
                    >
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

export default {
    data() {
        return {
            fields: [
                { key: "id", label: "ID" },
                { key: "full_name", label: "Название / ФИО" },
                { key: "address", label: "Адрес" },
                { key: "contacts", label: "Контакты" },
                { key: "counterparty", label: "Контрагент" },
                { key: "passport", label: "Пасспортные данные" },
                { key: "city.name", label: "Город" },
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
            loading: "moduleSenders/getLoading",
            count: "moduleSenders/getCount",
            perPage: "moduleSenders/getCountPerPage",
            curPage: "moduleSenders/getCurPage",
            senders: "moduleSenders/getSenders",
        }),
        showPagination() {
            return Math.ceil(this.count / this.perPage) > 1;
        },
    },
    methods: {
        ...mapActions({
            fetchSenders: "moduleSenders/fetchSenders",
        }),
        ...mapMutations({
            changeCurPage: "moduleSenders/changePage",
        }),
        changePage(page) {
            this.changeCurPage(page);
            this.fetchSenders();
        },
    },
    mounted() {
        this.fetchSenders();
    },
};
</script>
