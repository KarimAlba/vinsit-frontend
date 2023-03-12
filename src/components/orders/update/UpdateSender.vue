<template>
  <b-card-actions title="Отправитель" actionCollapse>
    <b-row>

      <b-col class="mb-1" cols="12">
        <b-form-group label="Тип контрагента *">
          <v-select
            label="title"
            :reduce="(type) => type.id"
            :options="clientType"
            :clearable="false"
            v-model="order.sender_counterparty_type"
            :disabled="readOnly"
            @input="changeOrder($event, 'sender_counterparty_type')"
          />
        </b-form-group>
      </b-col>

      <b-col class="mb-1" cols="12">
        <b-form-group label="Город">
          <select-cities
            v-model="order.sender_city"
            :disabled="readOnly"
            @input="changeOrder($event, 'sender_city')"
          />
        </b-form-group>
      </b-col>

      <b-col class="mb-1" cols="12">
        <b-form-group label="Наименование контрагента *">
          <select-clients
            :reduce="(client) => client.id"
            v-model="order.sender_counterparty"
            :disabled="readOnly"
            @input="changeOrder($event, 'sender_counterparty')"
			@createClient="(name) => handleClientCreation(name)"
			:clearSearchOnBlur="true"
          />
        </b-form-group>
      </b-col>

      <b-col cols="12">
        <b-form-group label="ФИО *">
          <b-form-input
            v-model="order.sender_full_name"
            :disabled="readOnly"
            @change="changeOrder($event, 'sender_full_name')"
          />
        </b-form-group>
      </b-col>

      <b-col cols="12">
        <b-form-group label="Адрес">
          <b-form-textarea
            rows="3"
            max-rows="6"
            v-model="order.sender_address"
            :disabled="readOnly"
            @change="changeOrder($event, 'sender_address')"
          ></b-form-textarea>
        </b-form-group>
      </b-col>

      <b-col cols="12" md="4">
        <b-form-group label="Серия паспорта">
            <b-form-input
                v-model="order.sender_passport_series"
                :disabled="readOnly"
                @change="changeOrder($event, 'sender_passport_series')"
                type="number"
                max="4"
                :formatter="serieFormatter"
            />
        </b-form-group>
      </b-col>

      <b-col cols="12" md="4">
        <b-form-group label="Номер паспорта">
            <b-form-input
                v-model="order.sender_passport_no"
                :disabled="readOnly"
                @change="changeOrder($event, 'sender_passport_no')"
                type="number"
                max="6"
                :formatter="passportNumberFormatter"
            />
        </b-form-group>
      </b-col>

      <b-col
        cols="12"
      >
        <validation-provider #default="{ errors }" rules="required">
          <b-form-group
            :invalid-feedback="errors[0]"
            label="Телефоны *"
          >
          <b-row class="">
            <b-col class="text-center text-white border border-dark bg-secondary py-1" cols="8">
              Номер телефона
            </b-col>
            <b-col class="text-center text-white border border-dark bg-secondary font-weight-bold plus" cols="4" @click="addPhone('sender')">
              +
            </b-col>
          </b-row>
          <b-row 
            v-for="(phone, i) in order.sender_phones"
            :key="i"
          >
            <b-col class=" border border-secondary px-0" cols="8">
              <b-form-input
                v-model="phone.phone_number"
                :state="errors.length > 0 ? false : null"
                v-maska
                placeholder="+71234567890"
                data-maska="+7##########"
              />
            </b-col>
            <b-col class="text-center border border-secondary" cols="4" @click="deletePhone('sender', i)">
              <b-icon icon="trash"></b-icon>
            </b-col>
          </b-row>
          </b-form-group>
        </validation-provider>
      </b-col>
      
      <!-- <b-col
        v-for="(phone, i) in order.sender_phones"
        :key="i"
        cols="12"
        md="4"
      >
        <validation-provider #default="{ errors }" rules="required">
          <b-form-group :invalid-feedback="errors[0]" label="Номер телефона">
            <b-form-input
              v-model="phone.phone_number"
              :disabled="readOnly"
              :state="errors.length > 0 ? false : null"
              v-maska
              placeholder="+71234567890"
              data-maska="+7##########"
            ></b-form-input>
          </b-form-group>
        </validation-provider>
      </b-col> -->
    </b-row>
  </b-card-actions>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email, confirmed, password } from "@validations";
