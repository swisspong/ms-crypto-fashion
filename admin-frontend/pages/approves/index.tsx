import Layout from "@/components/Layout";
import { columns } from "@/components/approves/column";
import { DataTable } from "@/components/data-table";
import { withUser } from "@/src/hooks/auth/isAuth";
import { useApprovesMerchant } from "@/src/hooks/merchant/mutaions";
import { useGetAllMerchantApproves } from "@/src/hooks/merchant/queries";
import { PaginationState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

export default function Approve() {
    // TODO: DataTable

    const {mutate, isLoading, isSuccess} = useApprovesMerchant()
   

    const setStatusHandler = (id: string | undefined, status: string) => {
        mutate({id, status})
    };
    
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const fetchDataOptions = {
        pageIndex,
        pageSize,
    };


    const dataQuery = useGetAllMerchantApproves(fetchDataOptions)
    
   
    
    const defaultData = useMemo(() => [], []);
    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );


    // !!! END DataTable
    return (
        <Layout>
            <DataTable
                title="All request open merchant"
                setPagination={setPagination}
                columns={columns({setStatusHandler})}
                data={dataQuery.data?.data ?? defaultData}
                pagination={pagination}
                pageCount={dataQuery.data?.total_page ?? -1}
            />
        </Layout>
    )
}
export const getServerSideProps = withUser();