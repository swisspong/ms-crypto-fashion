import { getAllCommentById } from "@/src/services/comment.service";
import { useQuery } from "@tanstack/react-query";

export const useAllCommentById = (prodId?: string) => {
    return useQuery(["comments", prodId], () => getAllCommentById(prodId!), {
        enabled: prodId ? true : false
    });
};