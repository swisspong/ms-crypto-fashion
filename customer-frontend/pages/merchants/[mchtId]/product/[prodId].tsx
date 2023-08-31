import Container from "@/components/container";
import Footer from "@/components/footer";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import Navbar from "@/components/navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAllCommentById } from "@/src/hooks/comment/queries";
import { useMerchantById } from "@/src/hooks/merchant/queries";
import { useProductById } from "@/src/hooks/product/user/queries";
import { useUserInfo } from "@/src/hooks/user/queries";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useReplyCommnt } from "@/src/hooks/comment/mutations";


const ProductStorefrontPage = () => {
  const router = useRouter();
  const { data } = useProductById(router.query.prodId as string);
  const { data: merchantInfo } = useMerchantById(router.query.mchtId as string);
  const { data: commentData } = useAllCommentById(router.query.prodId as string);
  const [vrntSelected, setVrntSelected] = useState<string | undefined>();
  const { mutate: replyHandler, isLoading, isSuccess } = useReplyCommnt()
  // * info me
  const {
    data: me,
    isLoading: meLoading,
    isSuccess: meSuccess,
  } = useUserInfo();

  const [replyText, setReplyText] = useState('');
  const [idToUpdate, setIdToUpdate] = useState<string>()

  // * Submit
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (replyText.trim() !== '' && idToUpdate !== undefined) {
      const object: TReplyPayload = {
        comment_id: idToUpdate,
        message: replyText
      }

      replyHandler(object)
    }
  };

  // * input textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, id } = e.target;
    setIdToUpdate(id)
    setReplyText(value)
  };

  return (
    <div className="bg-white">
      <Navbar />
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Alert className="col-span-2 mb-10 flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={merchantInfo?.banner_url} alt="@shadcn" />
                <AvatarFallback>
                  {merchantInfo?.name
                    .split(" ")
                    .map((word) => word.substring(0, 1).toUpperCase())
                    .filter((word, index) => index <= 1)
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <AlertTitle className="underline">
                  {merchantInfo?.name}
                </AlertTitle>
                <AlertDescription>
                  {merchantInfo?.banner_title}
                </AlertDescription>
              </div>
            </Alert>
            <Gallery
              images={[
                ...(data?.image_urls.map((image, index) => ({
                  id: index,
                  url: image,
                })) ?? []),
                ...(data?.variants
                  .filter((vrnt) => vrnt.image_url)
                  .map((vrnt) => ({
                    id: vrnt.image_url,
                    url: vrnt.image_url,
                    vrntId: vrnt.vrnt_id,
                  })) ?? []),
              ]}
              vrntSelected={vrntSelected}
            />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info
                data={data}
                setVrntSelected={setVrntSelected}
                canAddToCart={true}
                vrntSelected={vrntSelected}
              />
            </div>
          </div>
          <hr className="my-10" />
          <h4 className="text-lg font-bold leading-none">Comments</h4>
          {commentData?.map((comment) => {
            // console.log(comment.created_at)
            const commentDate = new Date(comment.created_at);
            // ดึงค่าวันที่, เดือน, และปี
            var day = commentDate.getUTCDate();
            var month = commentDate.getUTCMonth() + 1; // เนื่องจากเดือนใน JavaScript เริ่มนับที่ 0
            var year = commentDate.getUTCFullYear();

            // แปลงเป็นสตริงที่ต้องการ
            var formattedString = `${day}/${month}/${year}`;
            return (
              <>
                <div className="bg-white p-4 rounded-lg shadow-xl mb-4">
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/avatars/03.png" alt="@shadcn" />
                      <AvatarFallback>
                        {comment.user.username
                          .split(" ")
                          .map((word) => word.substring(0, 1).toUpperCase())
                          .filter((word, index) => index <= 1)
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-gray-600 text-sm font-medium ml-2">{comment.user.username}</p>

                  </div>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type='button'
                      disabled={true}
                      className={`text-1xl focus:outline-none ${value <= comment.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                  <p className="text-gray-800 mt-1">{comment.text}</p>
                  <p className="text-gray-400 text-xs mt-2">{
                    formattedString
                  }</p>
                  {me?.merchant === undefined ? (<></>) : me.merchant.mcht_id !== (router.query.mchtId as string) ? (<></>) : comment.message === undefined ? (<>
                    <Popover >
                      <PopoverTrigger asChild className="m-4">
                        <Button variant="ghost"><MessageCircle className="mr-3" /> reply to comment.</Button>
                      </PopoverTrigger>
                      <PopoverContent className=" sm:w-60 md:w-98   " >
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Reply to customer comments.
                            </p>
                          </div>
                          <form onSubmit={handleReplySubmit}>
                            <div className="grid gap-2" >
                              <div className="grid  items-center ">
                                <Textarea
                                  id={comment.comment_id}
                                  name="message"
                                  onChange={handleInputChange}
                                  className="col-span-2 h-8"
                                />
                              </div>
                            </div>
                            <div className="text-right">
                              <Button className="mt-3" type="submit">Reply</Button>
                            </div>
                          </form>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </>) :
                    (<>

                    </>)}

                  {comment.message && (<>
                    <div className="m-1 ml-10 shadow-md p-4">
                      <div className="flex items-center">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/avatars/03.png" alt="@shadcn" />
                          <AvatarFallback>
                            {merchantInfo?.name
                              .split(" ")
                              .map((word) => word.substring(0, 1).toUpperCase())
                              .filter((word, index) => index <= 1)
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-gray-600 text-sm font-medium ml-2">{merchantInfo?.name}</p>

                      </div>
                      <p className="text-gray-800 mt-1">{comment.message}</p>
                    </div>
                  </>)}
                </div>
              </>
            )
          })}


        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default ProductStorefrontPage;
