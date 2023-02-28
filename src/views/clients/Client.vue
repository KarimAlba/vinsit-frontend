<template>
  <section class="order pb-5">
    <b-overlay :show="loading" rounded="sm">
      <template v-if="message">
        <h1>{{ message }}</h1>
      </template>
      <template v-else>
        <h1 class="mb-2">Клиент №{{ client.amo_client_id }}</h1>
        <b-row>
          <b-col>
            <b-card>
              <b-card-title>Основная информация</b-card-title>

              <table class="w-100">
                <tr>
                  <td class="pb-1">AMO CRM</td>
                  <td class="pb-1">{{ client.amo_client_id }}</td>
                </tr>

                <tr>
                  <td class="pb-1">Название / ФИО</td>
                  <td class="pb-1">{{ client.name }}</td>
                </tr>

                <tr>
                  <td class="pb-1">Тип</td>
                  <td class="pb-1">{{ getClientType(client.type) }}</td>
                </tr>

                <tr>
                  <td class="pb-1">Адрес</td>
                  <td class="pb-1">{{ client.address }}</td>
                </tr>

                <tr>
                  <td class="pb-1">Position</td>
                  <td class="pb-1">{{ client.address }}</td>
                </tr>

                <tr>
                  <td class="pb-1">Счет</td>
                  <td class="pb-1">{{ client.bank_account }}</td>
                </tr>
              </table>
            </b-card>
          </b-col>
          <b-col>
            <b-card>
              <b-card-title>Контакты</b-card-title>

              <table class="w-100">
                <tr v-if="client.client_phones && client.client_phones.length">
                  <td class="pb-1">Номера телефонов</td>
                  <td class="pb-1">
                    <p v-for="(phone, i) in client.client_phones" :key="i">
                      <a :href="`tel:${phone.phone_number}`"
                        >{{ i + 1 }}. {{ phone.phone_number }}</a
                      >
                    </p>
                  </td>
                </tr>

                <tr v-if="client.email">
                  <td class="pb-1">Email</td>
                  <td class="pb-1">
                    <a :href="`mailto:${client.email}`">{{ client.email }}</a>
                  </td>
                </tr>

                <tr v-if="client.web">
                  <td class="pb-1">Сайт</td>
                  <td class="pb-1">
                    <a
                      v-if="isValidHttpUrl(client.web)"
                      :href="client.web"
                      target="_blank"
                      >{{ client.web }}</a
                    >
                    <span v-else>{{ client.web }}</span>
                  </td>
                </tr>
              </table>
            </b-card>
          </b-col>
        </b-row>

        <b-button v-b-modal.modal-delete variant="danger">Удалить</b-button>

        <b-modal
          id="modal-delete"
          title="Удалить?"
          @ok="deleteClient"
          ok-title="Удалить"
          ok-variant="danger"
          header-bg-variant="danger"
          cancel-title="Отмена"
          size="sm"
        >
          <p>Удалить клиента?</p>
        </b-modal>
      </template>
    </b-overlay>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import {
  BRow,
  BCol,
  BOverlay,
  BCard,
  BCardTitle,
  BTable,
  BButton,
} from "bootstrap-vue";

export default {
  components: {
    BRow,
    BCol,
    BOverlay,

    BCard,
    BCardTitle,
    BTable,
    BButton,
  },
  data() {
    return {
      client: {},
      message: null,
    };
  },
  computed: {
    ...mapGetters({
      loading: "moduleClients/getLoading",
      clientType: "moduleClients/getClientType",
    }),
    idClient() {
      return this.$route.params.id || null;
    },
  },
  methods: {
    ...mapMutations({
      changeLoading: "moduleClients/changeLoading",
    }),
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
    getClientType(type) {
      return this.clientType.find((x) => x.id === type)?.title || "Не задан";
    },
    fetchClient() {
      this.changeLoading(true);

      this.$api.clients
        .getClient(this.idClient)
        .then((response) => {
          if (response.status == 404) this.message = "Клиент не найден";
          else this.client = response.data;
          this.changeLoading(false);
        })
        .finally(() => this.changeLoading(false));
    },
    deleteClient() {
      this.changeLoading(true);

      this.$api.clients.deleteClient(this.idClient).then((response) => {
        this.changeLoading(false);

        this.$router.push({ name: "clients" });
      });
    },
  },
  mounted() {
    this.fetchClient(this.idClient);
  },
};
</script>
