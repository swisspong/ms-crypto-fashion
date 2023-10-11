import React, { FC, useEffect } from "react";
import { Button } from "../ui/button";
import { useCancelOrder, useRefundOrder } from "@/src/hooks/order/mutations";
import { useRouter } from "next/router";
import {
  useGetMerchantOrderById,
  useGetOneOrderPolling,
} from "@/src/hooks/order/queries";

// interface Props {
//   cancelLoading:boolean
// }
const ButtonRefundOrder = ({}) => {
  const router = useRouter();
  const refund = useRefundOrder();

  const dataQuery = useGetMerchantOrderById(router.query.orderId as string);
  const orderPolling = useGetOneOrderPolling(router.query.orderId as string);
  // useEffect(() => {
  //   console.log(orderPolling.data);
  //   if (orderPolling.isSuccess && orderPolling.data.refetch) {
  //     dataQuery.refetch();
  //     orderPolling.refetch();
  //   }
  // }, [orderPolling.isSuccess, orderPolling.data]);
  useEffect(() => {
    const fetchData = async () => {
      if (refund.isSuccess) {
        orderPolling.refetch();
      }
    };
    fetchData();
  }, [refund.isSuccess]);
  return (
    <Button
      disabled={
        refund.isLoading ||
        dataQuery.isLoading ||
        orderPolling.isLoading ||
        refund.isSuccess
      }
      onClick={() => refund.mutate(router.query.orderId as string)}
      variant={"outline"}
      size={"sm"}
    >
      คืนเงิน
    </Button>
  );
};

export default ButtonRefundOrder;
