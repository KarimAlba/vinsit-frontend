<template>
    <v-select
        label="name"
        @search="onSearch"
        @input="input"
        :options="offices"
        :placeholder="placeholder"
        :filterable="false"
        :disabled="disabled"
        :reduce="(c) => c.id"
        :value="office"
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
        allOfices: {
            type: Array
        }
    },
    data() {
        return {
        offices: [],
        office: null,
        };
    },
    components: {
        vSelect,
    },
    watch: {
        'value'() {
            console.log('w', this.value)
            if (!this.value) {
                // console.log('no city');
                this.office = null;
                return;
            }
            this.getOfficeById(this.value);
        },
        'allOfices'() {
            this.allOfices ? this.offices = this.allOfices : null;
        },
    },
    methods: {
        onSearch(search, loading) { 
            if (search.length) {
                loading(true);

                this.fetchOffices(search, loading, this);
            }
        },
        fetchOffices: _.debounce((search, loading, vm) => {
            vm.$api.office.getOffices({ search, limit: 100 }).then((response) => {
                // console.log('i am dsfds')
                vm.offices = response.data;
                loading ? loading(false) : null;
            });
        }, 500),
        getOfficeById(id) {
            this.$api.office.getOfficeById(id).then((response) => {
                // console.log('zdes kosyak')
                // console.log(response.data)
                this.offices = [response.data];
                this.office = response.data;
            });
        },
        input(c) {
            this.$emit("input", c);
        },
    },
    mounted() {
        // this.fetchOffices(null, null, this);
        this.value ? this.getOfficeById(this.value) : null;
    },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
