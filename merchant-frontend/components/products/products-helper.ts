
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
const showStock = (variants: IVariant[]) => {
    const newFormat = variants
        .reduce(
            (prev: [undefined | number, undefined | number], curr) => {
                prev[0] =
                    prev[0] === undefined || curr.stock < prev[0]
                        ? curr.stock
                        : prev[0];
                prev[1] =
                    prev[1] === undefined || curr.stock > prev[1]
                        ? curr.stock
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

export {
    showPrice,
    showStock
}