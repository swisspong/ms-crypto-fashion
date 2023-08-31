interface TCommentPayload {
    comments: TComment[],
    order_id: string
}




interface TComment {
    comment_id: string
    text: string
    product: IProduct
    user: IUserRes
    rating: number
    created_at: string
    message: string
}

interface TCommentResponse {
    page: number,
    per_page: number,
    total: number,
    total_page: number,
    data: TComment[]
}