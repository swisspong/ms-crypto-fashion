import DialogAlert from "@/components/DialogAlert";
import Layout from "@/components/Layout";
import { columns } from "@/components/complaints/column";
import { DataTable } from "@/components/data-table";
import { withUser } from "@/src/hooks/auth/isAuth";
import { useUpdateComplaint } from "@/src/hooks/complaint/mutaions";
import { useGetAllComplaints } from "@/src/hooks/complaint/querires";
import { PaginationState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

export default function Complaint() {

    // TODO: Set column in DataTable
    const [idToUpdate, setIdToUpdate] = useState<string>();
    const [status, setStatus] = useState<string>();
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const {mutate: updateHandler, isLoading, isSuccess} = useUpdateComplaint()

    const openDialogHandlerParam = (open: boolean) => {
        if (!open) {
            setHandler(undefined,undefined);
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
            setHandler(undefined,undefined);
        }
        setOpen(con);
    };

    const setHandler = (status: string | undefined,id: string | undefined) => {
        setStatus(status);
        setIdToUpdate(id)
    };


    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const fetchDataOptions = {
        pageIndex,
        pageSize,
      };

    const dataQuery = useGetAllComplaints(fetchDataOptions)
    const defaultData = useMemo(() => [], []);
    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    console.log(dataQuery.data);
    

    // !!! END DataTable

    return (
        <Layout>
            <DataTable
                title="รายการคำร้องทั้งหมด"
                setPagination={setPagination}
                columns={columns({ openSheetHandler, setHandler, openDialogHandler })}
                data={dataQuery.data?.data ?? defaultData}
                pagination={pagination}
                pageCount={dataQuery.data?.total_page ?? -1}
            />
            <DialogAlert
                handler={() => updateHandler({status: status!, id: idToUpdate!})}
                isLoading={isLoading}
                isSuccess={isSuccess}
                title_alert={status!}
                openDialog={openDialog}
                openDialogHandler={openDialogHandlerParam}
            />
        </Layout>
    )
}

export const getServerSideProps = withUser();