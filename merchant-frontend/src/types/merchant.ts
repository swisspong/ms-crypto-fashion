interface IMerchantStartPayload {
    name: string,
    banner_title: string
}
interface ICredentialPayload {
    first_name: string,
    last_name: string
    image_url: string
}

interface IMerchantProfilePayload extends IMerchantStartPayload {
    first_name: string;
    last_name: string;
    banner_url: string
}


interface IAccountPayload {

    name: string
    email: string
    "bank_account[brand]": string
    "bank_account[number]": string
    "bank_account[name]": string

}