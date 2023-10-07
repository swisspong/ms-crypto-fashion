import { changeEmil, updateProfileCommon } from "@/src/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IProfilePayload) => updateProfileCommon(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["user"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["user"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["user"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["user"]);
            },
        }
    );
};


export const useChangeEmail = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IEmailPayload) => changeEmil(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["useremail"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["useremail"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["useremail"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["useremail"]);
            },
        }
    );
};