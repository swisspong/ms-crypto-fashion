import { getInfoPermission } from "@/src/services/permission.service"
import { AxiosError } from "axios"
import { useQuery } from "@tanstack/react-query";

export const useGetPermissionInfo = () => {
    return useQuery(["permission"], () => getInfoPermission(), {
        onError: (error: AxiosError) => {
            console.log(error)
        }
    }
    )
}