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
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Product information has changed or product out of stock system will be delete them. Please select product again.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={() =>
                            removeAll.mutate({
                                items: data?.map((item) => item.item_id) ?? [],
                            })
                        } >
                        Submit
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default RemoveItemAllertDialog;
