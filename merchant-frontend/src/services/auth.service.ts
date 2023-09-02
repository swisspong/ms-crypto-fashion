import { API, SERVICE_FORMAT, dynamicApi } from "@/lib/utils";


export const signout = async (): Promise<void> => {
    const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.AUTH })
    await api.post(`/auth/signout`).then(
        (response) => response.data
    );
};