"use client"
import React,{ useEffect, useState } from 'react';
import { Inter } from 'next/font/google'
import { Separator } from "@/components/ui/separator";
import dynamic from 'next/dynamic';
// import Layout from '@/components/Layout'
const Layout = dynamic(() => import('@/components/Layout'), {
  ssr: false,
});
import { withUser } from '@/src/hooks/auth/isAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/overview';
import { RecentSales } from '@/components/recent-sales';
import { useGetDashboardMerchant } from '@/src/hooks/merchant/queries';

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
        {merchantLoading ? (
          <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                จำนวนคำขอเปิดร้านทั้งหมด
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
        )}

        {merchantLoading ? (
          <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Card  >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                จำนวนผู้ขายที่เป็นสมาชิกทั้งหมด
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
        )
        }

        {merchantLoading ? (
          <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">จำนวนเงินที่ได้จากการสมัครเปิดร้าน</CardTitle>
              <span className='h-4 w-4 text-muted-foreground'>฿</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">฿{amountSub}</div>
            </CardContent>
          </Card>
        )}



      </div>
      {/* Overview */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7 ">
        {tradeLoading ? (
          <div className="border col-span-4 border-blue-300 shadow rounded-md p-4 ">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-4 bg-slate-700 rounded col-span-2"></div>
                  </div>
                  <div className="h-40 bg-slate-700 rounded"></div>
                  <div className="h-4  bg-slate-700 rounded max-w-sm w-full mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>ภาพรวมการซื้อขายภายในเว็บไซต์</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={tradeData ?? []} />
            </CardContent>
          </Card>
        )}

        {saleLoading ? (
          <div className="border col-span-3 border-blue-300 shadow rounded-md p-4 ">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-4 bg-slate-700 rounded col-span-2"></div>
                  </div>
                  <div className="h-20 bg-slate-700 rounded"></div>
                  <div className="h-4  bg-slate-700 rounded max-w-sm w-full mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>ยอดขายล่าสุดจากผู้ขาย</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentSales data={saleData?.data ?? []} />


            </CardContent>
            <div className="flex items-center justify-between px-2 m-4">

              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                หน้า {pagination.pageIndex + 1} จาก {" "}
                {saleData?.total_page}
              </div>
              <div className="flex items-center space-x-2  ">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => setPagination({ ...pagination, pageIndex: 0 })}
                  disabled={(!getCanPreviousPage())}
                >
                  <span className="sr-only">ไปหน้าแรก</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => previousPage()}
                  disabled={(!getCanPreviousPage())}
                >
                  <span className="sr-only">กลับ</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => nextPage()}
                  disabled={(!getCanNextPage())}
                >
                  <span className="sr-only">ถัดไป</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => setPagination({ ...pagination, pageIndex: (saleData?.total_page ?? 1) - 1 })}
                  disabled={(!getCanNextPage())}
                >
                  <span className="sr-only">ไปหน้าสุดท้าย</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout >
    
  )
}

export const getServerSideProps = withUser();