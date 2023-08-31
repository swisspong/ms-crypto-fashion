import { updateComplaint } from "@/src/services/complaint.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateComplaint = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: IComplaintPayload) => updateComplaint(body),
        {
            // When mutate is called:
            onMutate: async (info) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(["complaint"])

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
            // useErrorBoundary:true,
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(["complaint"]);
            },
        }
    );
};