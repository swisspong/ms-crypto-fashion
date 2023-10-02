import { useProductById } from '@/src/hooks/product/queries';
import { useRouter } from 'next/router';
import React from 'react'

const useVariantsHook = () => {
    const router = useRouter()
    const productQuery = useProductById(
        router.query.prodId as string
    );
    return {
        productData: productQuery.data,
        productLoading: productQuery.isLoading
    }
}

export default useVariantsHook