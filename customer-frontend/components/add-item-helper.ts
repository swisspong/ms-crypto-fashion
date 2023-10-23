

const showSelectValue = (selecteds: {
    vgrpId: string;
    optnId: string;
}[], group: IGroup) => {
    return selecteds.find((selected) => selected.vgrpId === group.vgrp_id)
        ?.optnId ?? undefined
}

const disableSelect = (data: IProductRow, option: IOption, selecteds: {
    vgrpId: string;
    optnId: string;
}[]) => {
    const isIncludeOptionInVariant = data.variants
        .filter((variant) => variant.stock > 0)
        .some((variant) =>
            variant.variant_selecteds.some(
                (vrnts) => vrnts.optn_id === option.optn_id
            )
        )
    const val = data.variants
        .filter((variant) => variant.stock > 0)
        .filter(
            (variant) =>
                selecteds
                    .filter(
                        (selected) =>
                            selected.optnId.trim().length > 0
                    )
                    .every((selected) =>
                        variant.variant_selecteds.some(
                            (vrnts) =>
                                vrnts.vgrp_id === selected.vgrpId &&
                                vrnts.optn_id === selected.optnId
                        )
                    ) ||
                (selecteds.every(
                    (selected) => selected.optnId.trim().length > 0
                ) &&
                    (selecteds
                        .filter(
                            (selected) =>
                                selected.optnId.trim().length > 0
                        )
                        .every(
                            (selected) =>
                                !variant.variant_selecteds.some(
                                    (vrnts) =>
                                        vrnts.vgrp_id === selected.vgrpId &&
                                        vrnts.optn_id === selected.optnId
                                )
                        ) ||
                        selecteds
                            .filter(
                                (selected) =>
                                    selected.optnId.trim().length > 0
                            )
                            .some((selected) =>
                                variant.variant_selecteds.some(
                                    (vrnts) =>
                                        vrnts.vgrp_id === selected.vgrpId &&
                                        vrnts.optn_id === selected.optnId
                                )
                            )))
        )
        .some((variant) =>
            variant.variant_selecteds.some(
                (vrnts) => vrnts.optn_id === option.optn_id
            )
        )
    return !val || !isIncludeOptionInVariant
}

export {
    showSelectValue,
    disableSelect
}