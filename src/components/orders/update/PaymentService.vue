<template>
    <b-row class="service">
        <b-col cols="12" md="8">
            <!-- @change="handleOrderService(service)"
            :checked="checkService(service.service)" -->
            <b-form-checkbox
                :id="String(orderPaymentService.id)"
                :name="orderPaymentService.name"
                v-model="orderPaymentService.included"
                :value="true"
                :unchecked-value="false"
            >
                {{orderPaymentService.name}}
            </b-form-checkbox>
        </b-col>
        <b-col cols="12" md="4">
            <b-form-group>
                <b-form-input
                    type="number"
                    v-model="orderPaymentService.price"
                />
            </b-form-group>
        </b-col>
    </b-row>
</template>

<script>
import {
  BRow,
  BCol,
  BFormInput,
  BFormGroup,
  BFormRadio,
  BFormCheckbox,
} from "bootstrap-vue";

export default {
    components: {
        BRow,
        BCol,
        BFormInput,
        BFormGroup,
        BFormRadio,
        BFormCheckbox,
    },
    props: {
        orderPaymentService: {
            type: Object,
            required: true,
        }
    },
    watch: {
        'orderPaymentService'() {
            this.$emit('onServiceChange', this.orderPaymentService);
        },
    },
}
</script>

<style lang="scss">
    .service {
        border-bottom: 1px solid #E7E9EB;

        
        .form-group {
            margin-top: 1rem;
        }

        div {
            display: flex;
            align-items: center;
        }

        .form-group {
            width: 100%;
        }

    }
</style>
