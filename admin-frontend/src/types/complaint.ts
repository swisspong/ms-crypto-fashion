interface IComplaint {
    _id: string;
    comp_id: string
    user: string;
    seller_id: string | null;
    prod_id: string | null;
    detail: string
    type: "PRODUCT" | "MERCHANT"
    status: "PENDING" | "PROGRESS" | "RESOLVED"
    created_at: string;
}

interface IComplaintPayload {
    id: string
    status: string
}

interface IComplaintResponse {
    page: number,
    per_page: number,
    total: number,
    total_page: number,
    data: IComplaint[]
}