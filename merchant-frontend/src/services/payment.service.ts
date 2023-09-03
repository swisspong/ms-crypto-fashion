import { API, SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
import axios from "axios";
const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.PAYMENT })
export const postOmiseToken = async (body: ICreateOmiseToken): Promise<ICreateOmiseTokenResponse> => {
    try {
        const response = await axios.post(`https://vault.omise.co/tokens`, body, {
            auth: {
                username: process.env.NEXT_PUBLIC_OMISE_PK as string,
                password: "",
            },
        })
        const { id } = response.data

        return { id }
    } catch (error) {
        return {id: '', message: error}
    }
};

export const postCreditCard = async (body: ICreateCreditCard): Promise<void> => {
    return await api.post(`payments/credit`, body).then(
        (response) => response.data
    );
}
