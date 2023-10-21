<template>
	<div style="position: relative;">
		<v-select
			label="full_name"
			@search="onSearch"
			@input="input"
			:options="users"
			:placeholder="placeholder"
			:filterable="false"
			:disabled="disabled"
			:reduce="reduce"
			:value="user"
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
			productType: {
				type: String,
				default: 'Фулфилмент',
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
				users: [],
				user: null,
				disabledBtn: true,
				newUserName: '',
			};
		},
		components: {
			vSelect,
			BIconPlusSquare,
		},
        watch: {
            'value'() {
                this.getUser(this.value);
                window.setTimeout(() => {
                    this.fetchUsers(
                        this.user ? this.user.name : '',
                        null,
                        this,
                        (id) => id,
                    );
                }, 0);
            },
            'company'() {
                this.fetchUsers(
                    this.user ? this.user.name : '',
                    null,
                    this,
                    null,
                );
            },
        },
		methods: {
			onSearch(search, loading) {
				this.disabledBtn = true;
				if (search.length) {
					// this.disabledBtn = true;
					loading(true);
					this.changeSearchValue(search, this);
					this.fetchUsers(search, loading, this);
				};
			},
			fetchUsers: _.debounce((search, loading, vm, callback) => {
				vm.$api.user.getUsers({
                    search,
                    limit: 100,
                    ...(
                        vm.company
                            ? {company: vm.company}
                            : {}
                    ),
                }).then((response) => {
					vm.users = response.data.results;
                    if (vm.users.length && callback) {
                        callback(vm.users[0].id);
                    }
					loading ? loading(false) : null;
				});
			}, 500),
            async getUser(id) {
                await this.$api.user.getUser(id).then((response) => {
					this.user = response.data;
				});
            },
			input(user) {
                // console.log('user - ', user);
				this.$emit("input", user);
				this.disabledBtn = true;
			},
			changeSearchValue:_.debounce((userName, vm)  => {
				vm.newUserName = userName;
				vm.checkUser();
			}, 500),
			checkUser() {
				if (this.users.findIndex(
                    user => user.name 
							? (
								this.newUserName 
									? user.name.toLowerCase() === this.newUserName.toLowerCase()
									: null
								) 
							: null
						) === -1) {
					this.disabledBtn = false;
				};
			},
			
		},
		mounted() {
			this.value ? this.getUser(this.value) : null;
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
