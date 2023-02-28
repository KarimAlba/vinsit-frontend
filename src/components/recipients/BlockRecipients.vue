<template>
  <div>
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <span
        >Найдено: <b>{{ count }}</b></span
      >
    </div>

    <b-card>
      <b-table :items="recipients" :fields="fields" striped responsive>
        <template #cell(id)="data">
          <router-link
            style="border-bottom: 1px dotted blue"
            :to="{ name: 'recipient', params: { id: data.item.id } }"
            >{{ data.item.id }}</router-link
          >
        </template>

        <template #cell(counterparty)="data">
          <router-link
            v-if="data.item.counterparty"
            style="border-bottom: 1px dotted blue"
            :to="{ name: 'client', params: { id: data.item.counterparty.id } }"
            >{{ data.item.counterparty.name }}</router-link
          >
        </template>

        <template #cell(passport)="data">
          <p>{{ data.item.passport_series }} {{ data.item.passport_no }}</p>
        </template>

        <template #cell(contacts)="data">
          <template v-if="data.item.recipient_phones.length">
            <p>Телефон:</p>
            <p v-for="(phone, i) in data.item.recipient_phones" :key="i">
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
      loading: "moduleRecipients/getLoading",
      clientType: "moduleRecipients/getClientType",
      count: "moduleRecipients/getCount",
      perPage: "moduleRecipients/getCountPerPage",
      curPage: "moduleRecipients/getCurPage",
      recipients: "moduleRecipients/getRecipients",
    }),
    showPagination() {
      return Math.ceil(this.count / this.perPage) > 1;
    },
  },
  methods: {
    ...mapActions({
      fetchRecipients: "moduleRecipients/fetchRecipients",
    }),
    ...mapMutations({
      changeCurPage: "moduleRecipients/changePage",
    }),
    changePage(page) {
      this.changeCurPage(page);
      this.fetchRecipients();
    },
  },
  mounted() {
    this.fetchRecipients();
  },
};
</script>
