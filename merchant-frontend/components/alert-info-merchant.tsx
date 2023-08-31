import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";

const AlertInfoMerchant = () => {
  return (
    <Alert className="mb-2">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Start opening a shop to create products. If ready to sell, then go to{" "}
        <Link
          href={"/subscription"}
          className="text-muted-foreground underline"
        >
          subscription
        </Link>
      </AlertDescription>
    </Alert>
  );
};

export default AlertInfoMerchant;
