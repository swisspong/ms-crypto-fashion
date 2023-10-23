import ShortUniqueId from 'short-unique-id';
import * as z from 'zod'

const formSchema = z.object({
    vrnt_id: z.string(),
    variant_selecteds: z.array(
        z.object({
            vgrp_id: z.string().trim(),
            optn_id: z.string().trim(),
            // vgrp_id: z.string().trim().min(2, { message: "ต้องเลือก" }),
            // optn_id: z.string().trim().min(2, { message: "ต้องเลือก" }),
        })
    ).refine((val) => {
        console.log(val)
        const filtered = val.filter(data => data.optn_id === "" || data.optn_id === "none")
        if (val.length === filtered.length) {
            return false
        }
        return true
    }, { message: "ต้องมีอย่างน้อย 1 ตัวเลือก" }),
    price: z.number().min(0),
    stock: z.number().int().min(0),
    image_url: z.string({ required_error: 'ต้องมี 1 รูป', invalid_type_error: 'ต้องมี 1 รูป' }).url({ message: 'ต้องมี 1 รูป' }).optional(),
})
const genId = (prefix: string) => {
    const uid = new ShortUniqueId();
    return `${prefix}_${uid.stamp(15)}`;
};

const showSelectPlaceholder = (vgrpId: string, data: IProductRow | undefined) => {
    return data?.groups.find(group => group.vgrp_id === vgrpId)?.name

}
const showSelectItems = (vgrpId: string, groups: IGroup[] | undefined) => {
    return groups?.find(group => group.vgrp_id === vgrpId)?.options ?? []
}
const showSelectValue = (value: string, vgrpId: string, groups: IGroup[] | undefined) => {
    return value.trim().length > 0 &&
        groups?.find(
            (group) => group.vgrp_id === vgrpId
        )
            ?.options.find(
                (option) => option.optn_id === value
            )
        ? value
        : ""
}
export {
    genId,
    formSchema,
    showSelectPlaceholder,
    showSelectItems,
    showSelectValue
}