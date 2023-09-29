import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";

const AlertInfoMerchant = () => {
  return (
    <Alert className="mb-2">
      <Terminal className="h-4 w-4" />
      <AlertTitle>ข้อมูลเบื้องต้น!</AlertTitle>
      <AlertDescription>
      เริ่มเปิดร้านเพื่อสร้างสรรค์สินค้า ถ้าพร้อมขายให้กด{" "}
        <Link
          href={"/subscription"}
          className="text-muted-foreground underline"
        >
          สมัครเป็นผู้ขาย
        </Link>
      </AlertDescription>
    </Alert>
  );
};

export default AlertInfoMerchant;
