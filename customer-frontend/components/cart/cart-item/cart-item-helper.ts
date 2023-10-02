

const showImage = (data: ICartItem) => {
    if (data.vrnt_id) {
        const image = data.product.variants.find(
            (vrnt) => vrnt.vrnt_id === data.vrnt_id
        )?.image_url
        if (image) {
            return image
        }
    }
    return data.product.image_urls[0]
}

const showPrice = (data: ICartItem) => {
    if (data.vrnt_id) {
        return data.product.variants.find(
            (vrnts) => vrnts.vrnt_id === data.vrnt_id
        )?.price!
    }
    return data.product.price
}

const showTotalPrice = (data: ICartItem) => {
    return showPrice(data) * data.quantity
}
const showRemainingStock = (data: ICartItem) => {
    if (data.vrnt_id) {
        return data.product.variants.find(
            (vrnt) => vrnt.vrnt_id === data.vrnt_id
        )?.stock
    }
    return data.product.stock
}

export {
    showImage,
    showPrice,
    showRemainingStock,
    showTotalPrice
}