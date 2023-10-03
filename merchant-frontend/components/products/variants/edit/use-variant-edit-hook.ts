import { useProductById } from "@/src/hooks/product/queries";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from 'zod'
import { formSchema, genId, showSelectPlaceholder } from "../add/variant-add-helper";
import { zodResolver } from "@hookform/resolvers/zod";

const useVariantEditHook = () => {
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
        //   addVariantMutate.mutate({ prodId: router.query.prodId as string, body: values })
        // addGroupMutate.mutate({ prodId: router.query.prodId as string, body: values })
        // mutate(values);
    }
    const initForm = (variant: IVariant) => {
        useEffect(() => {
            if (productQuery) {
                console.log("tets log")
                form.reset({
                    vrnt_id: variant.vrnt_id,
                    variant_selecteds: variant.variant_selecteds,
                    price:variant.price,
                    stock:variant.stock
                })
            }
        }, [productQuery.data])
    }

    return {
        form,
        fields,
        checkKeyDown,
        onSubmit,
        showSelectPlaceholder: showSelectPlaceholder,
        initForm,
        productData: productQuery.data

    }
}

export default useVariantEditHook