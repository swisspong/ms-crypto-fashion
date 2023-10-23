import * as z from 'zod'
const items = [
    {
        id: "credit",
        label: "ชำระด้วย credit card",
    },
    {
        id: "wallet",
        label: "ชำระด้วย metamask wallet",
    },
] as const;
const formSchema = z.object({
    name: z.string({ required_error: "ต้องกรอก" }).trim().min(2, { message: "ต้องมีอย่างน้อย 2 ตัวอักษร" }),
    sku: z.string({ required_error: "ต้องกรอก" }).trim().min(2, { message: "ต้องมีอย่างน้อย 2 ตัวอักษร" }),
    stock: z.number().int().min(0),
    price: z.number().int().min(0),
    description: z
        .string({ required_error: "ต้องกรอก" })
        .trim()
        .min(2, { message: "ต้องมีอย่างน้อย 2 ตัวอักษร" }),
    image_urls: z
        .array(z.object({ url: z.string().url() }))
        .min(1, { message: "ต้องมีอย่างน้อย 1 รูป" }),
    categories: z.array(z.object({ cat_id: z.string() })),
    // .min(1, { message: "Must have at least 1 category" }),
    categories_web: z.array(z.object({ cat_id: z.string() })),
    // .min(1, { message: "Must have at least 1 category" }),
    available: z.boolean(),
    payment_methods: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: "ต้องเลือกอย่างน้อย 1 ช่องทาง",
        }),
});

export {
    formSchema,
    items
}