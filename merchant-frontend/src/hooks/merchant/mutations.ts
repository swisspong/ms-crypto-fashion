import { credentialMerchant, editMerchantProfile, merchantAddAccount, startMerchant } from "@/src/services/merchant.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStartMerchant = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IMerchantStartPayload) => startMerchant(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["me"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["me"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["me"], context.previousInfos);
                }
            },
            // useErrorBoundary:true,
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(["me"]);
            },
        }
    );
};
export const useEditMerchantProfile = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IMerchantProfilePayload) => editMerchantProfile(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["me"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["me"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["me"], context.previousInfos);
                }
            },
            // useErrorBoundary:true,
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(["me"]);
            },
        }
    );
};
export const useCredentialMerchant = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: ICredentialPayload) => credentialMerchant(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["me"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["me"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["me"], context.previousInfos);
                }
            },
            // useErrorBoundary:true,
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(["me"]);
            },
        }
    );
};
export const useAddAccount = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IAccountPayload) => merchantAddAccount(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["me"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["me"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["me"], context.previousInfos);
                }
            },
            // useErrorBoundary:true,
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(["me"]);
            },
        }
    );
};