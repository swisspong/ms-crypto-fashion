import { API, SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.COMMENT })
export const getAllCommentById = async (prodId: string): Promise<TCommentResponse[]> => {
    return await api.get(`/comments/product/${prodId}`).then(
        (response) => response.data
    );
};

export const postComment = async (body: TCommentPayload): Promise<void> => {
    return await api.post(`/comments`, body).then(
        (response) => response.data
    );
};

export const updateCommentReply = async (body: TReplyPayload): Promise<void> => {
    return await api.patch(`/comments/${body.comment_id}`, body).then(
        (response) => response.data
    )
}