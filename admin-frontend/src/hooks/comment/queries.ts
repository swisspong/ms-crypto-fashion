import { getAllComments } from "@/src/services/comment.service";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useAllComments = (data: { pageIndex: number, pageSize: number }) => {
    return useQuery(["comments", data], () => getAllComments (data), {
        onError: (error: AxiosError) => {
            console.log(error)
        },
        keepPreviousData: true
    });
};