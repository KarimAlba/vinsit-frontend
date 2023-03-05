import useJwt from '@core/auth/jwt/useJwt'
import axios from '@axios'
import jwtDefaultConfig from '@/@core/auth/jwt/jwtDefaultConfig'

const { jwt } = useJwt(axios, {})
export default jwt
