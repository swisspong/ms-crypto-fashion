import { dynamicApi, SERVICE_FORMAT } from "@/lib/utils";
const api = dynamicApi({ssr: false, service: SERVICE_FORMAT.COMPLAINT})
export const getAllComplaints = async (data: { pageIndex: number, pageSize: number }): Promise<IComplaintResponse> => {
    const result = await api.get(`complaints?per_page=${data.pageSize}&page=${data.pageIndex + 1}`).then((response) => response.data);
    return result
};

export const updateComplaint = async (body: IComplaintPayload): Promise<void> => {
    return await api.patch(`complaints/${body.id}`, body).then((response) => response.data)
}