import axios from 'axios'
import storeMapper from '../mappers/store.mapper'
import { Store } from '../schemas/store.schema'

class StoreService {
  private readonly _token: string
  constructor(token: string) {
    this._token = token
  }

  async getStores(): Promise<Store[]> {
    try {
      const url = `${process.env.REACT_APP_API_BASE }/api/store`
      const responseApi = await axios.get(url, { headers: { authorization: `Bearer ${this._token}` }})
      const response = responseApi.data
      const stores = response.stores.map((store: any) => {
        return storeMapper(store)
      })
      return stores
    } catch (error) {
      throw error
    }
  }

  async save(store: Store): Promise<void> {
    try {
      const url = `${process.env.REACT_APP_API_BASE }/api/store`
      const formData = new FormData()
      formData.append('code', store.code)
      formData.append('name', store.name)
      formData.append('address', store.address)
      formData.append('state', store.state)
      formData.append('county', store.county || '')
      formData.append('postalCode', store.postalCode || '')
      formData.append('list', store.list || '') 

      await axios.post(url, formData, { headers: { authorization: `Bearer ${this._token}` }})

    } catch (error) {
      throw error
    }
  }

  async getStoreList(code: string): Promise<void> {
    try {
      const urlApi = `${process.env.REACT_APP_API_BASE }/api/store/${code}`
      const responseApi = await axios.get(urlApi, { headers: { authorization: `Bearer ${this._token}` }})
      const response = responseApi.data

      const blob = new Blob([response.buffer.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = response.originalname;
      link.click()

      URL.revokeObjectURL(url)
    } catch (error) {
      throw error
    }
  }

  async deleteStore(code: string): Promise<void> {
    try {
      const url = `${process.env.REACT_APP_API_BASE }/api/store/${code}`
      await axios.delete(url, { headers: { authorization: `Bearer ${this._token}` }})
    } catch (error) {
      throw error
    }
  }
}

export default StoreService
