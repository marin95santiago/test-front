import axios from 'axios'
import jwt from 'jwt-decode'
import Cookies from 'js-cookie'
import userMapper from '../mappers/user.mapper'
import { User } from '../schemas/user.schema'

type jwtDecode = {
  data: any
}

class UserService {

  async login(username: string, password: string): Promise<User> {
    try {
      const url = `${process.env.REACT_APP_API_BASE }/api/login`
      const responseApi = await axios.post(url, { username, password })
      const response = responseApi.data
      if (!response.token) throw new Error('Token not suplied')
      const tokenData = jwt<jwtDecode>(response.token)
      const userData = tokenData.data
      userData.token = response.token
      const user = userMapper(userData)
      Cookies.set('auth', response.token)

      return user
    } catch (error) {
      throw error
    }
  }
}

export default UserService
