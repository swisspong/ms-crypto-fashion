import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod'
import { formSchema, genId, showSelectItems, showSelectPlaceholder, showSelectValue } from './variant-add-helper';
import { useProductById } from '@/src/hooks/product/queries';
import { useRouter } from 'next/router';
import { useAddVariant } from '@/src/hooks/product/variant/mutations';
import { toast } from 'react-toastify';
const useVariantAddHook = () => {
  const router = useRouter()
  const addVariantMutate = useAddVariant()
  const productQuery = useProductById(
    router.query.prodId as string
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: 0,
      stock: 0
    },
  });
  const { fields } = useFieldArray({
    control: form.control,
    name: `variant_selecteds`,
  });
  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    values.variant_selecteds = values.variant_selecteds.filter(vrnts => vrnts.optn_id !== '' && vrnts.optn_id !== 'none')
    addVariantMutate.mutate({ prodId: router.query.prodId as string, body: values })

    // form.reset({
    //   vrnt_id: genId("vrnt"),
    //   variant_selecteds: productQuery.data?.groups.map(group => ({ vgrp_id: group.vgrp_id, optn_id: '' })) ?? [],
    //   price: 0,
    //   stock: 0
    // })
  }


  useEffect(() => {
    if (productQuery.data) {
      form.reset({
        vrnt_id: genId("vrnt"),
        variant_selecteds: productQuery.data?.groups.map(group => ({ vgrp_id: group.vgrp_id, optn_id: '' })) ?? []
      })
    }
  }, [productQuery.data])

  useEffect(() => {
    if (addVariantMutate.isSuccess) {
      toast.success("บันทึกสำเร็จ!", {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      form.reset({
        vrnt_id: genId("vrnt"),
        variant_selecteds: productQuery.data?.groups.map(group => ({ vgrp_id: group.vgrp_id, optn_id: '' })) ?? [],
        price: 0,
        stock: 0
      })
    }
  }, [addVariantMutate.isSuccess])
  return {
    form,
    fields,
    checkKeyDown,
    onSubmit,
    productData: productQuery.data,
    showSelectPlaceholder,
    showSelectItems,
    showSelectValue
  }
}

export default useVariantAddHook