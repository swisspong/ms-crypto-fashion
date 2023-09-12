import { postComplaint } from "@/src/services/complaint.service";
import { TComplaintPlayload } from "@/src/types/complaint";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateComplaint = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: TComplaintPlayload) => postComplaint(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["complaint"]);

                // Snapshot the previous value
                const previousInfos = queryClient.getQueryData(["complaint"]);

                return { previousInfos };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err: any, variables, context) => {
                // displayError(err.response?.data?.message)
                if (context?.previousInfos) {
                    queryClient.setQueryData(["complaint"], context.previousInfos);
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(["complaint"]);
            },
        }
    );
};