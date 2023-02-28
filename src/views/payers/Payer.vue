<template>
  <section class="order pb-5">
    <b-overlay :show="loading" rounded="sm">
      <template v-if="message">
        <h1>{{ message }}</h1>
      </template>
      <template v-else>
        <h1 class="mb-2">Плательщик №{{ payer.id }}</h1>
        <b-row>
          <b-col>
            <b-card>
              <b-card-title>Основная информация</b-card-title>

              <table class="w-100">
                <tr>
                  <td class="pb-1">Город</td>
                  <td class="pb-1">
                    {{ payer.city }}
                  </td>
                </tr>

                <tr>
                  <td class="pb-1">Контрагент</td>
                  <td class="pb-1">
                    {{ payer.counterparty }}
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
          @ok="deletePayer"
          ok-title="Удалить"
          ok-variant="danger"
          header-bg-variant="danger"
          cancel-title="Отмена"
          size="sm"
        >
          <p>Удалить плательщика?</p>
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
      payer: {},
      message: null,
    };
  },
  computed: {
    ...mapGetters({
      loading: "modulePayers/getLoading",
    }),
    idPayer() {
      return this.$route.params.id || null;
    },
  },
  methods: {
    ...mapMutations({
      changeLoading: "modulePayers/changeLoading",
    }),
    fetchPayer() {
      this.changeLoading(true);

      this.$api.payers
        .getPayer(this.idPayer)
        .then((response) => {
          if (response.status == 404) this.message = "Плательщик не найден";
          else this.payer = response.data;
          this.changeLoading(false);
        })
        .finally(() => this.changeLoading(false));
    },
    deletePayer() {
      this.changeLoading(true);

      this.$api.payers.deletePayer(this.idPayer).then((response) => {
        this.changeLoading(false);

        this.$router.push({ name: "payers" });
      });
    },
  },
  mounted() {
    this.fetchPayer(this.idPayer);
  },
};
</script>
