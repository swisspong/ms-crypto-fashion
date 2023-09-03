import { API, SERVICE_FORMAT, dynamicApi } from "@/lib/utils";


const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.AUTH })
export const signout = async (): Promise<void> => {
    await api.post(`/auth/signout`).then(
        (response) => response.data
    );
};