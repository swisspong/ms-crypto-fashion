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

enum SERVICE_FORMAT {
  AUTH = 'auth',
  USER = 'user',
  PRODUCT = 'product',
  CART = 'cart',
  MERCHANT = 'merchant',
  ORDER = 'order'
}
interface DynamicApiOptions {
  ssr: boolean,
  service: SERVICE_FORMAT
}
const url = (value: SERVICE_FORMAT) => {
  const ssrString = 'http://api.exampl.com'
  const csrString = 'http://localhost:'
  switch (value) {
    case SERVICE_FORMAT.AUTH:
      return [ssrString.concat('/auth'), csrString.concat('8000/auth')]
    case SERVICE_FORMAT.CART:
      return [ssrString.concat('/cart'), csrString.concat('8000/cart')]

      break;
    case SERVICE_FORMAT.MERCHANT:

      break;
    case SERVICE_FORMAT.ORDER:

      break;
    case SERVICE_FORMAT.PRODUCT:

      break;
    case SERVICE_FORMAT.USER:
      return [ssrString.concat('/users'), csrString.concat('8000/users')]


    default:

      break;
  }
}
export const dynamicApi = ({ ssr = false, }: DynamicApiOptions) => {
  axios.create({
    baseURL: ssr ? "http://api.exampl.com" : "http://localhost:8000",
    //baseURL: "http://localhost:8000/v1",
    withCredentials: true
  })
}