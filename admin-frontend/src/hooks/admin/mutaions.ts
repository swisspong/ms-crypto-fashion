import { createAdmin, deleteAdmin, putAdmin } from "@/src/services/admin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IAdminPlayload) => createAdmin(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["admin"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["admin"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["admin"], context.previousInfos);
                }
            },
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(["admin"]);
            },
        }
    );
};

export const useUpdateAdmin = (id: string | string[] | undefined) => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IPutAdminPlayload) => putAdmin(body, id),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["admin"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["admin"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["admin"], context.previousInfos);
                }
            },
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(["admin"]);
            },
        }
    );
};

export const useDeleteAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (id: string) => deleteAdmin(id),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["admin"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["admin"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["admin"], context.previousInfos);
                }
            },
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(["admin"]);
            },
        }
    );
};