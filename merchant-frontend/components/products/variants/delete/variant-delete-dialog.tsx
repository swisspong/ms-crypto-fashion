import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import React, { FC } from "react";
import useVariantDeleteHook from "./use-variant-delete-hook";
interface Props {
  vrntId: string;
}
const VariantDeleteDialog: FC<Props> = ({ vrntId }) => {
  const { deleteHandler, deleteLoading, open, setOpenHandler } =
    useVariantDeleteHook();
  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpenHandler(open)}>
      <AlertDialogTrigger asChild>
        <Button
          className="grow-0 shrink-0"
          size={"icon"}
          variant={"destructive"}
          type="button"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>คุณแน่ใจจริงๆเหรอ?</AlertDialogTitle>
          <AlertDialogDescription>
            การดำเนินการนี้ไม่สามารถยกเลิกได้ การดำเนินการนี้จะลบอย่างถาวร
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteHandler(vrntId)}>
            ยืนยัน
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VariantDeleteDialog;
