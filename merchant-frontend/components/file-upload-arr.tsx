import { Expand, Plus, Trash2, Upload } from "lucide-react";
import React, { ChangeEvent, FC, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { postAsset } from "@/src/services/asset.service";
import Image from "next/image";
import { UseFieldArrayRemove } from "react-hook-form";
interface Props {
  isLoading?: boolean;
  onChange: (...event: any[]) => void;
  image_url: { url: string }[];
  remove: UseFieldArrayRemove;
}
const FileUploadArr: FC<Props> = ({ image_url = [], onChange, remove }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ url: string }[]>([]);
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    console.log(e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      //  onChange(URL.createObjectURL(e.target.files[0]));
      //setFile([{ url: URL.createObjectURL(e.target.files[0]) }]);

      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      postAsset(formData).then((res) => {
        onChange([...image_url, { url: res.image_url }]);
      });
    }
  }
  return (
    <div className="flex flex-col shrink-0 items-center justify-center rounded-md border border-dashed px-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full py-2">
        {image_url.length > 0
          ? image_url.map(({ url }, index) => (
              <div className="aspect-square group rounded-md bg-muted relative">
                <img
                  src={url}
                  alt=""
                  // fill
                  className="aspect-square object-contain rounded-md h-full w-full"
                />
                <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
                  <div className="flex gap-x-6 justify-center">
                    <Button
                      type="button"
                      variant={"destructive"}
                      className=""
                      onClick={() => remove(index)}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              </div>
              // <div id={url} className="relative w-full h-full bg-black">
              //   <img  src={url} className="col-span-1 rounded-md" />
              //   <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5 top-0">
              //     <div className="flex gap-x-6 justify-center">
              //       <Button>
              //         <Expand size={20} className="text-gray-600" />
              //       </Button>
              //     </div>
              //   </div>
              // </div>
            ))
          : null}
      </div>
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center py-4">
        {image_url.length > 0 ? (
          <></>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              ยังไม่มีการเพิ่มเนื้อหา
            </h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              คุณยังไม่ได้เพิ่มเนื้อหาใดๆ เพิ่มหนึ่งรายการด้านล่าง
            </p>
          </>
        )}
        <label className="relative">
          {/* <div class="text bg-indigo-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-indigo-500">Select</div> */}
          <Button
            type="button"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มเนื้อหา
          </Button>
          <Input
            className="hidden"
            id="picture"
            ref={fileRef}
            type="file"
            // disabled={isLoading}
            accept="image/png, image/gif, image/jpeg"
            onChange={handleChange}
            // onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default FileUploadArr;
