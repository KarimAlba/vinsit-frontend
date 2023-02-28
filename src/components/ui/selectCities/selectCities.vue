<template>
  <v-select
    label="name"
    @search="onSearchCities"
    @input="input"
    :options="cities"
    :placeholder="placeholder"
    :filterable="false"
    :disabled="disabled"
    :reduce="(city) => city.id"
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
    value: {
      type: [Number, String, Object],
    },
  },
  data() {
    return {
      cities: [],
      city: null,
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
    onSearchCities(search, loading) {
      if (search.length) {
        loading(true);

        this.fetchCities(search, loading, this);
      }
    },
    fetchCities: _.debounce((search, loading, vm) => {
      vm.$api.cities.getCities({ search, limit: 100 }).then((response) => {
        vm.cities = response.data.results;

        loading(false);
      });
    }, 500),
    input(city) {
      this.$emit("input", city);
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
