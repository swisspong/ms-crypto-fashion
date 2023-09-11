import { deleteCheckout, postCheckout, postCheckoutOrder } from "@/src/services/checkout.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCheckout = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: ICheckoutPayload) => postCheckout(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["checkout"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["checkout"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["checkout"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["checkout"]);
            },
        }
    );
};
export const useCheckoutOrdering = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { chktId: string, body: IOrderPayload }) => postCheckoutOrder(data.chktId, data.body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["checkout"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["checkout"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["checkout"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["checkout"]);
            },
        }
    );
};

export const useRemoveCheckout = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (itemId: string) => deleteCheckout(itemId),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["checkout"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["checkout"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["checkout"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["checkout"]);
            },
        }
    );
};