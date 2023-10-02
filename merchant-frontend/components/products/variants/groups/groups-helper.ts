
import ShortUniqueId from 'short-unique-id';
import * as z from 'zod'
const formSchema = z.object({
    vgrp_id: z.string().min(15),
    name: z.string({ required_error: "ต้องกรอก" }).min(2,{message:"ต้องมีอักขระอย่างน้อย 2 ตัว"}),
    options: z.array(
        z.object({ optn_id: z.string().trim().min(2), name: z.string() })
    ).min(1, { message: "ต้องมีอย่างน้อย 1 ตัวเลือก" }),
});
const genId = (prefix: string) => {
    const uid = new ShortUniqueId();
    return `${prefix}_${uid.stamp(15)}`;
};
export {
    genId,
    formSchema
}