import {    SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
const api = dynamicApi({ssr: false, service: SERVICE_FORMAT.COMMENT})
export const getAllComments = async (data: { pageIndex: number, pageSize: number }): Promise<TCommentResponse> => {
    const result = await api.get(`comments/?per_page=${data.pageSize}&page=${data.pageIndex + 1}`).then((response) => response.data);
    return result
};

export const deleteCommentById = async (id: string): Promise<void> => {
    return await api.delete(`comments/${id}`).then((response) => response.data);
};