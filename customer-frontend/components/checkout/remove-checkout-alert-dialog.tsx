import React, { FC, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useRemoveCheckout } from "@/src/hooks/checkout/mutations";
import { useRouter } from "next/router";
interface Props {
  data?: ICartItem[];
}
const RemoveCheckoutAlertDialog: FC<Props> = ({ data }) => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const remove = useRemoveCheckout();
  useEffect(() => {
    if (data && data.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [data]);

  useEffect(() => {
    if (remove.isSuccess) {
      setOpen(false);
      router.replace("/cart");
    }
  }, [remove.isSuccess]);
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ข้อมูลสินค้ามีการเปลี่ยนแปลง!</AlertDialogTitle>
          <AlertDialogDescription>
            ข้อมูลสินค้ามีการเปลี่ยนแปลงหรือสินค้าหมดระบบจะทำการลบสินค้า
            กรุณาเลือกสินค้าอีกครั้ง
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => remove.mutate(router.query.chktId as string)}
          >
            ยืนยัน
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveCheckoutAlertDialog;
