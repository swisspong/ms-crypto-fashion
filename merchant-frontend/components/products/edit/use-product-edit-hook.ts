import { useProductById } from '@/src/hooks/product/queries';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { formSchema, items } from '../add/products-add-helper';
import * as z from "zod"
import { useEditProduct } from '@/src/hooks/product/mutations';
import { useCategories, useCategoriesMain } from '@/src/hooks/category/queries';
import { toast } from 'react-toastify';
const useProductEditFormHook = () => {
    const router = useRouter();
    const { data, isSuccess: prodSuccess } = useProductById(
        router.query.prodId as string
    );
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            //   available: true,
            //   name: "Smart Watch",
            //   sku: "SW-WHM-A",
            //   stock: 20,
            //   price: 100,
            //   description:
            //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut euismod enim, at rutrum urna. Etiam finibus, sapien vitae molestie laoreet, dolor massa ultrices urna, eget aliquam enim urna sit amet massa. Aliquam imperdiet erat id risus posuere blandit. Nam imperdiet diam lectus, id dapibus enim interdum sed. Curabitur fermentum.",
            //   image_url:
            //     "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
            //   categories: [
            //     { cat_id: "123", name: "Shirt" },
            //     { cat_id: "1234", name: "Jeans" },
            //   ],
        },
    });

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

    const { mutate, isLoading, isSuccess } = useEditProduct();
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
        mutate({ prodId: router.query.prodId as string, body: values });
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
        if (isSuccess) {
            toast.success("แก้ไขสำเร็จ!", {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            router.push("/products");
        }
    }, [isSuccess]);
    useEffect(() => {
        if (prodSuccess) {
            form.reset({
                available: data.available,
                categories: data.categories?.map((cat) => ({ cat_id: cat.cat_id })),
                categories_web: data.categories_web?.map((cat) => ({
                    cat_id: cat.catweb_id,
                })),
                description: data.description,
                image_urls: data.image_urls?.map((img) => ({ url: img })),
                name: data.name,
                price: data.price,
                sku: data.sku,
                stock: data.stock,
                payment_methods: data.payment_methods.map((payment) => payment),
            });
        }
    }, [prodSuccess]);

    return { form, onSubmit, isLoading, data, items, imageRemove, catFields, dataQeury, catRemove, catAppend, fields, categories, catLoading, append, remove }
}

export default useProductEditFormHook