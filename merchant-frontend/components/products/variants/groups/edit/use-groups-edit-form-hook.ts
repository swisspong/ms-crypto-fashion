import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpsertVariant } from '@/src/hooks/product/variant/mutations';
import { useRouter } from 'next/router';
import { useDeleteGroup, useEditGroup } from '@/src/hooks/product/groups/mutations';
import { useProductById } from '@/src/hooks/product/queries';
import { formSchema, genId } from '../groups-helper';
const useGroupsEditFormHook = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const router = useRouter()
  const editGroupMutate = useEditGroup()
  
  const productQuery = useProductById(
    router.query.prodId as string
  );
  const form= useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vgrp_id: genId('vgrp')
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    editGroupMutate.mutate({ prodId: router.query.prodId as string, body: values })
    setIsEdit(false)
  }
  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };
  const initForm = (group: IGroup) => {
    useEffect(() => {
      form.reset({
        name: group.name,
        vgrp_id: group.vgrp_id,
        options: group.options,
      })
    }, [productQuery.isSuccess])
  }
  const toggleEdit = () => {
    setIsEdit(prev => !prev)
  }
  const cancelForm = (group: IGroup) => {
    form.reset({
      name: group.name,
      vgrp_id: group.vgrp_id,
      options: group.options,
    })
    setIsEdit(false)
  }
 
  return {
    form,
    onSubmit,
    checkKeyDown,
    initForm,
    isEdit,
    toggleEdit,
    cancelForm,
    
  }
}

export default useGroupsEditFormHook