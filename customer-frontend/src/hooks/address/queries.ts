import { getAddress } from "@/src/services/address.service";
import { useQuery } from "@tanstack/react-query";


export const useMyAddress = () => {
    return useQuery(["address"], () => getAddress());
};
