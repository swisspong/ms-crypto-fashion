import { deleteAddress, patchAddress, postAddress } from "@/src/services/address.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IAddressPayload) => postAddress(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["address"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["address"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["address"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["address"]);
            },
        }
    );
};

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: {id: string, data: IAddressPayload}) => patchAddress(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["address"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["address"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["address"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["address"]);
            },
        }
    );
};

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (id: string) => deleteAddress(id),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["address"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["address"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["address"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["address"]);
            },
        }
    );
};