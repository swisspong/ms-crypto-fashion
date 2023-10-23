import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useCancelOrder } from "@/src/hooks/order/mutations";
import { useRouter } from "next/router";
import {
  useGetOrderById,
  useGetOrderByIdPolling,
} from "@/src/hooks/order/queries";
// import {
//   useGetMerchantOrderById,
//   useGetOneOrderPolling,
// } from "@/src/hooks/order/queries";

const ButtonCancelOrder = () => {
  const router = useRouter();
  const cancel = useCancelOrder();
  const dataQuery = useGetOrderById(router.query.orderId as string);
  const orderPolling = useGetOrderByIdPolling(router.query.orderId as string);
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
        cancel.isSuccess
      }
      onClick={() => cancel.mutate(router.query.orderId as string)}
      variant={"destructive"}
      size={"sm"}
    >
      ยกเลิกคำสั่งซื้อ
    </Button>
  );
};

export default ButtonCancelOrder;
