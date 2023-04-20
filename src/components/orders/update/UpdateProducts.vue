<template>
    <div>
        <b-card-actions v-if="products" title="Товары" actionCollapse>
        <b-table
            :items="products"
            :fields="orderProductsFields"
            striped
            responsive
        >
            <template #cell(barcode)="data">
                <a
                    class="link"
                    style="color: #3d78b4;"
                    @click="handlePdfDownload($event, data.item.barcode, data.item.place)"
                >
                    Штрих-код
                </a>
            </template>

            <template #cell(place)="data">
            <validation-provider #default="{ errors }" rules="required">
                <b-form-group :invalid-feedback="errors[0]" :state="!errors.length">
                <v-select
                    style="min-width: 100px"
                    v-model="data.item.place"
                    :disabled="readOnly"
                    label="place_no"
                    :options="places"
                    :reduce="(place) => place.id"
                    @input="updateProduct(data.item.id, $event, 'place', validate)"
                />
                </b-form-group>
            </validation-provider>
            </template>

            <template #cell(name)="data">
            <validation-provider v-slot="{ errors, validate }" rules="required">
                <b-form-group :invalid-feedback="errors[0]" :state="!errors.length">
                <b-form-input
                    v-model="data.item.name"
                    :disabled="readOnly"
                    :state="errors.length > 0 ? false : null"
                    @change="updateProduct(data.item.id, $event, 'name', validate)"
                ></b-form-input>
                </b-form-group>
            </validation-provider>
            </template>

            <template #cell(price)="data">
            <b-form-input
                v-model="data.item.price"
                type="number"
                @change="updateProduct(data.item.id, $event, 'price')"
                :disabled="readOnly"
            ></b-form-input>
            </template>

            <template #cell(quantity)="data">
            <validation-provider v-slot="{ errors, validate }" rules="required">
                <b-form-group :invalid-feedback="errors[0]" :state="!errors.length">
                <b-form-input
                    v-model="data.item.quantity"
                    :disabled="readOnly"
                    :state="errors.length > 0 ? false : null"
                    @change="
                    updateProduct(data.item.id, $event, 'quantity', validate)
                    "
                ></b-form-input>
                </b-form-group>
            </validation-provider>
            </template>

            <template #cell(weight)="data">
            <b-form-input
                style="min-width: 100px"
                v-model="data.item.weight"
                :disabled="readOnly"
                type="number"
                @change="updateProduct(data.item.id, $event, 'weight')"
            ></b-form-input>
            </template>

            <template #cell(delete)="data">
            <b-button
                v-b-tooltip.hover
                title="Удалить товар"
                variant="danger"
                size="sm"
                :disabled="readOnly"
                @click="deletePlace(data.item.id)"
            >
                <feather-icon icon="Trash2Icon" />
            </b-button>
            </template>
        </b-table>

        <div class="d-flex align-items-center justify-content-between">
            <div>
            <p>
                Всего товаров: <b>{{ products.length }} </b>
            </p>
            </div>

            <div>
            <b-button
                v-if="places.length"
                v-b-modal.modal-create-product
                variant="primary"
                size="sm"
                :disabled="readOnly"
                >Создать товар</b-button
            >
            </div>
        </div>
        </b-card-actions>

        <b-modal id="modal-create-product" title="Добавить товар" hide-footer>
        <validation-observer v-slot="{ invalid }">
            <b-row>
            <b-col cols="12" md="12">
                <validation-provider #default="{ errors }" rules="required">
                <b-form-group
                    label="Название"
                    :invalid-feedback="errors[0]"
                    :state="!errors.length"
                >
                    <b-form-input
                        v-model="newProduct.name"
                        :disabled="readOnly"
                        :state="errors.length > 0 ? false : null"
                    ></b-form-input>
                </b-form-group>
                </validation-provider>
            </b-col>

            <b-col cols="12">
                <validation-provider #default="{ errors }" rules="required">
                <b-form-group
                    :invalid-feedback="errors[0]"
                    :state="!errors.length"
                    label="Место"
                >
                    <v-select
                        v-model="newProduct.place"
                        :disabled="readOnly"
                        label="place_no"
                        :options="places"
                        :reduce="(place) => place.id"
                    />
                </b-form-group>
                </validation-provider>
            </b-col>

            <b-col cols="12" md="4">
                <validation-provider #default="{ errors }" rules="required">
                <b-form-group
                    label="Количество"
                    :invalid-feedback="errors[0]"
                    :state="!errors.length"
                >
                    <b-form-input
                        type="number"
                        v-model="newProduct.quantity"
                        :disabled="readOnly"
                        :state="errors.length > 0 ? false : null"
                    ></b-form-input>
                </b-form-group>
                </validation-provider>
            </b-col>

            <b-col cols="12" md="4">
                <b-form-group label="Цена">
                <b-form-input
                    type="number"
                    v-model="newProduct.price"
                    :disabled="readOnly"
                ></b-form-input>
                </b-form-group>
            </b-col>

            <b-col cols="12" md="4">
                <b-form-group label="Вес">
                <b-form-input
                    type="number"
                    v-model="newProduct.weight"
                    :disabled="readOnly"
                ></b-form-input>
                </b-form-group>
            </b-col>
            </b-row>

            <b-button variant="primary" :disabled="invalid || readOnly" @click="createProduct"
            >Добавить</b-button
            >
        </validation-observer>
        </b-modal>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import BCardActions from "@/@core/components/b-card-actions/BCardActions.vue";

