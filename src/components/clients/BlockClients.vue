<template>
  <div>
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <span
        >Найдено: <b>{{ count }}</b></span
      >
    </div>

    <b-card>
      <b-table :items="clients" :fields="fields" striped responsive>
        <template #cell(amo_client_id)="data">
          <router-link
            style="border-bottom: 1px dotted blue"
            :to="{ name: 'client', params: { id: data.item.id } }"
            >{{ data.item.amo_client_id }}</router-link
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

export default {
  data() {
    return {
      fields: [
        { key: "amo_client_id", label: "AMO ID" },
        { key: "name", label: "Название / ФИО" },
        { key: "type", label: "Тип" },
        { key: "address", label: "Адрес" },
        { key: "contacts", label: "Контакты" },
        { key: "position", label: "Должность" },
        { key: "bank_account", label: "Счет" },
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
      loading: "moduleClients/getLoading",
      clientType: "moduleClients/getClientType",
      count: "moduleClients/getCount",
      perPage: "moduleClients/getCountPerPage",
      curPage: "moduleClients/getCurPage",
      clients: "moduleClients/getClients",
    }),
    showPagination() {
      return Math.ceil(this.count / this.perPage) > 1;
    },
  },
  methods: {
    ...mapActions({
      fetchClients: "moduleClients/fetchClients",
    }),
    ...mapMutations({
      changeCurPage: "moduleClients/changePage",
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
  },
  mounted() {
    this.fetchClients();
  },
};
</script>
