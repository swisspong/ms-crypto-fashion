import { ChevronRight, X } from "lucide-react";
import { Store } from "lucide-react";
import IconButton from "../icon-button";
import { Button } from "../ui/button";
import React from "react";
import { useRouter } from "next/router";

interface WishlistItemProps {
    data: IWishlistItem;
}

const WishListItem: React.FC<WishlistItemProps> = ({
    data
}) => {


    const router = useRouter()

    return (

        <div key={data.item_id}>
            <li className="pb-6 border-y list-none flex flex-col space-y-1">

                <div className="mt-4 flex space-x-2 md:space-x-5 relative">

                    <div className="flex items-center self-start space-x-1">

                        <div className="relative h-20 w-20 rounded-md overflow-hidden border sm:h-32 sm:w-32">
                            <img
                                src={data.product.image_urls[0] ? data.product.image_urls[0] : `https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg`}
                                alt=""
                                className="object-cover object-center"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 w-full">
                        <div className="col-span-2">
                            <div className="">
                                <p className="line-clamp-1 font-medium text-sm sm:text-lg">
                                    {data.product.name}
                                </p>
                            </div>
                            <div className="  text-sm sm:text-sm ">
                                <p className="text-muted-foreground line-clamp-1 lg:line-clamp-2">
                                    {data.product.description}
                                </p>
                            </div>
                        </div>
                        
                        <div className=" ">
                            <div className=" text-sm sm:text-lg ">
                                <span>
                                    ฿ {data.product.price}
                                </span>
                            </div>
                            <div className="">
                                <Button className="text-sm mt-2 w-full"
                                    onClick={() => router.push(`merchants/${data.product.merchant.mcht_id}/product/${data.prod_id}`)}
                                >
                                    เพิ่มเติม</Button>
                            </div>
                        </div>
                    </div>


                </div>
            </li >
        </div>

    )
}

export default WishListItem