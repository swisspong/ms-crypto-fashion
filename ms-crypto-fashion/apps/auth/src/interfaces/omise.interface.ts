export interface IOmiseChargeError extends Error {
    object:string;
    code:string;
    message:string;
    
}