import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email, confirmed, password } from "@validations";
import downloadPdf from '../../../utils/downloadPdf';

import vSelect from "vue-select";

import {
    BOverlay,
    BRow,
    BCol,
    BTabs,
    BTab,
    BCard,
    BFormInput,
    BFormCheckbox,
    BCardTitle,
    BCardFooter,
    BBadge,
    BFormTextarea,
    BFormGroup,
    BTable,
    BButton,
    VBTooltip,
} from "bootstrap-vue";

export default {
    components: {
        ValidationProvider,
        ValidationObserver,
        BOverlay,
        BRow,
        BCol,
        BTabs,
        BTab,
        BCard,
        BFormInput,
        BFormCheckbox,
        BCardTitle,
        BCardFooter,
        BBadge,
        BFormTextarea,
        BFormGroup,
        BTable,
        BButton,

        vSelect,
        BCardActions,
    },
    props: {
        order: {
            type: [Number, String],
            required: true,
        },
        products: {
            type: Array,
            reuqired: true,
            default: () => [],
        },
        places: {
            type: Array,
            required: true,
            default: () => [],
        },
        readOnly: false,
    },
    directives: {
        "b-tooltip": VBTooltip,
    },
    data() {
        return {
            orderProductsFields: [
                { key: "barcode", label: "Штрих-код" },
                { key: "place", label: "Номер места" },
                { key: "name", label: "Наименование" },
                { key: "price", label: "Стоимость за ед., руб " },
                { key: "quantity", label: "Количество" },
                { key: "total_price", label: "Сумма" },
                { key: "weight", label: "Вес" },
                { key: "delete", label: "" },
            ],
            newProduct: {},
        };
    },
    computed: {
        ...mapGetters({
            orderStatus: "moduleOrders/getOrderStatus",
        }),
        productsList: {
            get() {
                return [...this.products, ...this.newProducts];
            },
            set(val) {
                this.$emit("input", val);
            },
        },
    },
    methods: {
        async handlePdfDownload(event, barcode, place_no) {
            event.preventDefault();
            downloadPdf(barcode, `barcode-${this.order}-${place_no}.png`);
        },
        createProduct() {
        this.$api.products
            .createProduct({ order: this.order, ...this.newProduct })
            .then((response) => {
            if (response.status === 201) {
                this.products.push(response.data);
                this.$toast({
                component: ToastificationContent,
                props: {
                    title: "Успешно",
                    text: "Товар добавлен",
                    icon: "CheckCircleIcon",
                    variant: "success",
                },
                });

                this.newProduct = {};

                this.$nextTick(() => {
                this.$bvModal.hide("modal-create-product");
                });
            } else {
                this.$toast({
                component: ToastificationContent,
                props: {
                    title: "Ошибка",
                    text: "Не удалось создать",
                    icon: "XIcon",
                    variant: "danger",
                },
                });
            }
            });
        },
        async updateProduct(idProduct, newVal, key, validate) {
        if (validate) {
            const { valid } = await validate(newVal);
            if (valid) {
                this.fetchUpdateProduct(idProduct, newVal, key);
            }
        } else {
            this.fetchUpdateProduct(idProduct, newVal, key);
        }
        },
        fetchUpdateProduct(id, val, key) {
            let payload = {};
            payload[key] = val;
            this.$api.products.updateProduct(id, payload).then((response) => {
                if (response.status === 200) {
                this.$toast({
                    component: ToastificationContent,
                    props: {
                        title: "Успешно",
                        text: "Товар обновлен",
                        icon: "CheckCircleIcon",
                        variant: "success",
                    },
                });
                } else {
                this.$toast({
                    component: ToastificationContent,
                    props: {
                        title: "Ошибка",
                        text: "Не удалось обновить",
                        icon: "XIcon",
                        variant: "danger",
                    },
                });
                }
            });
        },
        deleteProduct(id) {
        this.$api.products.deleteProduct(id).then((response) => {
            if (response.status === 204) {
            const inx = this.productsList.findIndex((p) => p.id === id);
            this.productsList = this.productsList
                .slice(0, inx)
                .concat(this.productsList.slice(inx + 1));

            this.$toast({
                component: ToastificationContent,
                props: {
                title: "Успешно",
                text: "Товар удален",
                icon: "CheckCircleIcon",
                variant: "success",
                },
            });
            } else {
            this.$toast({
                component: ToastificationContent,
                props: {
                title: "Ошибка",
                text: "Не удалось удалить",
                icon: "XIcon",
                variant: "danger",
                },
            });
            }
        });
        },
    },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
