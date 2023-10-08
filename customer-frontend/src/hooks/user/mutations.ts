import { changeEmil, changePasswordUser, resetPassword, sendResetPassword, updateProfileCommon } from "@/src/services/user.service";
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


export const useChangePassword = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IPasswordPayload) => changePasswordUser(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["cahngepass"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["cahngepass"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["cahngepass"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["cahngepass"]);
            },
        }
    );
};


export const useSendEmailResetPassword = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IEmailPayload) => sendResetPassword(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["resetpassword"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["resetpassword"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["resetpassword"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["resetpassword"]);
            },
        }
    );
};


export const useResetPassword = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: {token: string , data: IResetPassPayload}) => resetPassword(body.token, body.data),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["resetpassword"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["resetpassword"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["resetpassword"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["resetpassword"]);
            },
        }
    );
};