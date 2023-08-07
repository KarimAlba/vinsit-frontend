<template>
	<div style="position: relative;">
		<div v-if="!disabledBtn && !disabledAddBtn" class="addIcon" @click="addContract">
			<b-icon-plus-square style="width: 50px;" ></b-icon-plus-square>
		</div>
		<v-select
			label="contract"
			@search="onSearchContracts"
			@input="input"
			:options="contracts"
			:placeholder="placeholder"
			:filterable="false"
			:disabled="disabled"
			:reduce="reduce"
			:value="contract"
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
    import _ from 'lodash';

	export default {
		props: {
			placeholder: {
				type: String,
			},
			disabled: {
				type: Boolean,
				default: false,
			},
			disabledDefaultValue: {
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
			debounceOff: {
				type: Boolean,
				default: false,
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
        watch: {
            'value'() {
                this.fetchContracts(
                    '',
                    null,
                    this,
                    null,
                    (cont) => this.contract = cont,
                );
            },
            'payerId'() {
                this.fetchContracts(
                    '',
                    null,
                    this,
                    (contract) => {
                        this.contract = contract;
                        this.input(contract ? contract.id : null);
                    },
                );
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
			fetchContractsDebounced: _.debounce(
                (search, loading, vm, callback, initCallback) => {
                    vm.$api.clients.getClientContracts(vm.payerId).then((response) => {
                        loading ? loading(false) : null;
                        if (response.status > 203) {
                            return;
                        }
                        const result = response.data
                            .filter((result) => result.contract.includes(search));
                        vm.contracts = result;
                        if (callback) {
                            const selected = result.find(res => res.id === vm.value);
                            const defaultValue = result.length ? result[0] : null;
                            callback(selected || (!vm.disabledDefaultValue ? defaultValue : null));
                        }
                        if (initCallback) {
                            const selected = result.find(res => res.id === vm.value);
                            initCallback(selected || null);
                        }
                        !result.length ? vm.disabledBtn = false : vm.disabledBtn = true;
                    });
                },
                500
            ),
			fetchCallback(search, loading, vm, callback, initCallback) {
				vm.$api.clients.getClientContracts(vm.payerId).then((response) => {
					loading ? loading(false) : null;
					if (response.status > 203) {
						return;
					}
					const result = response.data
						.filter((result) => result.contract.includes(search));
					vm.contracts = result;
					if (callback) {
						const selected = result.find(res => res.id === vm.value);
						const defaultValue = result.length ? result[0] : null;
						callback(selected || (!vm.disabledDefaultValue ? defaultValue : null));
					}
					if (initCallback) {
						const selected = result.find(res => res.id === vm.value);
						initCallback(selected || null);
					}
					!result.length ? vm.disabledBtn = false : vm.disabledBtn = true;
				});
			},
			fetchContracts(search, loading, vm, callback, initCallback) {
				!this.debounceOff
					? this.fetchContractsDebounced(search, loading, vm, callback, initCallback)
					: this.fetchCallback(search, loading, vm, callback, initCallback)
			},
			input(id) {
				this.$emit("input", id);
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
								this.newContract && cont.contract
									? cont.contract.toLowerCase() === this.newContract.toLowerCase()
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
		mounted() {
			if (this.debounceOff) {
				this.fetchContracts(
					'',
					null,
					this,
					(contract) => {
						this.contract = contract;
						this.input(contract ? contract.id : null);
					},
				);
			}
			this.payerId 
				? this.fetchContracts(
                    '',
                    null,
                    this,
                    (contract) => {
                        this.contract = contract;
                        this.input(contract ? contract.id : null);
                    },
                )
				: null;

		}
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
