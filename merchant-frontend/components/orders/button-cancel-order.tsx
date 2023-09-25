import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useCancelOrder, useRefundOrder } from "@/src/hooks/order/mutations";
import { useRouter } from "next/router";
import {
  useGetMerchantOrderById,
  useGetOneOrderPolling,
} from "@/src/hooks/order/queries";

const ButtonCancelOrder = () => {
  const router = useRouter();
  const cancel = useCancelOrder();

  const dataQuery = useGetMerchantOrderById(router.query.orderId as string);
  const orderPolling = useGetOneOrderPolling(router.query.orderId as string);

  useEffect(() => {
    const fetchData = async () => {
      if (cancel.isSuccess) {
        orderPolling.refetch();
      }
    };
    fetchData();
  }, [cancel.isSuccess]);
  return (
    <Button
      disabled={
        cancel.isLoading ||
        dataQuery.isLoading ||
        orderPolling.isLoading ||
        orderPolling.data?.refetch ||
        cancel.isSuccess
      }
      onClick={() => cancel.mutate(router.query.orderId as string)}
      variant={"destructive"}
      size={"sm"}
    >
      Cancel Order
    </Button>
  );
};

export default ButtonCancelOrder;
