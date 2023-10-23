import Image from "next/image";
import { Minus, Plus, Store, X } from "lucide-react";
import Currency from "./currency";
import IconButton from "./icon-button";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useEditItemCart } from "@/src/hooks/cart/mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import EditItemDialog from "./edit-item-dialog";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface CheckoutItemProps {
  data: Item;
  setSelecteds: Dispatch<SetStateAction<string[]>>;
  selecteds: string[];
}

const CheckoutItem: React.FC<CheckoutItemProps> = ({
  data,
  setSelecteds,
  selecteds,
}) => {
  const router =useRouter()
  // const { mutate, isSuccess } = useRemoveCategory();
  const editMutate = useEditItemCart();
  // useEffect(() => {
  //   if (isSuccess) {
  //     toast.success("Remove item success!");
  //   }
  // }, [isSuccess]);
  return (
    <li className="py-6 border-b list-none">
      <div className="flex relative">
        {data.message ? (
          <>
            <div className="absolute inset-0 opacity-75 bg-background z-40 rounded-md flex justify-center items-center"></div>
            <p className="absolute inset-0 flex flex-col justify-center items-center text-sm font-medium text-destructive z-50">
              {data.message}
              <Button onClick={()=>router.push("/cart")}>
                Back to cart
              </Button>
            </p>
          </>
        ) : undefined}
        <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
          <img
          
            src={data.image}
            alt=""
            className="object-cover object-center"
          />
        </div>
        <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
            <div className="flex items-center space-x-2 border p-1 rounded-md">
              <Store size={15} />
              <span className="text-sm">{data.product?.merchant.name}</span>
            </div>
            <div></div>
            <div className="flex justify-between">
              <p className=" text-lg font-semibold text-black">{data.name}</p>
            </div>

            <div className="mt-1 flex text-sm">
              {/* <p className="text-gray-500">
              gfdsf
              </p>
            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
           dffsf   
            </p> */}
            </div>
            {data.vrnt_id ? (
              <div className="col-span-2 flex space-x-2">
                {data.variant?.map((vrnt) => (
                  <Badge>{vrnt.option_name}</Badge>
                ))}
              </div>
            ) : undefined}
            <div className="col-span-2 flex space-x-2">
              <Currency value={data.price} />
              <span>x {data.quantity}</span>
              <span>= {data.total}</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CheckoutItem;
