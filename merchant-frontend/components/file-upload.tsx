import { Plus, Upload } from "lucide-react";
import React, { ChangeEvent, FC, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { postAsset } from "@/src/services/asset.service";
interface Props {
  isLoading?: boolean;
  onChange: (...event: any[]) => void;
  image_url: string;
}
const FileUpload: FC<Props> = ({ image_url, onChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<string>();
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    console.log(e.target.files);
    if (e.target.files) {
      onChange(URL.createObjectURL(e.target.files[0]));
      setFile(URL.createObjectURL(e.target.files[0]));

      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      postAsset(formData).then((res) => {
        onChange(res.image_url);
      });
    }
  }
  return (
    <div className="flex flex-col h-[250px] shrink-0 items-center justify-center rounded-md border border-dashed px-3">
      {image_url ? (
        <div className="grid grid-cols-4 gap-2 w-full">
          <img src={image_url} className="col-span-1" />
        </div>
      ) : null}
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {image_url ? (
          <></>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No asset added</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              You have not added any asset. Add one below.
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
            Add Asset
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

export default FileUpload;
