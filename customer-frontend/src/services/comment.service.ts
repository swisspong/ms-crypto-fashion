import { API } from "@/lib/utils";

export const getAllCommentById = async (prodId: string): Promise<TCommentResponse[]> => {
    return await API.get(`/comments/product/${prodId}`).then(
        (response) => response.data
    );
};

export const postComment = async (body: TCommentPayload): Promise<void> => {
    return await API.post(`/comments`, body).then(
        (response) => response.data
    );
};

export const updateCommentReply = async (body: TReplyPayload): Promise<void> => {
    return await API.patch(`/comments/${body.comment_id}`, body).then(
        (response) => response.data
    )
}