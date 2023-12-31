import { postOmiseToken } from "@/src/services/payment.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";



export const useCreateToken = () => {
    const queryClient = useQueryClient();
    return useMutation((body: ICreateOmiseToken) => postOmiseToken(body), {
        // When mutate is called:
        onMutate: async (info) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(["payment"]);

            // Snapshot the previous value
            const previousInfos = queryClient.getQueryData(["payment"]);

            return { previousInfos };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error: any, variables, context) => {
            // displayError(err.response?.data?.message)
            if (context?.previousInfos) {
                queryClient.setQueryData(["payment"], context.previousInfos);
            }

        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(["payment"]);
        },
    });
};