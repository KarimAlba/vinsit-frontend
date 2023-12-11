<template>
    <v-select
        label="name"
        @search="onSearch"
        @input="input"
        :options="seals"
        :placeholder="placeholder"
        :filterable="false"
        :disabled="disabled"
        :reduce="(c) => c.id"
        :value="seal"
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
            seals: [],
            seal: null,
        };
    },
    components: {
        vSelect,
    },
    watch: {
        'value'() {
            if (!this.value) {
                this.seal = null;
                return;
            }
            this.getSealById(this.value);
        },
    },
    methods: {
        onSearch(search, loading) { 
            if (search.length) {
                loading(true);

                this.fetchSeals(search, loading, this);
            }
        },
        fetchSeals: _.debounce((search, loading, vm) => {
            vm.$api.seal.getSeals({ search, limit: 100 }).then((response) => {
                vm.seals = response.data.results;
                loading ? loading(false) : null;
            });
        }, 500),
        getSealById(id) {
            console.log(id)
            this.$api.seal.getSealById(id).then((response) => {
                // console.log('zdes kosyak')
                // console.log(response, id)
                // this.seals = [response.data];
                this.seal = response.data;
            });
        },
        input(c) {
            this.$emit("input", c);
        },
    },
    mounted() {
        // this.fetchSeals(null, null, this);
        this.value ? this.getSealById(this.value) : null;
    },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
