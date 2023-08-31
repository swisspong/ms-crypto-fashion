import { postCartByProdId, pathcCartByItemId, deleteCartByItemId, deleteManyItemInCart } from "@/src/services/cart.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { prodId: string, body: ICartPayload }) => postCartByProdId(data),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["cart"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["cart"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["cart"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["cart"]);
            },
        }
    );
};
export const useEditItemCart = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { itemId: string, body: ICartPayload }) => pathcCartByItemId(data),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["cart"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["cart"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["cart"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["cart"]);
            },
        }
    );
};
export const useRemoveItemInCart = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (itemId: string) => deleteCartByItemId(itemId),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["cart"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["cart"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["cart"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["cart"]);
            },
        }
    );
};
export const useRemoveManyItemInCart = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: IDeleteManyItem) => deleteManyItemInCart(data),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["cart"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["cart"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["cart"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["cart"]);
            },
        }
    );
};