import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const API_AUTH = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true
})

export const API_PRODUCT = axios.create({
  baseURL: "http://localhost:8001/",
  withCredentials: true
})

export const API_CART = axios.create({
  baseURL: "http://localhost:8002/",
  withCredentials: true
})

export const API_ORDER = axios.create({
  baseURL: "http://localhost:8003",
  withCredentials: true
})