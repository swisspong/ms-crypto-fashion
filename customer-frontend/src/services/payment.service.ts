import axios from "axios";

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