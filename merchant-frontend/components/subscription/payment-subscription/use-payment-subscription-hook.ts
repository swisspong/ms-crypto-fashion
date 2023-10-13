import { useCreateToken, useCreditCard } from '@/src/hooks/payment/mutations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { formSchema } from './payment-subscrioption-helper';
import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
const usePaymentSubscriptionHook = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const {
        mutateAsync: tokenHandler,
        isLoading: tokenLoading,
        isSuccess: tokenSuccess,
    } = useCreateToken();
    const { mutate: creditHandler, isLoading, isSuccess } = useCreditCard();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            number: "",
            security_code: "",
            expiration_month: undefined,
            expiration_year: undefined,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const omise: ICreateOmiseToken = {
            card: {
                ...values,
                expiration_month: parseInt(values.expiration_month),
                expiration_year: parseInt(values.expiration_year),
            },
        };
        const token = await tokenHandler(omise);
        console.log(token);

        const body: ICreateCreditCard = {
            amount_: 300,
            token: token.id,
        };

        creditHandler(body);
    }

    useEffect(() => {
        if (isSuccess) {
            router.push("/");
        }
    }, [isSuccess]);
    const onOpenChange = (o: boolean) => {
        if (!(tokenLoading || isLoading)) {
            setOpen(o)
        }
    }
    return {
        onSubmit,
        open,
        form,
        tokenLoading,
        isLoading,
        onOpenChange
    }
}

export default usePaymentSubscriptionHook