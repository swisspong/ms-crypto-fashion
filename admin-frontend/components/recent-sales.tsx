import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { RocketIcon } from "lucide-react"

interface Props {
  data: IOrderRecentSale[]
}

export const RecentSales = ({ data }: Props) => {

  return (
    <div className="space-y-8">

      {data.length > 0 ? (

        data.map((sale) => (
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>
                {sale.merchant.name
                  .split(" ")
                  .map((word) => word.substring(0, 1).toUpperCase())
                  .filter((word, index) => index <= 1)
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{sale.merchant.name}</p>
              <span className="text-sm text-muted-foreground">
                {`${sale.merchant.first_name} ${sale.merchant.last_name}`}
              </span>

              {/* <span className="text-sm text-muted-foreground ">
                Pay Subscription {sale.merchant.amount}
              </span> */}
            </div>
            <div className="ml-auto space-y-1">
              <p className="text-sm font-medium text-right">+฿{sale.totalAmount}</p>
              <p className="text-sm text-muted-foreground">Pay Subscription {sale.merchant.amount}</p>
            </div>

          </div>
        ))

      ) : (
        <Alert>
          <AlertDescription>
            We're sorry, but the requested information is currently unavailable. Please check back later or contact our support team for assistance.
          </AlertDescription>
        </Alert>
      )
      }

    </div>
  )
}