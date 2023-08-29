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
                        :reduce="(item) => item.id"
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
                        :reduce="(item) => item.id"
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
                        :reduce="(item) => item.id"
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
                        :reduce="(item) => item.id"
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
                        taggable 
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
            // storedOrder: {
            //     zone: null,
            //     rack: null,
            //     shelf: null,
            //     status: null,
            //     orders: []
            // },
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
        // storedOrder: {
        //     handler() {
        //         console.log(this.storedOrder);
        //         this.validateStoredOrder();
        //         this.checkStoredOrdersFields(); // - отрабатывает, но ругается, мол not a function((
        //     },
        //     deep: true,
        // },
        idStoredOrder() {
            console.log(this.idStoredOrder)
        },
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
            console.log()
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
        }
    },
    computed: {
        ...mapGetters({
            editableStoredOrder: "moduleCargoRegistration/getEditableStoredOrder"
        }),
        // idStoredOrder() {
        //     return this.$route.params.id || null;
        // },
        // checkStoredOrdersFields() {
        //     if (!this.storedOrder.zone) {
        //         this.storedOrder.rack = null;
        //     }

        //     if (!this.storedOrder.rack) {
        //         this.storedOrder.shelf = null;
        //     }

        //     if (!this.storedOrder.shelf) {
        //         this.storedOrder.status = null;
        //     }

        //     if (!this.storedOrder.status) {
        //         this.storedOrder.orders = [];
        //     }
        // }
    },
    methods: {
        ...mapActions({
            createStoredOrder: "moduleCargoRegistration/createStoredOrder",
            fetchStoredOrder: "moduleCargoRegistration/fetchStoredOrder",
            resetEditableStoredOrder: "moduleCargoRegistration/resetEditableStoredOrder"
        }),
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
            vm.$api.addressBasedStorage.getRacks({ search, limit: 100, zone: vm.zone })
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
            vm.$api.addressBasedStorage.getShelves({ search, limit: 100, rack: vm.rack })
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
            vm.$api.orders.getOrders({ limit: 100, id: search })
                .then((response) => {
                    vm.selectOrders = [...response.data.results];
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
                zone: this.zone,
                rack: this.rack,
                shelf: this.shelf,
                status: this.status,
                orders: this.orders
            });
        },
        handleUpdateStoredOrder() {
            this.fetchEditableStoredOrder(this);            
        },
        fetchEditableStoredOrder(vm) {
            let updatedOrder = {
                zone: vm.zone,
                rack: vm.rack,
                shelf: vm.shelf,
                status: vm.status,
                orders: vm.orders
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
