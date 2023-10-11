
import * as z from "zod";
const formSchema = z.object({
    recipient: z.string().trim(),
    post_code: z.string().trim(),
    tel_number: z.string().trim(),
    address: z.string().trim(),
});





export {
    formSchema,
}