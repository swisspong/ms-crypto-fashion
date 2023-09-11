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
    data?: string
}
const RemoveCheckoutOrderingAlertDialog: FC<Props> = ({ data }) => {
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
            router.replace("/cart")
        }
    }, [remove.isSuccess]);
    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Product information has changed or product out of stock system will be delete your checkout and cart item. Please select product again.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={() => remove.mutate(router.query.chktId as string)}
                    >
                        Submit
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default RemoveCheckoutOrderingAlertDialog;
