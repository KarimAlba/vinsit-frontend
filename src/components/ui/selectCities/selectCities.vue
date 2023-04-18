<template>
  <v-select
    label="name"
    @search="onSearchCities"
    @input="input"
    :options="cities"
    :placeholder="placeholder"
    :filterable="false"
    :disabled="disabled"
    :reduce="(c) => c.id"
    :value="city"
  >
    <template #no-options="{ search }">
      {{ search.length ? "Ничего не найдено" : "Введите запрос" }}
    </template>
  </v-select>
</template>

<script>
import vSelect from "vue-select";
import _ from "lodash";

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
  watch: {
    'value'() {
        console.log('tut');
        console.log('value', this.value);
        if (!this.value) {
            console.log('no city');
            this.city = null;
            return;
        }
        this.getCityById(this.value);
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
        console.log('i am dsfds')
        vm.cities = response.data.results;

        loading ? loading(false) : null;
      });
    }, 500),
    getCityById(id) {
        this.$api.cities.getCity(id).then((response) => {
            console.log('zdes kosyak')
            console.log(response.data)
            this.cities = [response.data];
            this.city = response.data;
        });
    },
    input(c) {
      this.$emit("input", c);
    },
  },
  mounted() {
    console.log('city value - ', this.value);
    this.value ? this.getCityById(this.value) : null;
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
