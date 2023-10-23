import { useAddToCart } from '@/src/hooks/cart/mutations';
import { useReplyCommnt } from '@/src/hooks/comment/mutations';
import { useAllCommentById } from '@/src/hooks/comment/queries';
import { useCreateComplaint } from '@/src/hooks/complaint/mutations';
import { useMerchantById } from '@/src/hooks/merchant/queries';
import { useProductById } from '@/src/hooks/product/user/queries';
import { useUserInfo } from '@/src/hooks/user/queries';
import { useAddToWishlist } from '@/src/hooks/wishlist/mutations';
import { TComplaintPlayload } from '@/src/types/complaint';
import { TypeFormat } from '@/src/types/enums/complaint';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const userProductHook = () => {
    const router = useRouter();
    const productQuery = useProductById(router.query.prodId as string);
    const [vrntSelected, setVrntSelected] = useState<string | undefined>();
    const [vrntId, setVrntId] = useState<string | undefined>()
    const vrntSelectedHandler = (selecteds: { vgrpId: string; optnId: string }[]) => {
        setVrntSelected(
            productQuery.data?.variants.find((variant) =>
                variant.variant_selecteds.every((vrnts) =>
                    selecteds.some(
                        (slct) =>
                            slct.optnId === vrnts.optn_id && slct.vgrpId === vrnts.vgrp_id
                    )
                )
            )?.vrnt_id ?? undefined
        );
    }
    const vrntIdHandler = (data: string | undefined) => {
        setVrntId(data)
    }

    return {
        vrntSelectedHandler,
        vrntSelected,
        vrntId,
        vrntIdHandler
    }



}

export default userProductHook