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
  baseURL: process.env.NODE_ENV === "production" ? "http://api:5000/api/v1" : "http://localhost:8000",
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
  ADDRESS = 'address'
}
interface DynamicApiOptions {
  ssr: boolean,
  service: SERVICE_FORMAT
}
const urlFactory = (value: SERVICE_FORMAT) => {
  const csrString = 'http://api.example.com'
  const ssrString = 'http://'
  switch (value) {
    case SERVICE_FORMAT.AUTH:
      return [csrString.concat(''), ssrString.concat('auth:8000')]
    case SERVICE_FORMAT.ADDRESS:
      return [csrString.concat(''), ssrString.concat('auth:8000')]
    case SERVICE_FORMAT.CART:
      return [csrString.concat('/carts'), ssrString.concat('carts:8002')]
    case SERVICE_FORMAT.MERCHANT:
      return [csrString.concat('/merchants'), ssrString.concat('products:8001')]
    case SERVICE_FORMAT.ORDER:
      return [csrString.concat('/orders'), ssrString.concat('orders:8003')]
    case SERVICE_FORMAT.PRODUCT:
      return [csrString.concat(''), ssrString.concat('products:8001')]
    case SERVICE_FORMAT.USER:
      return [csrString.concat(''), ssrString.concat('auth:8000')]
    case SERVICE_FORMAT.CATEGORY:
      return [csrString.concat(''), ssrString.concat('products:8001')]
    default:
      return [csrString.concat(''), ssrString.concat('auth:8000')]
  }
}
export const dynamicApi = ({ ssr = false, service }: DynamicApiOptions) => {
  const [csrString, ssrString] = urlFactory(service)
  return axios.create({
    baseURL: ssr ? ssrString : csrString,
    withCredentials: true
  })
}