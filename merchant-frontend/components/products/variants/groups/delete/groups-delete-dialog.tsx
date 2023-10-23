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
import useGroupsDeleteHook from "./use-groups-delete-hook";
interface Props {
  vgrpId: string;
}
const GroupsDeleteDialog: FC<Props> = ({ vgrpId }) => {
  const { deleteHandler, open, setOpenHandler, deleteLoading } =
    useGroupsDeleteHook();
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
          <AlertDialogAction onClick={() => deleteHandler(vgrpId)}>
            ยืนยัน
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GroupsDeleteDialog;
