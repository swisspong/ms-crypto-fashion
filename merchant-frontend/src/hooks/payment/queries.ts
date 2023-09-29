import { getPayementRecipient, getPayementReport, getPayementStatistic } from "@/src/services/payment.service";
import { useQuery } from "@tanstack/react-query";






export const usePaymentReport = () => {
    return useQuery(["payment"], () => getPayementReport());
};
export const useGetRecipient = (recpId?: string) => {
    return useQuery(["recipient-payment"], () => getPayementRecipient(recpId!), {
        enabled: recpId ? true : false
    });
};
export const usePaymentStatistic = () => {
    return useQuery(["payment-statistic"], () => getPayementStatistic());
};