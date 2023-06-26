import { Box, Button, FormControl, FormControlLabel, Radio, RadioGroup, Typography, useTheme } from '@mui/material';
import React from 'react'

const PopularFilter = () => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;

    const radioStyle = {
        color: 'white',
        fontSize: '25px',
    }

    return (
        <Box sx={{ width: '100%', backgroundColor: blueColor, marginBottom: '30px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '20px' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: 'white' }}>Filtros Populares</Typography>
            <hr style={{ width: '100%' }} />
            <FormControl>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                >
                    <FormControlLabel value="1" control={<Radio sx={{ color: 'white' }} />} label={<span style={radioStyle}>Café da manhã</span>} />
                    <FormControlLabel value="2" control={<Radio sx={{ color: 'white' }} />} label={<span style={radioStyle}>Ar condicionado</span>} />
                    <FormControlLabel value="3" control={<Radio sx={{ color: 'white' }} />} label={<span style={radioStyle}>Wifi Gratuito</span>} />
                    <FormControlLabel value="4" control={<Radio sx={{ color: 'white' }} />} label={<span style={radioStyle}>Piscina</span>} />
                    <Button type='submit' sx={{ marginTop: '10px', backgroundColor: 'white', color: blueColor, height: '47px', fontWeight: 'bold', border: `1px solid ${blueColor}`, '&:hover': { color: 'white', border: '1px solid white' } }}>Aplicar</Button>
                </RadioGroup>
            </FormControl>
        </Box>
    )
}

export default PopularFilter