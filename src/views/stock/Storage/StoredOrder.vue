<template>
    <b-card>
        <section class="order pb-0">
            <h1>Регистрация груза</h1>
        </section>
		<b-collapse 
			v-model="visible" 
			id="filters-collapse"
		>
            <b-row>
                <b-col class="p-1">
                    <v-select
                        label="name"
                        @search="onSearchZone"
                        :reduce="(item) => item.id"
                        :options="zones"
                        placeholder="Зона"
                        :filterable="false"
                        v-model="storedOrder.zone"
                    >
                        <template #no-options="{ search }">
                            {{ search.length ? "Ничего не найдено" : "Введите запрос" }}
                        </template>
                    </v-select>
                </b-col>
            </b-row>
            <b-row>
                <b-col class="p-1">
                    <v-select
                        label="name"
                        @search="onSearchRack"
                        :reduce="(item) => item.id"
                        :options="racks"
                        placeholder="Стеллаж"
                        :filterable="false"
                        v-model="storedOrder.rack"
                        :disabled="storedOrder.zone ? false : true"
                    >
                        <template #no-options="{ search }">
                            {{ search.length ? "Ничего не найдено" : "Введите запрос" }}
                        </template>
                    </v-select>
                </b-col>
            </b-row>
            <b-row>
                <b-col class="p-1">
                    <v-select
                        label="name"
                        @search="onSearchShelf"
                        :reduce="(item) => item.id"
                        :options="shelves"
                        placeholder="Полка"
                        :filterable="false"
                        v-model="storedOrder.shelf"
                        :disabled="storedOrder.rack ? false : true"
                    >
                        <template #no-options="{ search }">
                            {{ search.length ? "Ничего не найдено" : "Введите запрос" }}
                        </template>
                    </v-select>
                </b-col>
            </b-row>
            <b-row>
                <b-col class="p-1">
                    <v-select
                        label="name"
                        @search="onSearchStatus"
                        :reduce="(item) => item.id"
                        :options="statuses"
                        placeholder="Статус"
                        :filterable="false"
                        v-model="storedOrder.status"
                        :disabled="storedOrder.shelf ? false : true"
                    >
                        <template #no-options="{ search }">
                            {{ search.length ? "Ничего не найдено" : "Введите запрос" }}
                        </template>
                    </v-select>
                </b-col>
			</b-row>
            <b-row>
                <b-col class="p-1">
                    <v-select
                        label="name"
                        :reduce="(item) => item.id"
                        :options="selectOrders"
                        placeholder="Заказы"
                        :filterable="false"
                        taggable 
                        multiple
                        v-model="storedOrder.orders"
                        :disabled="storedOrder.status ? false : true"
                    >
                        <template #no-options="{ search }">
                            {{ search.length ? "Ничего не найдено" : "Введите запрос" }}
                        </template>
                    </v-select>
                </b-col>
			</b-row>
		</b-collapse>
		<template #footer>
            <div class="stored-order-footer">
                <a 
                    class="filter-orders__btn" 
                    @click="() => {
                        resetFilters()
                        // fetchStoredOrders()
                    }"
                >
                    <feather-icon icon="XCircleIcon" size="12" />
                    <span class="filter-orders__btn-text"> Сбросить все фильтры </span>
                </a>
                <div class="reg-btn-container">
                    <b-button 
                        variant="primary" 
                        v-if="goodValidate"
                    >
                        Зарегистрировать груз
                    </b-button>
                </div>
            </div>
		</template>
	</b-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

import {
    BRow,
    BCol,
    BCard,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BCollapse,
    VBToggle,
    BButton
} from "bootstrap-vue";
import vSelect from "vue-select";
import { RoleConstants } from '@/utils/role';
import store from "@/store/index";

export default {
    components: {
        BRow,
        BCol,
        BCard,
        BFormGroup,
        BFormInput,
        BFormCheckbox,
        BCollapse,
        VBToggle,
        vSelect,
        BButton
    },
    data() {
        return {
            visible: true,
            zones: [],
            racks: [],
            shelves: [],
            statuses: [],
            selectOrders: [{name: 'ExampleOrder1', id: 1}, {name: 'ExampleOrder2', id: 2}, {name: 'ExampleOrder3', id: 3}],
            storedOrder: {
                zone: null,
                rack: null,
                shelf: null,
                status: null,
                orders: [] // - should be array 
            },
            goodValidate: false,
        };
    },
    directives: {
		"b-toggle": VBToggle,
	},
    watch: {
        storedOrder: {
            handler() {
                this.validateStoredOrder();
            },
            deep: true,
        }
    },
    computed: {
        ...mapGetters({}),
    },
    methods: {
        ...mapActions({
            createStoredOrder: "moduleCargoRegistration/createStoredOrder"
        }),
        onSearchZone(search, loading) {
            if (search.length) {
                loading(true);
                this.fetchZone(search, loading, this);
            }
        },
        fetchZone: _.debounce((search, loading, vm) => {
            vm.$api.cargoRegistration.getZones({ search, limit: 100 })
                .then((response) => {
                    vm.zones = [...response.data.results];
                    loading(false);
                });
        }, 500),
        onSearchRack(search, loading) {
            if (search.length) {
                loading(true);
                this.fetchRack(search, loading, this);
            }
        },
        fetchRack: _.debounce((search, loading, vm) => {
            vm.$api.cargoRegistration.getRacks({ search, limit: 100 })
                .then((response) => {
                    vm.racks = [...response.data.results];
                    loading(false);
                });
        }, 500),
        onSearchShelf(search, loading) {
            if (search.length) {
                loading(true);
                this.fetchShelf(search, loading, this);
            }
        },
        fetchShelf: _.debounce((search, loading, vm) => {
            vm.$api.cargoRegistration.getShelves({ search, limit: 100 })
                .then((response) => {
                    vm.shelves = [...response.data.results];
                    loading(false);
                });
        }, 500),
        onSearchStatus(search, loading) {
            if (search.length) {
                loading(true);
                this.fetchStatus(search, loading, this);
            }
        },
        fetchStatus: _.debounce((search, loading, vm) => {
            vm.$api.cargoRegistration.getStoredOrderStatus({ search, limit: 100 })
                .then((response) => {
                    console.log(response);
                    vm.statuses = [...response.data.results];
                    loading(false);
                });
        }, 500),
        onSearchOrders(search, loading) {
            if (search.length) {
                loading(true);
                this.fetchOrders(search, loading, this);
            }
        },
        fetchOrders: _.debounce((search, loading, vm) => {
            vm.$api.orders.getOrders({ search, limit: 100 })
                .then((response) => {
                    console.log(response);
                    vm.selectOrders = [...response.data.results];
                    loading(false);
                });
        }, 500),
        resetFilters() {
            this.$data.storedOrder = {
                zone: null,
                rack: null,
                shelf: null,
                status: null,
                orders: null // - should be array 
            };
        },
        validateStoredOrder() {
            console.log(this.storedOrder)
            if (this.storedOrder.zone && this.storedOrder.rack
                && this.storedOrder.shelf && this.storedOrder.status
                && this.storedOrder.orders
            ) {
                this.goodValidate = true;
            } else {
                this.goodValidate = false;
            }
        },
        handleRegBtnClick() {
            this.createStoredOrder(this.storedOrder);
        }
    },
    mounted() {},
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

.stored-order-footer{
    display: flex;
    justify-content: start;

    .reg-btn-container{
        margin: 0 0 0 20px;
    }
}
</style>
