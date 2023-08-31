import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Separator } from "@/components/ui/separator";
import Layout from '@/components/Layout'
import { withUser } from '@/src/hooks/auth/isAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/overview';
import { RecentSales } from '@/components/recent-sales';
import { useGetDashboardMerchant } from '@/src/hooks/merchant/queries';
import { useEffect, useState } from 'react';
import { useGetOrderRecentSale, useGetOrderTradeByMonth } from '@/src/hooks/order/queries';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] })

interface Pagination {
  pageIndex: number
  pageSize: number
}

export default function Home() {

  // TODO: dashboard data merchant
  const [totalIn, setTotalIn] = useState<number>(0)
  const [totalSub, setTotalSub] = useState<number>(0)
  const [amountSub, setAmountSub] = useState<number>(0)
  const { data: merchantData, isSuccess: merchantSuccess, isLoading: merchantLoading } = useGetDashboardMerchant()

  // TODO: dashboard data ordrer trade month
  const { data: tradeData, isLoading: tradeLoading, isSuccess: tradeSuccess } = useGetOrderTradeByMonth()


  // TODO: dashboard data order Recent Sale
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 5
  });
  const { data: saleData, isLoading: saleLoading, isSuccess: saleSuccess } = useGetOrderRecentSale({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  })

  const previousPage = async () => {
    if (pagination.pageIndex > 0) {
      setPagination((prevState) => ({ ...prevState, pageIndex: prevState.pageIndex - 1 }));
    }
  };

  const nextPage = async () => {
    if (pagination.pageIndex < Math.ceil((saleData?.total ?? 0) / pagination.pageSize) - 1) {
      setPagination((prevState) => ({ ...prevState, pageIndex: prevState.pageIndex + 1 }));
    }
  };
  const getCanNextPage = (): boolean => {
    return pagination.pageIndex < Math.ceil((saleData?.total ?? 0) / pagination.pageSize) - 1;
  };

  const getCanPreviousPage = (): boolean => {
    return pagination.pageIndex > 0;
  };

  // * Effect event
  useEffect(() => {
    if (merchantData) {
      const { amountSub, totalIn, totalSub } = merchantData
      setTotalIn(totalIn)
      setTotalSub(totalSub)
      setAmountSub(amountSub)
    }
  }, [merchantSuccess])


  return (
    <Layout>
      <Separator className="my-4" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Store Opening Requests
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalIn}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Merchant Subscriptions
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSub}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Subscriptions</CardTitle>
            <span className='h-4 w-4 text-muted-foreground'>฿</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{amountSub}</div>
          </CardContent>
        </Card>
      </div>
      {/* Overview */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview of trading within the website</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={tradeData ?? []} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales From Merchant</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales data={saleData?.data ?? []} />
        

          </CardContent>
          <div className="flex items-center justify-between px-2 m-4">

            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {pagination.pageIndex + 1} of{" "}
              {saleData?.total_page}
            </div>
            <div className="flex items-center space-x-2  ">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setPagination({ ...pagination, pageIndex: 0 })}
                disabled={(!getCanPreviousPage())}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => previousPage()}
                disabled={(!getCanPreviousPage())}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => nextPage()}
                disabled={(!getCanNextPage())}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setPagination({ ...pagination, pageIndex: (saleData?.total_page ?? 1) - 1 })}
                disabled={(!getCanNextPage())}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout >
  )
}

export const getServerSideProps = withUser();