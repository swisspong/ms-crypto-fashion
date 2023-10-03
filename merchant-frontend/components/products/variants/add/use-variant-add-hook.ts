import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod'
import { formSchema, genId, showSelectItems, showSelectPlaceholder } from './variant-add-helper';
import { useProductById } from '@/src/hooks/product/queries';
import { useRouter } from 'next/router';
import { useAddVariant } from '@/src/hooks/product/variant/mutations';
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
    form.reset({
      vrnt_id: genId("vrnt"),
      variant_selecteds: productQuery.data?.groups.map(group => ({ vgrp_id: group.vgrp_id, optn_id: '' })) ?? [],
      price: 0,
      stock: 0
    })
    // addVariantMutate.mutate({ prodId: router.query.prodId as string, body: values })
    // addGroupMutate.mutate({ prodId: router.query.prodId as string, body: values })
    // mutate(values);
  }

  // console.log(form.trigger())

  useEffect(() => {
    // console.log("out sid")
    if (productQuery.data) {
      console.log("tets log")
      form.reset({
        vrnt_id: genId("vrnt"),
        variant_selecteds: productQuery.data?.groups.map(group => ({ vgrp_id: group.vgrp_id, optn_id: '' })) ?? []
      })
    }
  }, [productQuery.data])

  useEffect(() => {
    if (addVariantMutate.isSuccess) {
      // form.reset({
      //   vrnt_id: genId("vrnt"),
      //   variant_selecteds: productQuery.data?.groups.map(group => ({ vgrp_id: group.vgrp_id, optn_id: '' })) ?? [],
      //   price:0,
      //   stock:0
      // })
    }
  }, [addVariantMutate.isSuccess])
  return {
    form,
    fields,
    checkKeyDown,
    onSubmit,
    productData: productQuery.data,
    showSelectPlaceholder,
    showSelectItems: showSelectItems,


  }
}

export default useVariantAddHook