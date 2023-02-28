<template>
  <div>
    <b-card>
      <b-row>
        <b-col cols="12">
          <b-form-group label="Поиск">
            <b-form-input
              debounce="500"
              v-model="filters.search"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import { BRow, BCol, BCard, BFormInput, BFormGroup } from "bootstrap-vue";

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BFormGroup,
    BFormInput,
  },
  watch: {
    filters: {
      handler(val) {
        this.resetPagination();
        this.fetchPayers();
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters({
      filters: "modulePayers/getFilters",
    }),
  },
  methods: {
    ...mapActions({
      fetchPayers: "modulePayers/fetchPayers",
      resetPagination: "modulePayers/resetPagination",
      resetFilters: "modulePayers/resetFilters",
    }),
  },
};
</script>
