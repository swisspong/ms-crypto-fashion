import { useProductById } from "@/src/hooks/product/queries";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from 'zod'
import { formSchema, genId, showSelectItems, showSelectPlaceholder, showSelectValue } from "../add/variant-add-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditVariant } from "@/src/hooks/product/variant/mutations";
import { toast } from "react-toastify";

const useVariantEditHook = () => {
    const [isEdit, setIsEdit] = useState<boolean>(false)

    const [open, setOpen] = useState<boolean>(false)
    const editMutate = useEditVariant()
    const router = useRouter()
    const productQuery = useProductById(
        router.query.prodId as string
    );
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

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
        editMutate.mutate({ prodId: router.query.prodId as string, body: values })
        setIsEdit(false)
    }
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
        }
    }, [editMutate.isSuccess])
    const initForm = (variant: IVariant) => {
        useEffect(() => {
            if (productQuery) {
                console.log("tets log")
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
                    stock: variant.stock
                })
            }
        }, [productQuery.data, productQuery.isSuccess, open])
    }
    const toggleEdit = () => {
        setIsEdit(prev => !prev)
    }
    const cancelForm = (variant: IVariant) => {
        form.reset({
            vrnt_id: variant.vrnt_id,
            variant_selecteds: variant.variant_selecteds,
            price: variant.price,
            stock: variant.stock
        })
        setIsEdit(false)
    }
    const toggleHandler = (value: boolean) => {
        setOpen(value)
    }
    return {
        form,
        fields,
        checkKeyDown,
        onSubmit,
        showSelectPlaceholder: showSelectPlaceholder,
        initForm,
        productData: productQuery.data,
        showSelectItems,
        showSelectValue,
        isEdit,
        toggleEdit,
        cancelForm,
        open,
        toggleHandler
    }
}

export default useVariantEditHook