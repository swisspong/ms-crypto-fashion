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
import { useRemoveManyItemInCart } from "@/src/hooks/cart/mutations";
interface Props {
  data?: ICartItem[];
}
const RemoveItemAllertDialog: FC<Props> = ({ data }) => {
  const [open, setOpen] = useState<boolean>(false);
  const removeAll = useRemoveManyItemInCart();
  useEffect(() => {
    if (data && data.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [data]);

  useEffect(() => {
    if (removeAll.isSuccess) {
      setOpen(false);
    }
  }, [removeAll.isSuccess]);
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
            onClick={() =>
              removeAll.mutate({
                items: data?.map((item) => item.item_id) ?? [],
              })
            }
          >
            ยืนยัน
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveItemAllertDialog;
