import * as z from "zod"

const formSchema = z.object({
    name: z
        .string()
        .trim()
        .min(5, { message: "name card must be at least 5 characters." }),
    number: z
        .string()
        .max(16, { message: "number card must be at most 16 number." }),
    expiration_month: z.string().trim(),
    expiration_year: z.string().trim(),
    security_code: z.string().trim().min(3, { message: "least 1 number." }),
});


export {
    formSchema
}