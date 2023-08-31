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
