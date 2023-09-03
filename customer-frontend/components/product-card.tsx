"use client";

import Image from "next/image";
import { MouseEventHandler } from "react";
import { Expand, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import IconButton from "./icon-button";
import Currency from "./currency";
import { cn } from "@/lib/utils";

interface ProductCard {
  data: IProductRow;
  className?: string;
  pushUrl: string;
}

const ProductCard: React.FC<ProductCard> = ({ data, className, pushUrl }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(pushUrl);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "bg-white group cursor-pointer rounded-xl border p-3 space-y-4",
        className
      )}
    >
      {/* Image & actions */}
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <img
          src={data.image_urls?.[0]}
          alt=""
          className="aspect-square object-cover rounded-md"
        />
        {/* <Image
          src={data.image_urls?.[0]}
          alt=""
          fill
          className="aspect-square object-cover rounded-md"
        /> */}
        {/* <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <IconButton icon={<Expand size={20} className="text-gray-600" />} />
            <IconButton
              icon={<ShoppingCart size={20} className="text-gray-600" />}
            />
          </div>
        </div> */}
      </div>
      {/* Description */}
      <div>
        <p className="font-semibold text-lg">{data.name}</p>
        {/* <p className="text-sm text-gray-500">{data.name}</p> */}
      </div>
      {/* Price & Reiew */}
      <div className="flex items-center justify-between">
        {data.variants.length > 1 ? (
          data.variants
            .reduce(
              (prev: [undefined | number, undefined | number], curr) => {
                prev[0] =
                  prev[0] === undefined || curr.price < prev[0]
                    ? curr.price
                    : prev[0];
                prev[1] =
                  prev[1] === undefined || curr.price > prev[1]
                    ? curr.price
                    : prev[1];
                console.log(prev, curr);
                return prev;
              },
              [undefined, undefined]
            )
            .map((val, index) => (
              <>
                <Currency value={val} />
                {index === 0 ? " ~ " : undefined}
              </>
            ))
        ) : (
          <Currency
            value={
              data.variants.length > 0 ? data.variants[0].price : data?.price
            }
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
