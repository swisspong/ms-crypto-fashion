import { deleteMerchant, updateApprovesMerchant, updateMerchant } from "@/src/services/merchant.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useApprovesMerchant = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: {id: string | undefined, status:string}) => updateApprovesMerchant(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["merchantsapp"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["merchantsapp"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["merchantsapp"], context.previousInfos);
                }
            },
            // useErrorBoundary:true,
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(["merchantsapp"]);
            },
        }
    );
};

export const useUpdateMerchant = (id: string | undefined | string[]) => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IMerchantPayload) => updateMerchant(body, id!),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["merchant"])

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["merchant"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["merchant"], context.previousInfos);
                }
            },
            // useErrorBoundary:true,
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(["merchant"]);
            },
        }
    );
};

export const useDeleteMerchant = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (id: string) => deleteMerchant(id),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["merchant"])

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["merchant"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["merchant"], context.previousInfos);
                }
            },
            // useErrorBoundary:true,
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(["merchant"]);
            },
        }
    );
};