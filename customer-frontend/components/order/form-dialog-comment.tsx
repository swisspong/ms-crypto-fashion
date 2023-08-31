import React, { FC, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import Rating from "./rating";
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  openHandler: (open: boolean) => void;
  data: Item[],
  commentHandler: (body: TComment[]) => void;
  isLoading: boolean;
  isSuccess: boolean;
}

interface RatingChangeEvent {
  productId: string;
  rating: number;
}

interface InputField {
  name: string;
  label: string;
  type: string;
}

interface FormData {
  [key: string]: string | number;
}

const FormCommentDialog: FC<Props> = ({
  open,
  openHandler,
  data,
  commentHandler,
  isSuccess,
  isLoading,
}) => {


  //  Set State
  const [productRatings, setProductRatings] = useState<Record<string, number>>(
    {}
  );

  const [isRating, setIsRating] = useState<boolean>(true)

  const [formData, setFormData] = useState<FormData>({});


  const handleRatingChange = ({ productId, rating }: RatingChangeEvent) => {
    setProductRatings((prevRatings) => ({
      ...prevRatings,
      [productId]: rating,
    }));
  };

  // on input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const reviews: TComment[] = await Object.keys(productRatings).map((prod_id) => ({
      text: formData[prod_id] as string,
      rating: productRatings[prod_id] as number,
      prod_id,
    }));

    commentHandler(reviews)


  }



  // reset all components
  useEffect(() => {
    setProductRatings({})
    setIsRating(true)
    setFormData({})
  }, [data])

  useEffect(() => {

    if (data?.length === Object.keys(productRatings).length) {
      setIsRating(false)
    }
  }, [productRatings])

  useEffect(() => {
    if (isSuccess) {
      openHandler(false);
    }
  }, [isSuccess]);



  return (
    <AlertDialog open={open} onOpenChange={openHandler}>
      <AlertDialogContent>
        <form onSubmit={submitHandler}>
          <AlertDialogHeader>
            {data?.map((item) => (
              <div key={item.prod_id} className="grid gap-4 py-4">
                <div className="p-4">
                  {/* <h1 className="text-1xl font-semibold mb-4">{item.name}</h1> */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      className="object-cover h-14 w-14 rounded-md"
                    />
                    <div>{item.name}</div>
                  </div>

                  <p className="mb-2">Please give your rating:</p>
                  <Rating
                    onChange={(newRating) =>
                      handleRatingChange({ productId: item.prod_id, rating: newRating })
                    }
                  />
                  {productRatings[item.prod_id] > 0 && (
                    <p className="mt-2">
                      You rated the product with {productRatings[item.prod_id]}{" "}
                      {productRatings[item.prod_id] === 1 ? "star" : "stars"}.
                    </p>
                  )}

                  {productRatings[item.prod_id] > 0 && (
                    <Textarea name={item.prod_id} className="mt-4" placeholder="Type your message here." onChange={handleInputChange} />
                  )}
                </div>

              </div>
            ))}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isRating || isLoading}>{isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}Save changes</Button>

          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormCommentDialog;
