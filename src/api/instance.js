
import Vue from 'vue';
import axios from "axios";

import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import useJwt from '@/auth/jwt/useJwt';
import jwtDefaultConfig from '@/@core/auth/jwt/jwtDefaultConfig';

export default class Instance {
	// Will be used by this service for making API calls
	axiosIns = null;
  
	// For Refreshing Token
	isAlreadyFetchingAccessToken = false;

	// jwtConfig <= Will be used by this service
	jwtConfig = { ...jwtDefaultConfig };
  
	// For Refreshing Token
	subscribers = [];
  
	constructor() {
		this.axiosIns = axios.create({
			baseURL: process.env.VUE_APP_API_URL,
			validateStatus: (status) => status < 500,
			withCredentials: false,
		});
	
		// Request Interceptor
		this.axiosIns.interceptors.request.use(
			config => {
				// Get token from localStorage
				const accessToken = useJwt.getToken();
		
				// If token is present add it to request's Authorization Header
				if (accessToken) {
					// eslint-disable-next-line no-param-reassign
					config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
				}
				return config
			},
			error => Promise.reject(error),
		)
	
		// Add request/response interceptor
		this.axiosIns.interceptors.response.use(
			response => response,
			error => {
				// const { config, response: { status } } = error
				const { config, response } = error
				const originalRequest = config
		
				// if (status === 401) {
				if (response && response.status === 401) {
					if (!this.isAlreadyFetchingAccessToken) {
					this.isAlreadyFetchingAccessToken = true
					this.refreshToken().then(r => {
						this.isAlreadyFetchingAccessToken = false
		
						// Update accessToken in localStorage
						useJwt.setToken(r.data.accessToken)
						useJwt.setRefreshToken(r.data.refreshToken)
		
						this.onAccessTokenFetched(r.data.accessToken)
					})
					}
					const retryOriginalRequest = new Promise(resolve => {
					this.addSubscriber(accessToken => {
						// Make sure to assign accessToken according to your response.
						// Change Authorization header
						originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
						resolve(this.axiosIns(originalRequest))
					})
					})
					return retryOriginalRequest
				}
				if (statusCode >= 500) {
					Vue.$toast(
						{
							component: ToastificationContent,
							props: {
								title: "Ошибка",
								text: "Ошибка при загрузке данных",
								icon: "EditAlertCircle",
								variant: "danger",
							},
						}
					)
				}
				return Promise.reject(error)
				},
			)
		}
	
		onAccessTokenFetched(accessToken) {
			this.subscribers = this.subscribers.filter(callback => callback(accessToken))
		}
	
		addSubscriber(callback) {
			this.subscribers.push(callback)
		}
	
		login(...args) {
			return this.axiosIns.post(this.jwtConfig.loginEndpoint, ...args)
		}
	
		register(...args) {
			return this.axiosIns.post(this.jwtConfig.registerEndpoint, ...args)
		}
	
		refreshToken() {
			return this.axiosIns.post(this.jwtConfig.refreshEndpoint, {
				refreshToken: useJwt.getRefreshToken(),
			})
		}

		getAxiosIns() {
			return this.axiosIns;
		}
	}
  