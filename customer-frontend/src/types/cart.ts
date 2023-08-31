interface ICartPayload {
    quantity: number;
    vrnt_id?: string
}
interface IDeleteManyItem{
    items:string[]
}
interface ICartItem {
    item_id: string
    quantity: number
    vrnt_id?: string
    product:IProductRow
    message?:string
}