
import { deleteCategory, pathCategory, postCategory } from "@/src/services/category.service";
import { deleteProduct, patchProduct, postProduct } from "@/src/services/product.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useAddProduct = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IProductPayload) => postProduct(body),
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
export const useEditProduct = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { prodId: string, body: IProductPayload }) => patchProduct(data),
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