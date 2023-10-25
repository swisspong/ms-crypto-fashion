import axios from "axios";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API = axios.create({

  baseURL: process.env.NODE_ENV === "production" ? "https://sim24th.com/api/v1" : "http://localhost:5000/api/v1",
  //baseURL: "http://api:8000/v1",
  // baseURL: "http://localhost:8000/v1",
  withCredentials: true
});
export const ssrApi = axios.create({
  // baseURL: process.env.NODE_ENV === "production" ? "http://api:5000/api/v1" : "http://localhost:8000",
  baseURL: process.env.NODE_ENV === "production" ? "http://api:5000/api/v1" : "http://api.cryptofashion.store",
  //baseURL: "http://localhost:8000/v1",
  withCredentials: true
});


export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2)
  return balance
}

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex)
  return chainIdNum
}

export enum SERVICE_FORMAT {
  AUTH = 'auth',
  USER = 'user',
  PRODUCT = 'product',
  CART = 'cart',
  MERCHANT = 'merchant',
  ORDER = 'order',
  CATEGORY = 'category',
  ADDRESS = 'address',
  CHECKOUT = 'checkout',
  COMMENT = 'comment',
  COMPLAINT = 'complaint',
  WISHLIST = 'wishlist'
}
interface DynamicApiOptions {
  ssr: boolean,
  service: SERVICE_FORMAT
}
const urlFactory = (value: SERVICE_FORMAT) => {
  // const csrString = 'http://api.cryptofashion.store'
  const csrString = `${process.env.HOST_API}`
  const ssrString = 'http://'
  switch (value) {
    case SERVICE_FORMAT.AUTH:
      return [csrString, ssrString.concat('auth:8000')]
    case SERVICE_FORMAT.ADDRESS:
      return [csrString, ssrString.concat('auth:8000')]
    case SERVICE_FORMAT.CART:
      return [csrString, ssrString.concat('carts:8002')]
    case SERVICE_FORMAT.MERCHANT:
      return [csrString, ssrString.concat('products:8001')]
    case SERVICE_FORMAT.ORDER:
      return [csrString, ssrString.concat('orders:8003')]
    case SERVICE_FORMAT.PRODUCT:
      return [csrString, ssrString.concat('products:8001')]
    case SERVICE_FORMAT.COMMENT:
      return [csrString, ssrString.concat('products:8001')]
    case SERVICE_FORMAT.USER:
      return [csrString, ssrString.concat('auth:8000')]
    case SERVICE_FORMAT.CATEGORY:
      return [csrString, ssrString.concat('products:8001')]
    case SERVICE_FORMAT.CHECKOUT:
      return [csrString, ssrString.concat('orders:8003')]
    case SERVICE_FORMAT.COMPLAINT:
      return [csrString, ssrString.concat('products:8001')]
    case SERVICE_FORMAT.WISHLIST:
      return [csrString, ssrString.concat('carts:8002')]
    default:
      return [csrString, ssrString.concat('auth:8000')]
  }
}
export const dynamicApi = ({ ssr = false, service }: DynamicApiOptions) => {
  const [csrString, ssrString] = urlFactory(service)
  return axios.create({
    baseURL: ssr ? ssrString : csrString,
    withCredentials: true
  })
}