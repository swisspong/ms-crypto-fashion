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
    ),
    price: z.number().min(0),
    stock: z.number().int().min(0),
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
export {
    genId,
    formSchema,
    showSelectPlaceholder,
    showSelectItems
}