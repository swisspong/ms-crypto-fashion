import { API_PRODUCT } from "@/lib/utils";

export const getAllComments = async (data: { pageIndex: number, pageSize: number }): Promise<TCommentResponse> => {
    const result = await API_PRODUCT.get(`comments/?per_page=${data.pageSize}&page=${data.pageIndex + 1}`).then((response) => response.data);
    return result
};

export const deleteCommentById = async (id: string): Promise<void> => {
    return await API_PRODUCT.delete(`comments/${id}`).then((response) => response.data);
};