import { getAllCommentById, getRatingMerchant } from "@/src/services/comment.service";
import { useQuery } from "@tanstack/react-query";

export const useAllCommentById = (prodId?: string) => {
    return useQuery(["comments", prodId], () => getAllCommentById(prodId!), {
        keepPreviousData: true,
        enabled: prodId ? true : false
    });
};

export const useRatingMerchantById = (mcht_id?: string) => {
    return useQuery(["rating", mcht_id], () => getRatingMerchant(mcht_id!), {
        enabled: mcht_id ? true : false
    });
};