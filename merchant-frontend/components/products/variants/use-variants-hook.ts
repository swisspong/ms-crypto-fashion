import { useProductById } from '@/src/hooks/product/queries';
import { useRouter } from 'next/router';
import React, { useState } from 'react'

const useVariantsHook = () => {
    const router = useRouter()
    const [delVgrpId, setDelVgrpId] = useState<string>()
    const productQuery = useProductById(
        router.query.prodId as string
    );
    const setDelVgrpIdHandler = (data: string | undefined) => {
        setDelVgrpId(data)
    }
    return {
        productData: productQuery.data,
        productLoading: productQuery.isLoading,
        delVgrpId,
        setDelVgrpIdHandler

    }
}

export default useVariantsHook