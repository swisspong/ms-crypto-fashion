import { API} from "@/lib/utils";


export const signout = async (): Promise<void> => {
    await API.post(`/auth/signout`).then(
        (response) => response.data
    );
};