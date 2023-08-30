
interface IAdmin {
    id: string
    user_id: string
    role: string
    username: string
    email: string
    permission: string[]
}

// * admin playload permission
interface permission {
    permission: string
}

interface IAdminPlayload {
    username: string;
    password: string;
    email: string;
    permissions: permission[]
}

interface IAdminResponse {
    page: number,
    per_page: number,
    total: number,
    total_page: number,
    data: IAdmin[]
}

interface IPutAdminPlayload extends Omit<IAdminPlayload, 'password'> {
    password?: string;
}