import { API_AUTH} from "@/lib/utils"

export const getInfoPermission = async (): Promise<string[]> => {
    return await API_AUTH.get(`permissions/`).then(
        (response)  => response.data
    )
    
}