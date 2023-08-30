import { API_PRODUCT } from "@/lib/utils";

export const getAllMerchantApproves = async (data: { pageIndex: number, pageSize: number }): Promise<IMerchantResponse> => {
    const result = await API_PRODUCT.get(`merchants/find/approvers?per_page=${data.pageSize}&page=${data.pageIndex + 1}`).then((response) => response.data);
    return result
};

export const getAllMerchants = async (data: { pageIndex: number, pageSize: number }): Promise<IMerchantResponse> => {
    const result = await API_PRODUCT.get(`merchants/?per_page=${data.pageSize}&page=${data.pageIndex + 1}`).then((response) => response.data);
    return result
}

export const updateApprovesMerchant = async (body: { id: string | undefined, status: string }): Promise<void> => {
    return await API_PRODUCT.patch(`merchants/${body.id}/approves`, body).then((response) => response.data);
};

export const getMerchantById = async (userId: string | string[] | undefined): Promise<IMerchant> => {
    return await API_PRODUCT.get(`merchants/${userId}`).then((response) => response.data);
};

export const updateMerchant = async (body: IMerchantPayload, id: string | undefined | string[]): Promise<void> => {
    return await API_PRODUCT.patch(`merchants/${id}`, body).then((response) => response.data)
}

export const deleteMerchant = async (id: string): Promise<void> => {
    return await API_PRODUCT.delete(`merchants/${id}`).then((response) => response.data)
}

export const getDashboardMerchant = async (): Promise<IMerchantDashboardRes> => {
    return await API_PRODUCT.get(`merchants/dashboard`).then((response) => response.data)
}