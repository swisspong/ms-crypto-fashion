import { useDeleteGroup } from '@/src/hooks/product/groups/mutations'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const useGroupsDeleteHook = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const deleteGroupMutate = useDeleteGroup()
    const deleteHandler = (vgrpId: string) => {
        deleteGroupMutate.mutate({ prodId: router.query.prodId as string, vgrpId: vgrpId })
        setOpen(true)
    }
    const setOpenHandler = (value: boolean) => {
        if (!deleteGroupMutate.isLoading) setOpen(value)
    }
    return {
        deleteHandler,
        deleteLoading: deleteGroupMutate.isLoading,
        open,
        setOpenHandler
    }
}

export default useGroupsDeleteHook