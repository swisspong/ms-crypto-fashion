import { useAddGroup } from '@/src/hooks/product/groups/mutations';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { formSchema, genId } from '../groups-helper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'
const useGroupsAddForm = () => {
    const router = useRouter()
    const addGroupMutate = useAddGroup();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vgrp_id: genId('vgrp')
        },
    });
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        addGroupMutate.mutate({ prodId: router.query.prodId as string, body: values })
        // mutate(values);
    }
    const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") e.preventDefault();
    };

    useEffect(() => {
        if (addGroupMutate.isSuccess) {
            form.reset({
                vgrp_id: genId('vgrp'),
                name: '',
                options: []
            })
        }
    }, [addGroupMutate.isSuccess])

    return {
        form,
        onSubmit,
        checkKeyDown,
    }
}

export default useGroupsAddForm