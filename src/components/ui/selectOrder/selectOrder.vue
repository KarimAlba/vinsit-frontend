<template>
    <v-select
        label="id"
        @search="onSearch"
        @input="input"
        :options="orders"
        :placeholder="placeholder"
        :filterable="false"
        :disabled="disabled"
        :reduce="(c) => c.id"
        :value="order"
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
        orders: [],
        order: null,
        };
    },
    components: {
        vSelect,
    },
    watch: {
        'value'() {
            if (!this.value) {
                // console.log('no city');
                this.order = null;
                return;
            }
            this.getOrderById(this.value);
        },
    },
    methods: {
        onSearch(search, loading) { 
            if (search.length) {
                loading(true);

                this.fetchOrders(search, loading, this);
            }
        },
        fetchOrders: _.debounce((search, loading, vm) => {
            vm.$api.orders.getOrders({ search: search, search_fields: 'id', limit: 100 }).then((response) => {
                // console.log('i am dsfds', response)
                vm.orders = response.data.results;
                loading ? loading(false) : null;
            });
        }, 500),
        getOrderById(id) {
            this.$api.orders.getOrder(id).then((response) => {
                // console.log('zdes kosyak')
                // console.log(response.data)
                this.orders = [response.data];
                this.order = response.data;
            });
        },
        input(c) {
            this.$emit("input", c);
        },
    },
    mounted() {
        this.value ? this.getOrderById(this.value) : null;
    },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
