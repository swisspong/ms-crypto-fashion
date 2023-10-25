import React, { useEffect, useState } from 'react'
import { formSchema, showSelectItems, showSelectPlaceholder, showSelectValue } from '../add/variant-add-helper';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'
import { useRouter } from 'next/router';
import { useProductById } from '@/src/hooks/product/queries';
import { useEditVariant, useEditVariantAdvanced } from '@/src/hooks/product/variant/mutations';
import { toast } from 'react-toastify';
const useVariantAdvancedHook = () => {
    const [open, setOpen] = useState(false)
    const router = useRouter();
    const editMutate = useEditVariantAdvanced()
    const productQuery = useProductById(
        router.query.prodId as string
    );
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        values.variant_selecteds = values.variant_selecteds.filter(vrnts => vrnts.optn_id !== '' && vrnts.optn_id !== 'none')
        editMutate.mutate({ prodId: router.query.prodId as string, body: values })
    }
    const { fields } = useFieldArray({
        control: form.control,
        name: "variant_selecteds",
    });
    const imageValue = useWatch({
        control: form.control,
        name: "image_url", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
        //defaultValue: "default", // default value before the render
    });

    const toggle = () => {
        setOpen(prev => !prev)
    }
    //   useEffect(() => {
    //     if (isSuccess) {
    //       const variant = data.variants.find((vrnt) => vrnt.vrnt_id === id);
    //       console.log("adnvaced", variant);
    //       if (variant) {
    //         form.reset({
    //           price: variant.price,
    //           stock: variant.stock,
    //           variant_selecteds: variant.variant_selecteds,
    //           image_url: variant.image_url,
    //         });
    //       }
    //     }
    //   }, [isSuccess, id]);
    const useInitForm = (variant: IVariant, open: boolean) => {
        useEffect(() => {
            if (productQuery || open) {
                form.reset({
                    vrnt_id: variant.vrnt_id,
                    //variant_selecteds: variant.variant_selecteds,
                    variant_selecteds: productQuery.data?.groups.map(group => {
                        const optnId = variant.variant_selecteds.find(vrnts => vrnts.vgrp_id === group.vgrp_id && group.options.some(optn => vrnts.optn_id === optn.optn_id))?.optn_id ?? ""
                        return {
                            optn_id: optnId,
                            vgrp_id: group.vgrp_id
                        }
                    }) ?? [],
                    price: variant.price,
                    stock: variant.stock,
                    image_url: variant.image_url
                })
            }
        }, [productQuery.data, productQuery.isSuccess, open])
    }
    const useWhenEditSuccess = (cb: () => void) => {
        useEffect(() => {
            if (editMutate.isSuccess) {
                toast.success("แก้ไขสำเร็จ!", {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                cb()
            }
        }, [editMutate.isSuccess])
    }
    return {
        imageValue,
        fields,
        onSubmit,
        open,
        editLoading: editMutate.isLoading,
        form,
        productData: productQuery.data,
        useInitForm,
        toggle,
        useWhenEditSuccess,
        showSelectValue,
        showSelectPlaceholder: showSelectPlaceholder,
        showSelectItems: showSelectItems
    }
}

export default useVariantAdvancedHook