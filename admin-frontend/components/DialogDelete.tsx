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
  deleteHandler: () => void;
  isLoading: boolean;
  isSuccess: boolean;
}
const DialogDelete: FC<Props> = ({
  openDialog,
  openDialogHandler,
  //   phoneId,
  deleteHandler,
  isSuccess,
  isLoading,
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
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undo. This will permanently delete.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            onClick={() => {
              //   openDialogHandler(true);
              deleteHandler();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogDelete;
