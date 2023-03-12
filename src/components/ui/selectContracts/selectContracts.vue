<template>
	<div style="position: relative;">
		<div v-if="!disabledBtn && !disabledAddBtn" class="addIcon" @click="addContract">
			<b-icon-plus-square style="width: 50px;" ></b-icon-plus-square>
		</div>
		<v-select
			label="name"
			@search="onSearchContracts"
			@input="input"
			:options="contracts"
			:placeholder="placeholder"
			:filterable="false"
			:disabled="disabled"
			:reduce="reduce"
			v-model="inputVal"
			:clearSearchOnBlur="() => clearSearchOnBlur"
		>
			<template #no-options="{ search }">
				{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
			</template>
		</v-select>
	</div>
</template>

<script>
	import vSelect from "vue-select";
	import { BIconPlusSquare } from 'bootstrap-vue'

	export default {
		props: {
			placeholder: {
				type: String,
			},
			disabled: {
				type: Boolean,
				default: false,
			},
			reduce: {
				type: Function,
			},
			value: {
				type: [Number, String, Object],
			},
			disabledAddBtn: {
				type: Boolean,
				default: false,
			},
			clearSearchOnBlur: {
				type: Boolean,
				default: false,
			},
            payerId: {
                type: Number,
                default: null
            },
		},
		data() {
			return {
				contracts: [],
				contract: null,
				disabledBtn: true,
				newContract: '',
			};
		},
		components: {
			vSelect,
			BIconPlusSquare,
		},
		computed: {
			inputVal: {
				get() {
					console.log(this.value);
					return this.value;
				},
				set(val) {
					this.$emit("input", val);
				},
			},
		},
        watch: {
            'payerId'() {
                this.fetchContracts('', null, this);
            },
        },
		methods: {
			onSearchContracts(search, loading) {
				this.disabledBtn = true;
				if (search.length) {
					// this.disabledBtn = true;
					loading(true);
					this.changeSearchValue(search, this);
					this.fetchContracts(search, loading, this);
				};
			},
			fetchContracts: _.debounce(
                (search, loading, vm) => {
                    vm.$api.clients.getClientContracts(vm.payerId).then((response) => {
                        const result = response.data
                            .filter((result) => result.contract.includes(search))
                            .map(elem => elem.contract);
                        vm.contracts = result;
                        !result.length ? vm.disabledBtn = false : vm.disabledBtn = true;
                        loading ? loading(false) : null;
                    });
                },
                500
            ),
			input(contract) {
				this.$emit("input", contract);
				this.disabledBtn = true;
			},
			changeSearchValue:_.debounce((contract, vm)  => {
				vm.newContract = contract;
				vm.checkContract();
			}, 500),
			checkContract() {
				if (this.contracts.findIndex(
						cont => cont.contract 
							? (
								this.newContract 
									? this.contract.toLowerCase() === this.newContract.toLowerCase()
									: null
								) 
							: null
						) === -1) {
					this.disabledBtn = false;
				};
			},
			addContract() {
				this.$emit("createContract", this.newContract);
			},
			
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";
	.addIcon{
		position: absolute; 
		top: 10px; 
		right: 40px;
		z-index: 5;
	}
</style>
