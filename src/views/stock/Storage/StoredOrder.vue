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
                        :disabled="storedOrder.zone || storedOrder.rack ? false : true"
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
                        :disabled="storedOrder.rack || storedOrder.shelf ? false : true"
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
                        :disabled="storedOrder.shelf || storedOrder.status ? false : true"
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
                        v-model="storedOrder.orders"
                        :disabled="storedOrder.status || storedOrder.orders.length > 0 ? false : true"
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
            visible: true,
            zones: [],
            racks: [],
            shelves: [],
            statuses: [],
            selectOrders: [],
            storedOrder: {
                zone: null,
                rack: null,
                shelf: null,
                status: null,
                orders: []
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
        },
        editableStoredOrder() {
            this.storedOrder = {...this.editableStoredOrder};
        }
    },
    computed: {
        ...mapGetters({
            editableStoredOrder: "moduleCargoRegistration/getEditableStoredOrder"
        }),
        idStoredOrder() {
            return this.$route.params.id || null;
        },
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
            vm.$api.addressBasedStorage.getRacks({ search, limit: 100, zone: vm.storedOrder.zone })
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
            vm.$api.addressBasedStorage.getShelves({ search, limit: 100, rack: vm.storedOrder.rack })
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
            vm.$api.addressBasedStorage.getStoredOrderStatus({ search, limit: 100 })
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
        validateStoredOrder() {
            if (this.storedOrder.zone && this.storedOrder.rack
                && this.storedOrder.shelf && this.storedOrder.status
                && this.storedOrder.orders.length
            ) {
                this.goodValidate = true;
            } else {
                this.goodValidate = false;
            }
        },
        handleCreateStoredOrder() {
            this.createStoredOrder(this.storedOrder);
        },
        handleUpdateStoredOrder() {
            this.fetchEditableStoredOrder(this);            
        },
        fetchEditableStoredOrder(vm) {
            vm.$api.addressBasedStorage.updateStoredOrder(vm.idStoredOrder, vm.storedOrder)
                .then((response) => {
                    console.log('success updated');
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
