<template>
  	<div class="auth-wrapper auth-v2">
		<b-row class="auth-inner m-0">
			<!-- Brand logo-->
			<b-link class="brand-logo">
				<logo />
				<h2 class="brand-text text-primary ml-1">Vinsit</h2>
			</b-link>
			<!-- /Brand logo-->

			<!-- Left Text-->
			<b-col lg="8" class="d-none d-lg-flex align-items-center p-5">
				<div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
					<b-img fluid :src="imgUrl" alt="Login V2" />
				</div>
			</b-col>
			<!-- /Left Text-->

			<!-- Login-->
			<b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
				<b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
					<b-card-title title-tag="h2" class="font-weight-bold mb-1">
						Добро пожаловать в Винсит-Директ! 👋
					</b-card-title>
					<b-card-text class="mb-2">
						Пожалуйста выполните вход в аккаунт
					</b-card-text>

					<!-- form -->
					<!-- <validation-observer ref="loginValidation"> -->
					<b-form class="auth-login-form mt-2" @submit.prevent>
						<!-- email -->
						<b-form-group label="Логин" label-for="login-email">
							<!-- <validation-provider
							#default="{ errors }"
							name="Email"
							rules="required|email"
							> -->
							<b-form-input
								id="login-email"
								v-model="userEmail"
								
								name="login-email"
								placeholder="Андрей"
							/>
							<!-- <small class="text-danger">{{ errors[0] }}</small> -->
							<!-- </validation-provider> -->
						</b-form-group>

						<!-- forgot password -->
						<b-form-group>
							<div class="d-flex justify-content-between">
								<label for="login-password">Пароль</label>
								<!-- <b-link to="/forgotPassword">
									<small>Forgot Password?</small>
								</b-link> -->
							</div>
							<!-- <validation-provider
							#default="{ errors }"
							name="Password"
							rules="required"
							> -->
							<b-input-group
								class="input-group-merge"
							>
								<b-form-input
									id="login-password"
									v-model="password"
									
									class="form-control-merge"
									:type="passwordFieldType"
									name="login-password"
									placeholder="············"
								/>
								<b-input-group-append is-text>
									<feather-icon
										class="cursor-pointer"
										:icon="passwordToggleIcon"
										@click="togglePasswordVisibility"
									/>
								</b-input-group-append>
							</b-input-group>
							<!-- <small class="text-danger">{{ errors[0] }}</small> -->
							<!-- </validation-provider > -->
						</b-form-group>

						<!-- checkbox -->
						<!-- <b-form-group>
							<b-form-checkbox
								id="remember-me"
								v-model="status"
								name="checkbox-1"
							>
								Remember Me
							</b-form-checkbox>
						</b-form-group> -->

						<!-- submit buttons -->
						<b-button
							type="submit"
							variant="primary"
							block
							@click="validationForm"
						>
							Войти
						</b-button>
					</b-form>
					<!-- </validation-observer> -->

					<!-- <b-card-text class="text-center mt-2">
						<span>New on our platform? </span>
						<b-link to="/registration">
							<span>&nbsp;Create an account</span>	
						</b-link>
					</b-card-text> -->

					<!-- divider -->
					<!-- <div class="divider my-2">
						<div class="divider-text">or</div>
					</div> -->

					<!-- social buttons -->
					<!-- <div class="auth-footer-btn d-flex justify-content-center">
						<b-button variant="facebook" href="javascript:void(0)">
							<feather-icon icon="FacebookIcon" />
						</b-button>
						<b-button variant="twitter" href="javascript:void(0)">
							<feather-icon icon="TwitterIcon" />
						</b-button>
						<b-button variant="google" href="javascript:void(0)">
							<feather-icon icon="MailIcon" />
						</b-button>
						<b-button variant="github" href="javascript:void(0)">
							<feather-icon icon="GithubIcon" />
						</b-button>
					</div> -->
				</b-col>
			</b-col>
			<!-- /Login-->
		</b-row>
  	</div>
</template>

<script>
/* eslint-disable global-require */
// import { ValidationProvider, ValidationObserver } from "vee-validate";
import Logo from "@core/layouts/components/Logo.vue";
import {
	BRow,
	BCol,
	BLink,
	BFormGroup,
	BFormInput,
	BInputGroupAppend,
	BInputGroup,
	BFormCheckbox,
	BCardText,
	BCardTitle,
	BImg,
	BForm,
	BButton,
} from "bootstrap-vue";
// import { required, email } from "@validations";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import store from "@/store/index";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import useJwt from '@/auth/jwt/useJwt';

export default {
	components: {
		BRow,
		BCol,
		BLink,
		BFormGroup,
		BFormInput,
		BInputGroupAppend,
		BInputGroup,
		BFormCheckbox,
		BCardText,
		BCardTitle,
		BImg,
		BForm,
		BButton,
		Logo,
		// ValidationProvider,
		// ValidationObserver,
	},
	mixins: [togglePasswordVisibility],
	data() {
		return {
			status: "",
			password: "",
			userEmail: "",
			sideImg: require("@/assets/images/pages/login-v2.svg"),
			// validation rulesimport store from '@/store/index'
			//   required,
			//   email,
		};
	},
	computed: {
		passwordToggleIcon() {
			return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
		},
		imgUrl() {
			if (store.state.appConfig.layout.skin === "dark") {
				// eslint-disable-next-line vue/no-side-effects-in-computed-properties
				this.sideImg = require("@/assets/images/pages/login-v2-dark.svg");
				return this.sideImg;
			};
		return this.sideImg;
		},
	},
	methods: {
		validationForm() {
			// this.$refs.loginValidation.validate().then((success) => {
				// if (success) {
					if (this.userEmail == '' || this.password == '') {
						this.$toast({
							component: ToastificationContent,
							props: {
								title: "Fields cannot be empty",
								icon: "EditIcon",
								variant: "danger",
							},
						});
						return
					}
					this.$api.auth.signIn(this.userEmail, this.password)
						.then((response) => {
							console.log(response);
							if (response.status === 200) {
								useJwt.setToken(response.data.access);
								useJwt.setRefreshToken(response.data.refresh);
								useJwt.setTokenLifetime(response.data.access_token_lifetime);
                                localStorage.setItem('role', response.data.role);
                                localStorage.setItem('user_name', this.userEmail);
		                        store.commit('app/UPDATE_USER_DATA', {
                                    name: this.userEmail,
                                    role: response.data.role,
                                });
								this.$toast({
									component: ToastificationContent,
									props: {
                                        title: "Form Submitted",
                                        icon: "EditIcon",
                                        variant: "success",
									},
								});
								this.$router.push({ name: 'orders' });
								return;
							}
							this.$toast({
								component: ToastificationContent,
								props: {
									title: response.data.detail,
									icon: "EditIcon",
									variant: "danger",
								},
							});
						})
						.catch((error) => {
							console.log(error)
							this.$toast({
								component: ToastificationContent,
								props: {
									title: response.data.detail,
									icon: "EditIcon",
									variant: "danger",
								},
							});
						});
				// }
			// });
		},
	},
};
</script>

<style lang="scss" scoped>
	@import "@core/scss/vue/pages/page-auth.scss";
</style>
