import { API_AUTH } from "@/lib/utils";



export const createAdmin = async (body: IAdminPlayload): Promise<void> => {
    return await API_AUTH.post('users/admin', body).then(
        (response) => response.data
    )
}

export const getAllAdmin = async (data: { pageIndex: number, pageSize: number }): Promise<IAdminResponse> => {
    const result = await API_AUTH.get(`users/admins?per_page=${data.pageSize}&page=${data.pageIndex + 1}`).then((response) => response.data);
    return result
};


export const getAdminById = async (userId: string | string[] | undefined): Promise<IAdmin> => {
    const response = await API_AUTH.get(`users/admin/${userId}`)
    const { _id, username, user_id, email, permission, role } = response.data
    return { id: _id, username, user_id, email, permission, role }
};

export const putAdmin = async (body: IPutAdminPlayload, id: string | string[] | undefined): Promise<void> => {
    return await API_AUTH.patch(`users/admin/${id}`, body).then((response) => response.data);
};

export const deleteAdmin = async (id: string): Promise<void> => {
    return await API_AUTH.delete(`users/admin/${id}`).then((response) => response.data);
};
