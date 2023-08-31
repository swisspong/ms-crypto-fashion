import { deleteCommentById } from "@/src/services/comment.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (id: string) => deleteCommentById(id),
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
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(["comments"]);
            },
        }
    );
};