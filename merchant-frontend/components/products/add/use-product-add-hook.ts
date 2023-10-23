import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from "zod"
import { formSchema, items } from './products-add-helper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useAddProduct } from '@/src/hooks/product/mutations';
import { useCategories, useCategoriesMain } from '@/src/hooks/category/queries';
import { toast } from 'react-toastify';
const useProductAddHook = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        //  mode:"all",
        resolver: zodResolver(formSchema),
        defaultValues: {
            available: false,
            stock: 0,
            price: 0,
            payment_methods: [],
            // categories: [
            //   { cat_id: "123", name: "Shirt" },
            //   { cat_id: "1234", name: "Jeans" },
            // ],
        },
    });
    const router = useRouter();
    const { mutate, isLoading, isSuccess } = useAddProduct();
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "categories",
    });
    const {
        fields: catFields,
        append: catAppend,
        remove: catRemove,
    } = useFieldArray({
        control: form.control,
        name: "categories_web",
    });

    // TODO: Set column in DataTable

    const { data: categories, isLoading: catLoading } = useCategories({
        page: 1,
        per_page: 100,
    });
    const dataQeury = useCategoriesMain({
        page: 1,
        per_page: 100,
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // if (!id) addHandler(values)
        // else updateHandler(values)
        console.log(values);
        mutate(values);
    }

    const {
        fields: images,
        append: imageAppend,
        remove: imageRemove,
    } = useFieldArray({
        control: form.control,
        name: "image_urls",
    });

    useEffect(() => {
        const successFn = async () => {
            if (isSuccess) {
                toast.success("บันทึกสำเร็จ!", {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                router.push("/products");
            }
        }
        successFn()
    }, [isSuccess]);

    return {
        images,
        imageAppend,
        imageRemove,
        catAppend,
        catFields,
        catRemove,
        onSubmit,
        dataQeury,
        isLoading,
        catLoading,
        categories,
        fields,
        append,
        remove,
        form,
        items
    }
}

export default useProductAddHook