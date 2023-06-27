import { Box, Typography } from '@mui/material';
import React from 'react'

import BedIcon from '@mui/icons-material/Bed';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { useSelector } from 'react-redux';

const CardCart = (props) => {
    const { formattedStartDate, formattedEndDate } = props;
    const { quarto } = useSelector((state) => state.cart)

    const backgroundAccommodation = {
        backgroundImage: `url(https://deviagem-server.onrender.com/assets/${quarto.image})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: "20%",
        borderRadius: '20px',
        height: '200px'
    }

    return (
        <Box sx={{ width: '90%', backgroundColor: '#DCE0E6', borderRadius: '20px', height: 'auto', padding: '20px', display: 'flex', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)' }}>
            <Box style={backgroundAccommodation}></Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '20px', color: 'black' }}>{quarto.nomeLocal}</Typography>
                <Typography sx={{ fontSize: '17px' }}>{quarto.localizacao}</Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BedIcon />{quarto.tipoQuarto}</Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CalendarMonthIcon />{formattedStartDate} - {formattedEndDate}</Typography>
            </Box>
        </Box>
    )
}

export default CardCart;