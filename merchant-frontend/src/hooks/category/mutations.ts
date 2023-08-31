
import { deleteCategory, pathCategory, postCategory } from "@/src/services/category.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useAddCategory = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: ICategoryPayload) => postCategory(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["categories"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["categories"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["categories"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["categories"]);
            },
        }
    );
};
export const useEditCategory = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { catId: string, body: ICategoryPayload }) => pathCategory(data),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["categories"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["categories"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["categories"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["categories"]);
            },
        }
    );
};
export const useRemoveCategory = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (catId: string) => deleteCategory(catId),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["categories"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["categories"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["categories"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["categories"]);
            },
        }
    );
};