import { vMaska } from "maska";

import SelectCities from "@/components/ui/selectCities/selectCities.vue";
import SelectClients from "@/components/ui/selectClients/selectClients.vue";
import vSelect from "vue-select";
import BCardActions from "@/@core/components/b-card-actions/BCardActions.vue";

import {
  BOverlay,
  BRow,
  BCol,
  BCard,
  BFormInput,
  BFormGroup,
  BFormTextarea,
  BIcon,
  BIconTrash,
} from "bootstrap-vue";

export default {
  components: {
		ValidationProvider,
    BOverlay,
    BRow,
    BCol,
    BCard,
    BFormInput,
    BFormGroup,
    BFormTextarea,
    BIcon,
    BIconTrash,

    SelectCities,
    SelectClients,
    vSelect,
    BCardActions,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
    readOnly: false,
  },
  data: () => ({
	newUser: {
		INN: '',
		address: '',
		bank_account: '',
		city: '',
		client_phones: [],
		email: '',
		// id: null,
		name: '',
		passport_no: '', 
		passport_series: '',
		position: '',
		type: null,
		web: '',
	},
	creationError: {
		creationErrorSender: false,
		creationErrorRecipient: false,
	},
  }), 
  computed: {
    ...mapGetters({
      clientType: "moduleClients/getClientType",
    }),
  },
  methods: {
	...mapMutations({
      setSender: "moduleOrders/setOrderSender",
	  setRecipient: "moduleOrders/setOrderRecipient",
    }),
    serieFormatter(value) {
        if (!value) {
            return null;
        }
        return Number(String(value).substring(0, 4));
    },
    passportNumberFormatter(value) {
            if (!value) {
            return null;
        }
        return Number(String(value).substring(0, 6));
    },
    changeOrder(newVal, key) {
      let payload = {};
      payload[key] = newVal;

      this.$api.orders.updateOrder(this.order.id, payload).then((response) => {
        if (response.status !== 400) {
			if (key === 'sender_counterparty') {
				// if (this.order.sender_counterparty) {
				// 	this.setSender({
				// 		id: response.data.sender_counterparty,
				// 		name: this.newUser.name,
				// 	});
				// }
				this.$emit('updateSender');
				this.newUser.name = '';
				this.newUser.type = '';
				this.newUser.client_phones.pop();
			}
			// else if (key === ) {
			// 	this.setRicipient({
			// 		id: response.data.recipient_counterparty,
			// 		name: newUser.name
			// 	});
			// }
			this.$toast({
				component: ToastificationContent,
				props: {
					title: "Успешно",
					text: "Информация изменена",
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
	addClient() {
		this.$api.clients.addNewClient(this.newUser)
			.then((response) => {
				console.log('response - ', response);
				// this.order['sender_id'] = response.data.id;
				if (response.status > 203) {
					return;
				}
				this.changeOrder(response.data.id, 'sender_counterparty');
				this.creationError.creationErrorSender = false;
			})
			.catch((error) => {console.log('error - ', error)})
	},
	handleClientCreation(clientName) {
		this.newUser = {
			INN: '',
			address: this.order.sender_address,
			bank_account: '',
			city: this.order.sender_city ? this.order.sender_city.id : null,
			client_phones: [],
			email: '',
			// id: null,
			name: clientName.trim(),
			passport_no: this.order.sender_passport_no, 
			passport_series: this.order.sender_passport_series,
			position: '',
			type: this.order.sender_counterparty_type,
			web: '',
		};
		if ((!this.newUser.type) && (this.newUser.name) && (!this.newUser.client_phones.length)) {
			this.creationError.creationErrorSender = true;
			return;
		};
		this.addClient();
	},
  addPhone(name) {
    if (this.order[name + '_phones'][0].phone_number){
      this.order[name + '_phones'].unshift({});
    }
  },
  deletePhone(name, id) {
    this.order[name + '_phones'].splice(id, 1);
    if (this.order[name + '_phones'].length == 0){
      this.order[name + '_phones'].unshift({});
    }
  },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";


.plus {
		font-size: 35px;
}
.bi-trash {
  width: 30px;
  height: auto;
  margin-top: 5px;
}

.selectType {
  color: red;
  border: 2px solid red; 
  border-radius: 4px;
};
</style>
