import * as z from "zod"
const formSchema = z.object({
    first_name: z
        .string()
        .trim()
        .min(2, { message: "First name must be at least 2 characters." }),
    last_name: z
        .string()
        .trim()
        .min(2, { message: "Last name must be at least 2 characters." }),
    image_url: z.string().url(),
});


export {
    formSchema
}