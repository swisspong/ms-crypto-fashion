import { postWishList } from "@/src/services/wishlist.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddToWishlist = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IWishlistPayload) => postWishList(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["wishlist"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["wishlist"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["wishlist"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["wishlist"]);
            },
        }
    );
};