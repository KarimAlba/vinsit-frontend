<template>
	<div style="position: relative;">
		<div v-if="!disabledBtn && !disabledAddBtn" class="addIcon" @click="addClient">
			<b-icon-plus-square style="width: 50px;" ></b-icon-plus-square>
		</div>
		<v-select
			label="name"
			@search="onSearchClients"
			@input="input"
			:options="clients"
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
	import { debounce } from "lodash";
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
		},
		data() {
			return {
				clients: [],
				client: null,
				disabledBtn: true,
				newClientName: '',
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
		methods: {
			onSearchClients(search, loading) {
				if (search.length) {
					this.disabledBtn = true;
					loading(true);
					this.changeSearchValue(search, this);
					this.fetchClients(search, loading, this);
				};
			},
			fetchClients: _.debounce((search, loading, vm) => {
				vm.$api.clients.getClients({ search, limit: 100 }).then((response) => {
					vm.clients = response.data.results;
					loading(false);
				});
			}, 500),
			input(client) {
				this.$emit("input", client);
				this.disabledBtn = true;
			},
			changeSearchValue:_.debounce((clientName, vm)  => {
				vm.newClientName = clientName,
				vm.checkClient();
			}, 500),
			checkClient() {
				if (this.clients.findIndex(
						client => client.name 
							? (
								this.search 
									? client.name.toLowerCase().indexOf(this.search.toLowerCase()) 
									: null
								) 
							: null
						) === -1) {
					this.disabledBtn = false;
				};
			},
			addClient() {
				this.$emit("createClient", this.newClientName);
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
