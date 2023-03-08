// We haven't added icon's computed property because it makes this mixin coupled with UI
export const togglePasswordVisibility = {
  data() {
    return {
      passwordFieldType: 'password',
      repeatPasswordFieldType: 'password',
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
	toggleRepeatPasswordVisibility() {
		this.repeatPasswordFieldType = this.repeatPasswordFieldType === 'password' ? 'text' : 'password';
	},
  },
}

export const _ = null
