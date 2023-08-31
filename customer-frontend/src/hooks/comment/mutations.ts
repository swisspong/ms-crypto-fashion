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
                await queryClient.cancelQueries(["comment"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["comment"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["comment"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["comment"]);
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
                await queryClient.cancelQueries(["comment"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["comment"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["comment"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["comment"]);
            },
        }
    );
};