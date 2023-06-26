import { TextField, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import InputMask from 'react-input-mask';

const PhoneInput = ({ handleChange, value }) => {
    const [mask, setMask] = useState("(99) 99999-9999");
    const isNonMobile = useMediaQuery("(min-width:700px)");

    return (
        <InputMask
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            mask={mask}
            onBlur={e => {
                if (e.target.value.replace("_", "").length === 14) {
                    setMask("(99) 9999-9999");
                }
            }}
            onFocus={e => {
                if (e.target.value.replace("_", "").length === 14) {
                    setMask("(99) 99999-9999");
                }
            }}
        >
            {(inputProps) => (
                <TextField
                    sx={{ width: isNonMobile ? '100%' : '50%' }}
                    label="Celular"
                    {...inputProps}
                />
            )}
        </InputMask>
    );
};

export default PhoneInput;