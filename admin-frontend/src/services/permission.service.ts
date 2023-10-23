import { SERVICE_FORMAT, dynamicApi} from "@/lib/utils"
const api = dynamicApi({ssr: false, service: SERVICE_FORMAT.PERMISSION});
export const getInfoPermission = async (): Promise<string[]> => {
    return await api.get(`permissions/`).then(
        (response)  => response.data
    )
    
}