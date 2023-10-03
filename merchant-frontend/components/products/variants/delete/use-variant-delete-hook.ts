import { useDeleteGroup } from '@/src/hooks/product/groups/mutations'
import { useDeleteVariant } from '@/src/hooks/product/variant/mutations'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const useVariantDeleteHook = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const deleteVariantMutate = useDeleteVariant()
    const deleteHandler = (vrntId: string) => {
        deleteVariantMutate.mutate({ prodId: router.query.prodId as string, vrntId })
        setOpen(true)
    }
    const setOpenHandler = (value: boolean) => {
        if (!deleteVariantMutate.isLoading) setOpen(value)
    }
    return {
        deleteHandler,
        deleteLoading: deleteVariantMutate.isLoading,
        open,
        setOpenHandler
    }
}

export default useVariantDeleteHook