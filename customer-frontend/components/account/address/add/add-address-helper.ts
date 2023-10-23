
import * as z from "zod";
const formSchema = z.object({
    recipient: z.string({ required_error: "ต้องกรอก" }).trim().min(4, { message: "ต้องมีอย่างน้อย 4 ตัวอักษร" }),
    post_code: z.string({ required_error: "ต้องกรอก" }).trim().min(4, { message: "ต้องมีอย่างน้อย 4 หมายเลข" }),
    tel_number: z.string({ required_error: "ต้องกรอก" }).trim().min(10, { message: "ต้องมี 10 หมายเลข" }).max(10, { message: "ต้องมี 10 หมายเลข" }),
    address: z.string({ required_error: "ต้องกรอก" }).trim().min(6, { message: "ต้องมีอย่างน้อย 6 ตัวอักษร" }),
});





export {
    formSchema,
}