"use client";

import { useEffect, useMemo, useState } from "react";

import CartItem from "@/components/cart-item";
import Container from "@/components/container";
import Summary from "@/components/summary";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Checkbox } from "@/components/ui/checkbox";
import { Store } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/account/profile-form";
import { SidebarNav } from "@/components/account/sidebar-nav";
import { DataTable } from "@/components/data-table";
import { PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { columns } from "@/components/order/column";
import { useMyOrders } from "@/src/hooks/order/queries";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormCommentDialog from "@/components/order/form-dialog-comment";
import { useCreateCommnt } from "@/src/hooks/comment/mutations";
const OrderListPage = () => {
  const router = useRouter();
  // TODO: Set column in DataTable
  const [idToUpdate, setIdToUpdate] = useState<string>();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [items, setItems] = useState<Item[] | undefined>(undefined)
  const {mutate: commentsHandler, isLoading, isSuccess} = useCreateCommnt()
  const [username, setUsername] = useState<string | undefined>(undefined) 

  const openDialogHandlerParam = (open: boolean) => {
    if (!open) {
      setIdHandler(undefined);
    }
    setOpenDialog(open);
  };
  const openDialogHandler = () => {
    setOpenDialog((prev) => !prev);
  };
  const openSheetHandler = () => {
    setOpen((prev) => !prev);
  };

  const openSheetHandlerParam = (con: boolean) => {
    if (!con) {
      setIdHandler(undefined);
    }
    setOpen(con);
  };
  const setIdHandler = (id: string | undefined) => {
    setIdToUpdate(id);
  };

  // * set Data Item
  const setDataItems = (body: Item[]) => {
    setItems(body)
  }

  // * comment handler
  const commentHandler = async (body: TComment[]) => {
    const payload: TCommentPayload = await {
      comments: body,
      order_id: idToUpdate!
    }
    commentsHandler(payload)
  }

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const defaultData = useMemo(() => [], []);
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
  const dataQuery = useMyOrders({ page: pageIndex + 1, per_page: pageSize });

  // console.log(dataQuery.data)

  return (
    <div className="bg-white">
      <Navbar />
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 min-h-screen">
          <div className="hidden space-y-6 p-10 pb-16 md:block">
            <div className="space-y-0.5">
              <h2 className="text-2xl font-bold tracking-tight">Account</h2>
              <p className="text-muted-foreground">
                Manage your account settings and set e-mail preferences.
              </p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <aside className="-mx-4 lg:w-1/5">
                <SidebarNav />
              </aside>
              <div className="flex-1 lg:max-w-4xl">
                {" "}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Orders</h3>
                    <p className="text-sm text-muted-foreground">
                      This is how others will see you on the site.
                    </p>
                  </div>
                  <Separator />
                  <DataTable
                    title="Orders"
                    setPagination={setPagination}
                    columns={columns({
                      openSheetHandler,
                      setIdHandler,
                      openDialogHandler,
                      setDataItems
                    })}
                    data={dataQuery.data?.data ?? defaultData}
                    pagination={pagination}
                    pageCount={dataQuery.data?.total_page ?? -1}
                    onRowClick={(data) =>
                      router.push(`orders/${data.order_id}`)
                    }
                  />
                  {/* <ProfileForm /> */}
                </div>
              </div>
            </div>
          </div>
        </div>


        <FormCommentDialog 
          data={items!}
          open={open}
          commentHandler={commentHandler}
          openHandler={openSheetHandlerParam}
          isLoading={isLoading}
          isSuccess={isLoading}
        />
       
      </Container>
      <Footer />
    </div>
  );
};

export default OrderListPage;
