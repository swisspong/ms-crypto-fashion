import { postOrder } from "@/src/services/order.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IOrderPayload) => postOrder(body),
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