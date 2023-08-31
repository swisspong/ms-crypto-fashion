import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signin, signout } from "../../services/auth.service";

export const useSignin = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: ISigninPayload) => signin(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["auth"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["auth"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["auth"], context.previousInfos);
                }
            },
            // useErrorBoundary:true,
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(["auth"]);
            },
        }
    );
}

export const useSignout = () => {
    const queryClient = useQueryClient();
    return useMutation(
        () => signout(),
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
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(["me"]);
            },
        }
    );
};