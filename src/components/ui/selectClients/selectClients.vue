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
			:value="client"
			:clearSearchOnBlur="() => clearSearchOnBlur"
			:clearable="clearable"
		>
			<template #no-options="{ search }">
				{{ search.length ? "Ничего не найдено" : "Введите запрос" }}
			</template>
		</v-select>
	</div>
</template>

<script>
	import vSelect from "vue-select";
	import _ from "lodash";
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
            company: {
                type: Number,
                required: false,
            },
			clearable: {
				type: Boolean,
				default: true,
			}
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
        watch: {
            'value'() {
                this.getClient(this.value);
                window.setTimeout(() => {
                    this.fetchClients(
                        this.client ? this.client.name : '',
                        null,
                        this,
                        (id) => id,
                    );
                }, 0);
            },
            'company'() {
                this.fetchClients(
                    this.client ? this.client.name : '',
                    null,
                    this,
                    null,
                );
            },
        },
		methods: {
			onSearchClients(search, loading) {
				this.disabledBtn = true;
				if (search.length) {
					// this.disabledBtn = true;
					loading(true);
					this.changeSearchValue(search, this);
					this.fetchClients(search, loading, this);
				};
			},
			fetchClients: _.debounce((search, loading, vm, callback) => {
				vm.$api.clients.getClients({
                    search,
                    limit: 100,
                    ...(
                        vm.company
                            ? {company: vm.company}
                            : {}
                    ),
                }).then((response) => {
					vm.clients = response.data.results;
                    if (vm.clients.length && callback) {
                        callback(vm.clients[0].id);
                    }
					loading ? loading(false) : null;
				});
			}, 500),
            async getClient(id) {
                await this.$api.clients.getClient(id).then((response) => {
					this.client = response.data;
				});
            },
			input(client) {
                console.log('Client - ', client);
				this.$emit("input", client);
				this.disabledBtn = true;
			},
			changeSearchValue:_.debounce((clientName, vm)  => {
				vm.newClientName = clientName;
				vm.checkClient();
			}, 500),
			checkClient() {
				if (this.clients.findIndex(
						client => client.name 
							? (
								this.newClientName 
									? client.name.toLowerCase() === this.newClientName.toLowerCase()
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
		mounted() {
			this.value ? this.getClient(this.value) : null;
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
