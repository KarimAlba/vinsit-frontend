<template>
  <section class="order pb-5">
    <b-overlay :show="loading" rounded="sm">
      <template v-if="message">
        <h1>{{ message }}</h1>
      </template>
      <template v-else>
        <h1 class="mb-2">Получатель №{{ recipient.id }}</h1>
        <b-row>
          <b-col>
            <b-card>
              <b-card-title>Основная информация</b-card-title>

              <table class="w-100">
                <tr>
                  <td class="pb-1">Название / ФИО</td>
                  <td class="pb-1">{{ recipient.full_name }}</td>
                </tr>

                <tr>
                  <td class="pb-1">Адрес</td>
                  <td class="pb-1">{{ recipient.address }}</td>
                </tr>

                <tr>
                  <td class="pb-1">Город</td>
                  <td class="pb-1">
                    {{ recipient.city.name }}
                  </td>
                </tr>

                <tr>
                  <td class="pb-1">Пасспортные данные</td>
                  <td class="pb-1">
                    {{ recipient.passport_series }} {{ recipient.passport_no }}
                  </td>
                </tr>

                <tr>
                  <td class="pb-1">Контрагент</td>
                  <td class="pb-1">
                    <router-link
                      style="border-bottom: 1px dotted blue"
                      :to="{
                        name: 'client',
                        params: { id: recipient.counterparty.id },
                      }"
                      >{{ recipient.counterparty.name }}</router-link
                    >
                  </td>
                </tr>

                <tr>
                  <td class="pb-1">Тип контрагента</td>
                  <td class="pb-1">
                    {{ recipient.counterparty_type }}
                  </td>
                </tr>
              </table>
            </b-card>
          </b-col>
          <b-col>
            <b-card>
              <b-card-title>Контакты</b-card-title>

              <table class="w-100">
                <tr
                  v-if="
                    recipient.recipient_phones &&
                    recipient.recipient_phones.length
                  "
                >
                  <td class="pb-1">Номера телефонов</td>
                  <td class="pb-1">
                    <p
                      v-for="(phone, i) in recipient.recipient_phones"
                      :key="i"
                    >
                      <a :href="`tel:${phone.phone_number}`"
                        >{{ i + 1 }}. {{ phone.phone_number }}</a
                      >
                    </p>
                  </td>
                </tr>

                <tr v-if="recipient.email">
                  <td class="pb-1">Email</td>
                  <td class="pb-1">
                    <a :href="`mailto:${recipient.email}`">{{
                      recipient.email
                    }}</a>
                  </td>
                </tr>

                <tr v-if="recipient.web">
                  <td class="pb-1">Сайт</td>
                  <td class="pb-1">
                    <a
                      v-if="isValidHttpUrl(recipient.web)"
                      :href="recipient.web"
                      target="_blank"
                      >{{ recipient.web }}</a
                    >
                    <span v-else>{{ recipient.web }}</span>
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
          @ok="deleteRecipient"
          ok-title="Удалить"
          ok-variant="danger"
          header-bg-variant="danger"
          cancel-title="Отмена"
          size="sm"
        >
          <p>Удалить получателя?</p>
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
      recipient: {},
      message: null,
    };
  },
  computed: {
    ...mapGetters({
      loading: "moduleRecipients/getLoading",
    }),
    idRecipient() {
      return this.$route.params.id || null;
    },
  },
  methods: {
    ...mapMutations({
      changeLoading: "moduleRecipients/changeLoading",
    }),
    fetchRecipient() {
      this.changeLoading(true);

      this.$api.recipients
        .getRecipient(this.idRecipient)
        .then((response) => {
          if (response.status == 404) this.message = "Получатель не найден";
          else this.recipient = response.data;
          this.changeLoading(false);
        })
        .finally(() => this.changeLoading(false));
    },
    deleteRecipient() {
      this.changeLoading(true);

      this.$api.recipients
        .deleteRecipient(this.idRecipient)
        .then((response) => {
          this.changeLoading(false);

          this.$router.push({ name: "recipients" });
        });
    },
  },
  mounted() {
    this.fetchRecipient(this.idRecipient);
  },
};
</script>
