import { Box, Button, InputAdornment, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import DateRangeCalendar from 'components/DateRangeCalendar';
import { useFormik } from 'formik';
import React, { useState } from 'react'

// ICONS
import SearchIcon from '@mui/icons-material/Search';
import OnlyNumbersTextField from 'components/OnlyNumbersTextField';

const AccommodationFilter = (props) => {
    const { handleAccommodationFilter } = props;
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:650px)");

    const [destiny, setDestiny] = useState('');

    const formik = useFormik({
        initialValues: {
            destino: '',
            ida: '',
            volta: '',
            hospedes: '',
            quartos: ''
        },
        onSubmit: values => {
            handleAccommodationFilter(values);
        }
    });

    const handleDestino = (value) => {
        setDestiny(value.target.value)
        formik.setFieldValue('destino', value.target.value)
    }
    const handleIda = (value) => {
        formik.setFieldValue('ida', value)
    }
    const handleVolta = (value) => {
        formik.setFieldValue('volta', value)
    }
    const handleHospedes = (value) => {
        formik.setFieldValue('hospedes', value)
    }
    const handleQuartos = (value) => {
        formik.setFieldValue('quartos', value)
    }

    return (
        <Box sx={{ width: '100%', backgroundColor: 'gold', marginBottom: '30px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '20px' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: blueColor }}>Pesquisar</Typography>
            <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <TextField
                    sx={{ width: '100%' }}
                    label='Destino'
                    value={destiny}
                    name="destino"
                    variant="filled"
                    onChange={(d) => handleDestino(d)}
                    InputProps={{
                        style: { backgroundColor: "white", borderRadius: "4px", fontWeight: 600 },
                        placeholder: 'Cidade ou estado',
                        startAdornment: <InputAdornment sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            paddingRight: '10px'
                        }}><SearchIcon sx={{ color: 'black' }} />
                        </InputAdornment>
                    }}
                    InputLabelProps={{
                        style: { color: blueColor, fontWeight: "bold", fontSize: "1rem", marginLeft: isNonMobile ? '30px' : '' }
                    }}
                />

                <DateRangeCalendar startDate={handleIda} endDate={handleVolta} filter={false} />

                <OnlyNumbersTextField quantidade={handleHospedes} tipo="hospede" />

                <OnlyNumbersTextField quantidade={handleQuartos} tipo="quarto" />

                <Button type='submit' sx={{ backgroundColor: blueColor, color: 'white', height: '47px', fontWeight: 'bold', border: `1px solid ${blueColor}`, '&:hover': { color: 'white', border: '1px solid white' } }}>Buscar</Button>
            </form>
        </Box>
    )
}

export default AccommodationFilter;