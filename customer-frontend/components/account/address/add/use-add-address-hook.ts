import React, { useEffect, useState } from 'react'
import { formSchema } from './add-address-helper';
import { useForm } from 'react-hook-form';
import * as z from 'zod'
import { useCreateAddress } from '@/src/hooks/address/mutations';
import { zodResolver } from '@hookform/resolvers/zod';
const useAddAddressHook = () => {
    const [open, setOpen] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: '',
            post_code: '',
            recipient: '',
            tel_number: ''
        }
    });
    const addresMutate = useCreateAddress();
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        addresMutate.mutate(values);
        // signinHandler(values);
    }
    const onOpenChange = (open: boolean) => {
        if (!addresMutate.isLoading) {
            setOpen(open)
            form.reset({})
        }
    }
    useEffect(() => {
        if (addresMutate.isSuccess) {
            form.reset({
                address: '',
                post_code: '',
                recipient: '',
                tel_number: ''
            });
        }
        setOpen(false)
    }, [addresMutate.isSuccess]);

    return {
        form,
        onSubmit,
        addressLoading: addresMutate.isLoading,
        onOpenChange,
        open
    }
}

export default useAddAddressHook