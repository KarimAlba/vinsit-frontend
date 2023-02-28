<template>
  <v-select
    label="name"
    @search="onSearchClients"
    @input="input"
    :options="clients"
    :placeholder="placeholder"
    :filterable="false"
    :disabled="disabled"
    :reduce="reduce"
    v-model="inputVal"
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
    value: {
      type: [Number, String, Object],
    },
  },
  data() {
    return {
      clients: [],
      client: null,
    };
  },
  components: {
    vSelect,
  },
  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    onSearchClients(search, loading) {
      if (search.length) {
        loading(true);

        this.fetchClients(search, loading, this);
      }
    },
    fetchClients: _.debounce((search, loading, vm) => {
      vm.$api.clients.getClients({ search, limit: 100 }).then((response) => {
        vm.clients = response.data.results;

        loading(false);
      });
    }, 500),
    input(client) {
      this.$emit("input", client);
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
