import { getInfoCsr } from "@/src/services/user.service";
import { useQuery } from "@tanstack/react-query";

export const useUserInfo = () => {
    return useQuery(["me"], () => getInfoCsr(), {
    });
};
