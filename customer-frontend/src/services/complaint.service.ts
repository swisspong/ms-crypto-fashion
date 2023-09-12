import {  SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
import { TComplaintPlayload } from "../types/complaint";
const api = dynamicApi({ssr: false, service: SERVICE_FORMAT.COMPLAINT})

export const postComplaint = async (body: TComplaintPlayload): Promise<void> => {
    return await api.post(`/complaints`, body).then(
        (response) => response.data
    );
}