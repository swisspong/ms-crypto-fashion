interface ICartPayload {
    quantity: number;
    vrnt_id?: string
}
interface IDeleteManyItem {
    items: string[]
}
interface ICartResponse {
    items: ICartItem[]
    errorItems: ICartItem[]

}
interface ICartItem {
    item_id: string
    quantity: number
    vrnt_id?: string
    product: IProductRow
    //message?:string
}