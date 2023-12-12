<template>
	<div>
        <b-card style="margin: 0;">
            
        </b-card>
    </div>
</template>

<script>
import { BCard, BTable } from 'bootstrap-vue';
import InventorizationChannel from '../../../api/inventorizationChannel.js'

export default {
    components: {
        BCard,
        BTable,
    },
    data() {
        return {
            tableFields: [
                { key: "show_details", label: "" },
                { key: "id", label: "Номер заказа", sortable: true },
            ],
            sortBy: 'date_created',
            sortDesc: false,
            filter: {},
            inventarizationList: [],
            logs: [],
            stockObjectNumber: null,
            inventarizationChannel: new InventorizationChannel(1),
        };
    },
    watch: {
    },
    computed: {
        showPagination() {
            // return Math.ceil(this.count / this.perPage) > 1;
        },
    },
    methods: {
        getInventarizationList() {

        },
        exportInventarizationList() {

        },
    },
    mounted() {
        this.inventarizationChannel.startConnection();
    },
    beforeDestroy() {
        this.inventarizationChannel.closeConnection();
    }
};
</script>

<style lang="scss" scoped>

</style>
