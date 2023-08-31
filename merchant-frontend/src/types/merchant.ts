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