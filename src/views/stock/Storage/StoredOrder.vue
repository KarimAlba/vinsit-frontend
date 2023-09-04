<template>
    <b-card>
        <section class="order pb-0">
            <h1 v-if="idStoredOrder">Заказ №{{ idStoredOrder }}</h1>
            <h1 v-else>Регистрация груза</h1>
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
                        :options="zones"
                        placeholder="Зона"
                        :filterable="false"
                        v-model="zone"
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
                        :options="racks"
                        placeholder="Стеллаж"
                        :filterable="false"
                        v-model="rack"
                        :disabled="zone || rack ? false : true"
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
                        :options="shelves"
                        placeholder="Полка"
                        :filterable="false"
                        v-model="shelf"
                        :disabled="rack || shelf ? false : true"
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
                        :options="statuses"
                        placeholder="Статус"
                        :filterable="false"
                        v-model="status"
                        :disabled="shelf || status ? false : true"
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
                        label="id"
                        :reduce="(item) => item.id"
                        @search="onSearchOrders"
                        :options="selectOrders"
                        placeholder="Номера заказов"
                        :filterable="false"
                        multiple
                        v-model="orders"
                        :disabled="status || orders.length > 0 ? false : true"
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
                <router-link
                    @click="handleExit"
                    :to="{ name: 'stock-storage' }"
                    class="cancel-link"
                >
                    Отмена
                </router-link>
                <div class="reg-btn-container">
                    <b-button 
                        variant="primary" 
                        v-if="idStoredOrder && goodValidate"
                        @click="handleUpdateStoredOrder"
                        :to="{ name: 'stock-storage' }"
                    >
                        Обновить значения
                    </b-button>
                    <b-button 
                        variant="primary" 
                        v-else-if="goodValidate"
                        @click="handleCreateStoredOrder"
                        :to="{ name: 'stock-storage' }"
                    >
                        Зарегистрировать груз
                    </b-button>
                </div>
            </div>
		</template>
	</b-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

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
            idStoredOrder: this.$route.params.id || null,
            visible: true,
            zones: [],
            racks: [],
            shelves: [],
            statuses: [],
            selectOrders: [],
            zone: null,
            rack: null,
            shelf: null,
            status: null,
            orders: [],
            goodValidate: false,
        };
    },
    directives: {
		"b-toggle": VBToggle,
	},
    watch: {
        zone() {
            if (!this.zone || this.zone !== this.editableStoredOrder.zone) {
                this.rack = null
            }
            this.editableStoredOrder.zone = this.zone
        },
        rack() {
            if (!this.rack || this.rack !== this.editableStoredOrder.rack) {
                this.shelf = null
            }
            this.editableStoredOrder.rack = this.rack
        },
        shelf() {
            if (!this.shelf || this.shelf !== this.editableStoredOrder.shelf) {
                this.status = null
            }
            this.editableStoredOrder.shelf = this.shelf
        },
        status() {
            if (!this.status || this.status !== this.editableStoredOrder.status) {
                this.orders = []
            }
            this.editableStoredOrder.status = this.status
        },
        orders() {
            this.validating();
        },
        editableStoredOrder() {
            this.zone = this.editableStoredOrder.zone,
            this.rack = this.editableStoredOrder.rack,
            this.shelf = this.editableStoredOrder.shelf,
            this.status = this.editableStoredOrder.status,
            this.orders = [...this.editableStoredOrder.orders]
        },
    },
    computed: {
        ...mapGetters({
            editableStoredOrder: "moduleCargoRegistration/getEditableStoredOrder"
        }),
    },
    methods: {
        ...mapActions({
            createStoredOrder: "moduleCargoRegistration/createStoredOrder",
            fetchStoredOrder: "moduleCargoRegistration/fetchStoredOrder",
            resetEditableStoredOrder: "moduleCargoRegistration/resetEditableStoredOrder"
        }),
        getUniqueOrders(arr) {
            let result = [];

            for (let str of arr) {
                if (!result.includes(str)) {
                result.push(str);
                }
            }

            return result;
        },
        onSearchZone(search, loading) {
            if (search.length) {
                loading(true);
                this.fetchZone(search, loading, this);
            }
        },
        fetchZone: _.debounce((search, loading, vm) => {
            vm.$api.addressBasedStorage.getZones({ search, limit: 100 })
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
            vm.$api.addressBasedStorage.getRacks({ search, limit: 100, zone: vm.zone.id })
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
            vm.$api.addressBasedStorage.getShelves({ search, limit: 100, rack: vm.rack.id })
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
            vm.$api.addressBasedStorage.getStoredOrderStatus({ limit: 100, name: search })
                .then((response) => {
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
            vm.$api.orders.getOrders({ limit: 100, search_fields:"id", search: search })
                .then((response) => {
                    vm.selectOrders = [... vm.selectOrders, ...response.data.results];
                    loading(false);
                });
        }, 500),
        validating() {
            if (this.orders.length) {
                this.goodValidate = true;
            } else {
                this.goodValidate = false;
            }
        },
        handleCreateStoredOrder() {
            this.createStoredOrder({
                zone: this.zone.id,
                rack: this.rack.id,
                shelf: this.shelf.id,
                status: this.status.id,
                orders: this.orders
            });
        },
        handleUpdateStoredOrder() {
            this.fetchEditableStoredOrder(this);            
        },
        fetchEditableStoredOrder(vm) {
            var requestOrders = [...vm.orders];

            if (vm.orders[0].id) {
                requestOrders = [...vm.orders.map(order => order.id)]
            } 

            let updatedOrder = {
                zone: vm.zone.id,
                rack: vm.rack.id,
                shelf: vm.shelf.id,
                status: vm.status.id,
                orders: requestOrders
            }
            vm.$api.addressBasedStorage.updateStoredOrder(vm.idStoredOrder, updatedOrder)
                .then((response) => {
                    console.log("updated:", response);
                });
        },
        onStoredOrderMount () {
            if (this.idStoredOrder) {
                this.fetchStoredOrder(this.idStoredOrder);
            }
        },
        handleExit() {
            this.resetEditableStoredOrder();
        },
    },
    mounted() {
        this.onStoredOrderMount();
    },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

.cancel-link{
    margin-top: 10px;
}

.stored-order-footer{
    display: flex;
    justify-content: start;

    .reg-btn-container{
        margin: 0 0 0 20px;
    }
}
</style>
