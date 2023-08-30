import { getAdminById } from "@/src/services/admin.service";
import { getInfoCsr } from "@/src/services/auth.service";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetAdminInfo = () => {
    return useQuery(["me"], () => getInfoCsr());
};

