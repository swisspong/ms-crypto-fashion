import { deleteGroup, patchGroup, postGroup } from "@/src/services/groups.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useAddGroup = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { prodId: string, body: IGroup }) => postGroup(data),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["product"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["product"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["product"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["product"]);
            },
        }
    );
};
export const useEditGroup = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { prodId: string, body: IGroup }) => patchGroup(data),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["product"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["product"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["product"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["product"]);
            },
        }
    );
};
export const useDeleteGroup = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { prodId: string, vgrpId: string }) => deleteGroup(data.prodId, data.vgrpId),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["product"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["product"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["product"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["product"]);
            },
        }
    );
};