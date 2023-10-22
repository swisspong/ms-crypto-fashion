

const showPrice = (variants: IVariant[]) => {
    const newFormat = variants
        .reduce(
            (prev: [undefined | number, undefined | number], curr) => {
                prev[0] =
                    prev[0] === undefined || curr.price < prev[0]
                        ? curr.price
                        : prev[0];
                prev[1] =
                    prev[1] === undefined || curr.price > prev[1]
                        ? curr.price
                        : prev[1];
                console.log(prev, curr);
                return prev;
            },
            [undefined, undefined]
        )

    const newFilter = newFormat.filter((val, index) => {
        const nfIndex = newFormat.findIndex(nf => nf === val)
        if (nfIndex === index) return true
        return false
    })
    return newFilter
}
const productIsNotAvailable = (data: IProductRow) => {
    if (!data.available) {
        return false
    }
    if (data.variants.length > 0) {
        return data.variants.every(variant => variant.stock <= 0)
    } else {
        return data.stock <= 0
    }
}
export {
    showPrice,
    productIsNotAvailable
}