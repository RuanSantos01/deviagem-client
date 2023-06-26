import { Box, Button, FormControl, FormControlLabel, Radio, RadioGroup, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react'

const BudgetFilter = (props) => {
    const { handleBudgetFilter } = props;
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const [value, setValue] = useState();

    const radioStyle = {
        color: 'white',
        fontSize: '25px',
    }

    const handleSubmit = () => {
        handleBudgetFilter(value);
    }

    const handleChange = (event) => {
        setValue(event.target.value)
    }

    return (
        <Box sx={{ width: '100%', backgroundColor: blueColor, marginBottom: '30px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '20px' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: 'white' }}>Filtrar por</Typography>
            <hr style={{ width: '100%' }} />
            <FormControl>
                <RadioGroup
                    onChange={handleChange}
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                >
                    <FormControlLabel value="1" control={<Radio sx={{ color: 'white' }} />} label={<span style={radioStyle}>R$ 0 - 200</span>} />
                    <FormControlLabel value="2" control={<Radio sx={{ color: 'white' }} />} label={<span style={radioStyle}>R$ 200 - 400</span>} />
                    <FormControlLabel value="3" control={<Radio sx={{ color: 'white' }} />} label={<span style={radioStyle}>R$ 400 - 600</span>} />
                    <FormControlLabel value="4" control={<Radio sx={{ color: 'white' }} />} label={<span style={radioStyle}>R$ 600 - 900</span>} />
                    <FormControlLabel value="5" control={<Radio sx={{ color: 'white' }} />} label={<span style={radioStyle}>R$ Mais de 900</span>} />
                    <FormControlLabel value="6" control={<Radio sx={{ color: 'white' }} />} label={<span style={radioStyle}>Sem filtro</span>} />
                    <Button onClick={() => handleSubmit()} sx={{ marginTop: '10px', backgroundColor: 'white', color: blueColor, height: '47px', fontWeight: 'bold', border: `1px solid ${blueColor}`, '&:hover': { color: 'white', border: '1px solid white' } }}>Aplicar</Button>
                </RadioGroup>
            </FormControl>
        </Box>
    )
}

export default BudgetFilter;