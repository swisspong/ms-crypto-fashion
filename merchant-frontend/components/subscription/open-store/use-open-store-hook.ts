import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod'
import { formSchema } from './open-store-helper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCredentialMerchant } from '@/src/hooks/merchant/mutations';
const useOpenStoreHook = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const credentialMutate = useCredentialMerchant();
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        credentialMutate.mutate(values);
        // mutate(values)
    }

    useEffect(() => {
        if (credentialMutate.isSuccess) router.push('/');
    }, [credentialMutate.isSuccess])

    return {
        onSubmit,
        form,
        loading: credentialMutate.isLoading,
        success: credentialMutate.isSuccess

    }
}

export default useOpenStoreHook