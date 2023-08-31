import { deleteProduct } from "@/src/services/product.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRemoveProduct = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (prodId: string) => deleteProduct(prodId),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["products"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["products"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["products"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["products"]);
            },
        }
    );
};