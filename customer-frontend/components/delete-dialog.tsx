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
  open: boolean;
  openHandler: (open: boolean) => void;
  //   phoneId: number;
  deleteHandler: () => void;
  isLoading: boolean;
  isSuccess: boolean;
}
const DeleteDialog: FC<Props> = ({
  open,
  openHandler,
  //   phoneId,
  deleteHandler,
  isSuccess,
  isLoading,
}) => {
  React.useEffect(() => {
    if (isSuccess) {
      openHandler(false);
    }
  }, [isSuccess]);

  return (
    <AlertDialog open={open} onOpenChange={openHandler}>
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

export default DeleteDialog;
