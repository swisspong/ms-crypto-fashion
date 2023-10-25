import React, { FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
interface Props {
  openDialog: boolean;
  openDialogHandler: (open: boolean) => void;
  //   phoneId: number;
  handler: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  title_alert: string;
}
const DialogAlert: FC<Props> = ({
  openDialog,
  openDialogHandler,
  handler,
  isSuccess,
  isLoading,
  title_alert

}) => {
  React.useEffect(() => {
    if (isSuccess) {
      openDialogHandler(false);
    }
  }, [isSuccess]);

  return (
    <AlertDialog open={openDialog} onOpenChange={openDialogHandler}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>คุณแน่ใจหรือไม่?</AlertDialogTitle>
          <AlertDialogDescription>
            คุณต้องการเปลี่ยนสถานะ {title_alert}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>ยกเลิก</AlertDialogCancel>
          <Button
            onClick={() => {
              handler();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            ดำเนินการต่อ
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogAlert;
