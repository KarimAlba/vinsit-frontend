<template>
  <v-select
    label="full_name"
    @search="onSearchRecipients"
    @input="input"
    :options="recipients"
    :placeholder="placeholder"
    :filterable="false"
    :disabled="disabled"
    :reduce="reduce"
  >
    <template #no-options="{ search }">
      {{ search.length ? "Ничего не найдено" : "Введите запрос" }}
    </template>
  </v-select>
</template>

<script>
import vSelect from "vue-select";
import { debounce } from "lodash";

export default {
  props: {
    placeholder: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    reduce: {
      type: Function,
    },
  },
  data() {
    return {
      recipients: [],
    };
  },
  components: {
    vSelect,
  },
  methods: {
    onSearchRecipients(search, loading) {
      if (search.length) {
        loading(true);

        this.fetchRecipients(search, loading, this);
      }
    },
    fetchRecipients: _.debounce((search, loading, vm) => {
      vm.$api.recipients
        .getRecipients({ search, limit: 100 })
        .then((response) => {
          vm.recipients = response.data.results;

          loading(false);
        });
    }, 500),
    input(sender) {
      this.$emit("input", sender);
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
