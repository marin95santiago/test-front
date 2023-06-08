import Cookies from 'js-cookie'
import jwt from 'jwt-decode'
import userMapper from './mappers/user.mapper'
import { User } from './schemas/user.schema'

interface Coordinate {
  lat: number;
  lng: number;
}

const Utils = {
  getUserByCookieAuth: () : User | undefined => {
    type jwtDecode = {
      data: any
    }
    const token = Cookies.get('auth')

    if (token === undefined) return undefined

    const tokenData = jwt<jwtDecode>(token)
    const user = userMapper(tokenData.data)
    user.token = token
    return user
  },

  removeCookieAuth: () => {
    Cookies.remove('auth')
  },
  
  calculateNearestCoordinate: (coordinates: Coordinate[], mainCoordinate: Coordinate): Coordinate | null => {
    if (coordinates.length === 0) {
      return null;
    }
  
    let nearestCoordinate: Coordinate | null = null;
    let shortestDistance: number = Infinity;
  
    for (const coordinate of coordinates) {
      const distance = Utils.calculateDistance(coordinate, mainCoordinate);
  
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestCoordinate = coordinate;
      }
    }
  
    return nearestCoordinate;
  },
  
  calculateDistance: (coordinate1: Coordinate, coordinate2: Coordinate): number => {
    const latDiff = coordinate2.lat - coordinate1.lat;
    const lngDiff = coordinate2.lng - coordinate1.lng;
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  }
  
}

export default Utils