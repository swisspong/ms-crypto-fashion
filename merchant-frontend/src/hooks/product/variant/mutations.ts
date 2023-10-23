import { deleteVariant, patchVariant, patchVariantAdvanced, postVariant, putVariant, upsertVariants } from "@/src/services/variant.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpsertVariant = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { prodId: string, body: IVariantPayload }) => upsertVariants(data),
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
export const useEditAdvancedVariant = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { prodId: string, vrntId: string, body: IAdvancedVariant }) => putVariant(data),
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
export const useAddVariant = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { prodId: string, body: IVariant }) => postVariant(data),
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
export const useEditVariant = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { prodId: string, body: IVariant }) => patchVariant(data),
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
export const useEditVariantAdvanced = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { prodId: string, body: IVariant }) => patchVariantAdvanced(data),
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
export const useDeleteVariant = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: { prodId: string, vrntId: string }) => deleteVariant(data),
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