import { postComment, updateCommentReply } from "@/src/services/comment.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCommnt = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: TCommentPayload) => postComment(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["orders"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["orders"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["orders"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["orders"]);
            },
        }
    );
};

export const useReplyCommnt = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: TReplyPayload) => updateCommentReply(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["comments"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["comments"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["comments"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["comments"]);
            },
        }
    );
};