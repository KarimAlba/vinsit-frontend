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
				<b-img fluid :src="imgUrl" alt="Registration V2" />
			</div>
		</b-col>
		<!-- /Left Text-->

		<!-- Registration-->
		<b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
			<b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
				<b-card-title title-tag="h2" class="font-weight-bold mb-1">
					Welcome to Vinsit! 👋
				</b-card-title>
				<b-card-text class="mb-2">
					Please sign-up to your account and start the adventure
				</b-card-text>

				<!-- form -->
				<validation-observer ref="registrationValidation">
					<b-form class="auth-registration-form mt-2" @submit.prevent>
						<b-form-group label="Username" label-for="registration-username">
							<validation-provider
								#default="{ errors }"
								name="Username"
								rules="required"
							>
								<b-form-input
									id="registration-username"
									v-model="username"
									:state="errors.length > 0 ? false : null"
									name="registration-username"
								/>
								<small class="text-danger">{{ errors[0] }}</small>
							</validation-provider>
						</b-form-group>
						<b-form-group label="Password">
						<!-- <div class="d-flex justify-content-between"> -->
						<!-- <label for="registration-password">Password</label> -->
						<!-- <b-link :to="{ name: 'auth-forgot-password-v2' }">
							<small>Forgot Password?</small>
						</b-link> -->
						<!-- </div> -->
							<validation-provider
								#default="{ errors }"
								name="password"
								rules="required|password|min:8"
							>
								<b-input-group
									class="input-group-merge"
									:class="errors.length > 0 ? 'is-invalid' : null"
								>
									<b-form-input
										id="registration-password"
										v-model="password"
										:state="errors.length > 0 ? false : null"
										class="form-control-merge"
										:type="passwordFieldType"
										name="registration-password"
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
								<small class="text-danger">{{ errors[0] }}</small>
							</validation-provider>
						</b-form-group>
						<b-form-group label="Repeat password">
							<!-- <div class="d-flex justify-content-between"> -->
							<!-- <label for="registration-password">Password</label> -->
							<!-- <b-link :to="{ name: 'auth-forgot-password-v2' }">
								<small>Forgot Password?</small>
							</b-link> -->
							<!-- </div> -->
							<validation-provider
								#default="{ errors }"
								name="Repeat password"
								rules="required|confirmed:password"
							>
								<b-input-group
									class="input-group-merge"
									:class="errors.length > 0 ? 'is-invalid' : null"
								>
									<b-form-input
										id="registration-repeatPassword"
										v-model="repeatPassword"
										:state="errors.length > 0 ? false : null"
										class="form-control-merge"
										:type="repeatPasswordFieldType"
										name="registration-repeatPassword"
										placeholder="············"
									/>
									<b-input-group-append is-text>
										<feather-icon
											class="cursor-pointer"
											:icon="repeatPasswordToggleIcon"
											@click="toggleRepeatPasswordVisibility"
										/>
									</b-input-group-append>
								</b-input-group>
								<small class="text-danger">{{ errors[0] }}</small>
							</validation-provider>
						
						</b-form-group>
						<!-- checkbox -->
						<b-form-group>
							<b-form-checkbox
								id="remember-me"
								v-model="status"
								name="checkbox-1"
							>
								<div v-if="true" :class="{activeCheckbox: !isChosenCheckbox}"></div>
								<b-card-text class="text-center" >
									<span> I agree to </span>
									<b-link to="/policy">
										<span>&nbsp;privacy policy & terms</span>
									</b-link>
								</b-card-text>
							</b-form-checkbox>
						</b-form-group>

						<!-- submit buttons -->
						<b-button
							type="submit"
							variant="primary"
							block
							@click="validationForm"
						>
							Sign up
						</b-button>
					</b-form>
				</validation-observer>

				<b-card-text class="text-center mt-2">
					<span>Already have an account?</span>
					<b-link to='/login'>
						<span>&nbsp;Sign in instead</span>
					</b-link>
				</b-card-text>

				<!-- divider -->
				<div class="divider my-2">
					<div class="divider-text">or</div>
				</div>

				<!-- social buttons -->
				<div class="auth-footer-btn d-flex justify-content-center">
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
				</div>
			</b-col>
	  	</b-col>
	  	<!-- /Registration-->
	</b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from "vee-validate";
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
import { required, min } from "@validations";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import store from "@/store/index";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import useJwt from '@/auth/jwt/useJwt'

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
		ValidationProvider,
		ValidationObserver,
	},
	mixins: [togglePasswordVisibility],
		data() {
			return {
				status: "",
				password: "",
				repeatPassword: "",
				username: "",
				//   sideImg: require("@/assets/images/pages/registration-v2.svg"),
				sideImg: require("@/assets/images/pages/login-v2.svg"),
				// validation rulesimport store from '@/store/index'
				required,
				min,
				isChosenCheckbox: true,
			};
		},
	computed: {
		passwordToggleIcon() {
			return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
		},
		repeatPasswordToggleIcon() {
			return this.repeatPasswordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
		},
		imgUrl() {
		if (store.state.appConfig.layout.skin === "dark") {
			// eslint-disable-next-line vue/no-side-effects-in-computed-properties
			// this.sideImg = require("@/assets/images/pages/registration-v2-dark.svg");
			this.sideImg = require("@/assets/images/pages/login-v2-dark.svg");
			return this.sideImg;
		}
		return this.sideImg;
		},
	},
	watch: {
		status: function() {
			this.isChosenCheckbox = true;
		}
	},	
	methods: {
		validationForm() {
			this.$refs.registrationValidation.validate().then((success) => {
				if (!this.status) {
					this.isChosenCheckbox = false;
					return;
				};
				if (success) {
					this.$api.auth.signUp({full_name: this.username, password: this.password, password2: this.repeatPassword, role: 'AD'})
						.then((response) => {
							if (response.status === 200 || response.status === 201) {
								this.$toast({
									component: ToastificationContent,
									props: {
										title: "Form Submitted",
										icon: "EditIcon",
										variant: "success",
									},
								});
								this.$router.push({ name: 'login' });
								return;
							} else if (response.status === 400) {
								console.log(response.data);
								let errorText = 'Error: ';
								// Check error and notify user
								for (let key in response.data) {
									errorText = errorText + response.data[key].join(' ') + ' ';
								};
								this.$toast({
									component: ToastificationContent,
									props: {
										title: errorText,
										icon: "EditIcon",
										variant: "danger",
									},
								});
							} else {

							}
						})
						
						.catch((error) => {
							console.log(error);
							this.$toast({
								component: ToastificationContent,
								props: {
									title: response.data.detail,
									icon: "EditIcon",
									variant: "danger",
								},
							});
						});
					}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
	@import "@core/scss/vue/pages/page-auth.scss";
	.activeCheckbox {
		position: absolute; 
		top: 0; 
		left: 0; 
		width: 18px; 
		height: 18px; 
		border: 1px solid red; 
		border-radius: 3px;
	}
</style>
