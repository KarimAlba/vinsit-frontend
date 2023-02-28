<template>
  <div>
    <b-card>
      <b-row>
        <b-col class="mb-1" cols="12" md="4">
          <b-form-input placeholder="Номер заявки"></b-form-input>
        </b-col>
        <b-col class="mb-1" cols="12" md="4">
          <app-datepicker
            placeholder="Период заказа"
            @selectedDates="changeDatesCreated"
          />
        </b-col>

        <b-col class="mb-1" cols="12" md="4">
          <v-select
            label="status"
            :reduce="(status) => status.id"
            placeholder="Статус заказа"
            :options="orderStatus"
            v-model="filters.status"
          />
        </b-col>
      </b-row>

      <b-collapse v-model="visible" id="filters-collapse">
        <b-row>
          <b-col class="mb-1" cols="12" md="4">
            <v-select
              label="title"
              :reduce="(mode) => mode.id"
              placeholder="Режим заказа"
              :options="orderMode"
              v-model="filters.mode"
            />
          </b-col>

          <b-col class="mb-1" cols="12" md="4">
            <v-select
              label="name"
              @search="onSearchCities"
              @close="resetCities"
              @input="
                (item) => {
                  filters.sender__city = item.id;
                }
              "
              :options="cities"
              placeholder="Город отправителя"
              :filterable="false"
            >
              <template #no-options="{ search }">
                {{ search.length ? "Ничего не найдено" : "Введите запрос" }}
              </template>
            </v-select>
          </b-col>

          <b-col class="mb-1" cols="12" md="4">
            <v-select
              label="name"
              @search="onSearchCities"
              @close="resetCities"
              @input="
                (item) => {
                  filters.recipient__city = item.id;
                }
              "
              :options="cities"
              placeholder="Город получателя"
              :filterable="false"
            >
              <template #no-options="{ search }">
                {{ search.length ? "Ничего не найдено" : "Введите запрос" }}
              </template>
            </v-select>
          </b-col>

          <b-col class="mb-1" cols="12" md="4">
            <b-form-input
              placeholder="Телефон клиента"
              debounce="500"
              v-model="
                filters.sender__counterparty__client_phones__phone_number
              "
            ></b-form-input>
          </b-col>

          <b-col class="mb-1" cols="12" md="4">
            <app-datepicker
              placeholder="Дата проставления статуса"
              @selectedDates="changeDatesStatus"
            />
          </b-col>

          <b-col class="mb-1" cols="12" md="4">
            <b-form-checkbox
              value="true"
              :unchecked-value="null"
              v-model="filters.recipient_has_passport"
            >
              Паспортные данные получателя<br />собраны
            </b-form-checkbox>
          </b-col>

          <b-col class="mb-1" cols="12" md="4">
            <b-form-checkbox
              value="false"
              :unchecked-value="null"
              v-model="filters.sender_has_passport"
            >
              Нет паспортных данных отправителя
            </b-form-checkbox>
          </b-col>
          <b-col class="mb-1" cols="12" md="4">
            <b-form-checkbox
              value="true"
              :unchecked-value="null"
              v-model="filters.from_amo_crm"
            >
              Оформлен моим ПВЗ
            </b-form-checkbox>
          </b-col>
          <b-col class="mb-1" cols="12" md="4">
            <b-form-checkbox
              value="true"
              :unchecked-value="null"
              v-model="filters.is_overdue"
            >
              Просрочка
            </b-form-checkbox>
          </b-col>
          <b-col class="mb-1" cols="12" md="4">
            <b-form-checkbox
              value="false"
              :unchecked-value="null"
              v-model="filters.recipient_has_passport"
            >
              Нет паспортных данных получателя
            </b-form-checkbox>
          </b-col>
          <b-col class="mb-1" cols="12" md="4">
            <b-form-checkbox
              value="true"
              :unchecked-value="null"
              v-model="filters.sender_has_passport"
            >
              Паспортные данные отправителя собраны
            </b-form-checkbox>
          </b-col>
        </b-row>
      </b-collapse>

      <template #footer>
        <a class="filter-orders__btn mr-1" v-b-toggle="'filters-collapse'">
          <feather-icon
            :icon="visible ? 'ChevronUpIcon' : 'ChevronDownIcon'"
            size="12"
          />
          <span class="filter-orders__btn-text"> Все фильтры </span>
        </a>

        <a class="filter-orders__btn" @click="resetFilters">
          <feather-icon icon="XCircleIcon" size="12" />
          <span class="filter-orders__btn-text"> Сбросить все фильтры </span>
        </a>
      </template>
    </b-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import {
  BRow,
  BCol,
  BCard,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BCollapse,
  VBToggle,
} from "bootstrap-vue";
import vSelect from "vue-select";
import { debounce } from "lodash";
import AppDatepicker from "@/@core/components/app-datepicker/AppDatepicker";

export default {
  data() {
    return {
      cities: [],
      orderStatus: [],
      visible: false,
    };
  },
  components: {
    BRow,
    BCol,
    BCard,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BCollapse,
    VBToggle,

    AppDatepicker,
    vSelect,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  watch: {
    filters: {
      handler(val) {
        this.resetPagination();
        this.fetchOrders();
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters({
      orderMode: "moduleOrders/getOrderMode",
      filters: "moduleOrders/getFilters",
    }),
  },
  methods: {
    ...mapActions({
      fetchOrders: "moduleOrders/fetchOrders",
      resetPagination: "moduleOrders/resetPagination",
      resetFilters: "moduleOrders/resetFilters",
    }),
    changeDatesCreated(dates) {
      this.filters.date_created_after = this.dayjs(dates.start).format(
        "YYYY-MM-DD"
      );
      this.filters.date_created_before = this.dayjs(dates.end).format(
        "YYYY-MM-DD"
      );
    },
    changeDatesStatus(dates) {
      this.filters.status_changed_date_after = this.dayjs(dates.start).format(
        "YYYY-MM-DD"
      );
      this.filters.status_changed_date_before = this.dayjs(dates.end).format(
        "YYYY-MM-DD"
      );
    },
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
    resetCities() {
      this.cities = [];
    },
    fetchStatus() {
      this.$api.orderStatus.getOrderStatusList().then((response) => {
        this.orderStatus = response.data.results;
      });
    },
  },
  mounted() {
    this.fetchStatus();
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

.filter-orders {
  &__btn {
    display: inline-flex;
    align-items: center;

    &:hover {
      .filter-orders__btn-text {
        color: $primary;
        border-color: $primary;
      }
    }
  }

  &__btn-text {
    margin-left: 5px;
    border-bottom: 1px dashed #000;
  }
}
</style>
