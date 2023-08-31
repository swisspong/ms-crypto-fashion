import { getAllComplaints } from "@/src/services/complaint.service";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetAllComplaints = (data: { pageIndex: number, pageSize: number }) => {
    return useQuery(["complaint", data], () => getAllComplaints (data), {
        onError: (error: AxiosError) => {
            console.log(error)
        },
        keepPreviousData: true
    });
};
