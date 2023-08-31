interface TCommentPayload {
    comments: TComment[],
    order_id: string
}

interface TComment {
    text: string
    rating: number
    prod_id: string
}


interface TCommentResponse {
    comment_id: string
    text: string
    user: IUserRes
    rating: number
    created_at: string
    message: string
}

interface TReplyPayload {
    comment_id: string
    message: string
}