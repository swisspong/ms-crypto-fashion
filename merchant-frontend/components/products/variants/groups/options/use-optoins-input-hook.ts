import React, { useState } from 'react'
import { Control, useFieldArray } from 'react-hook-form';
import { genId } from '../groups-helper';

const useOptionsInputHook = (
    control: Control<
        {
            name: string;
            options: {
                name: string;
                optn_id: string;
            }[];
            vgrp_id: string;
        },
        any
    >, cb?: () => void,) => {
    const [value, setValue] = useState<string | undefined>();
    const { fields, append, remove } = useFieldArray({
        control: control,
        name: 'options',
    });
    const setValueHandler = (str: string) => {
        setValue(str)
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            // 👇 Get input value
            // setUpdated(message);
            if (value && !fields.find((item) => item.name === value)) {
                append({ optn_id: genId("optn"), name: value });
                cb ? cb() : null;
                setValue("");
            }
        }
    };
    return {
        handleKeyDown,
        fields,
        remove,
        setValueHandler,
        value,
    }
}

export default useOptionsInputHook