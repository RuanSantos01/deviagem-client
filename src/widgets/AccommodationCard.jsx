import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react'
import StarRating from './StarRating';

const AccommodationCard = (props) => {
    const isNonMobile = useMediaQuery("(min-width:650px)");
    const { image, nomeLocal, localizacao, tipoQuarto, capacidade, tempoCapacidade, valor, adicional } = props.cards;
    const diffDays = props.diffDays;
    const handleSelection = props.handleSelection;
    const isSelected = props.isSelected;
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;

    const handleButtonClick = () => {
        if (!isSelected) {
            handleSelection(props)
        }
    }

    const backgroundAccommodation = {
        backgroundImage: `url(https://deviagem-server.onrender.com/assets/${image})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: isNonMobile ? "25%" : '100%',
        height: isNonMobile ? "auto" : "200px",
        borderRadius: '15px'
    }

    return (
        <Box sx={{ width: '100%', flexDirection: isNonMobile ? 'row' : 'column', height: isNonMobile ? '250px' : '500px', border: `1px solid ${'#BFD3F1'}`, backgroundColor: 'white', borderRadius: '15px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItens: 'center', boxShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>
            <Box style={backgroundAccommodation}></Box>
            <Box sx={{ width: isNonMobile ? '52%' : '100%', display: "flex", flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ color: '#567EBB', fontSize: isNonMobile ? '36px' : '20px', fontWeight: 'bold' }}>{nomeLocal}</Typography>
                    <Typography sx={{ color: '#567EBB', fontSize: isNonMobile ? '20px' : '15px' }}>{localizacao}</Typography>
                </Box>
                <Box sx={{ color: "#567EBB" }}>
                    <Typography sx={{ fontSize: isNonMobile ? '20px' : '15px' }}>{adicional}</Typography>
                    <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: isNonMobile ? '20px' : '15px' }}>{tipoQuarto}</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: isNonMobile ? '20px' : '15px' }}> - </Typography>
                        <Typography sx={{ fontSize: isNonMobile ? '20px' : '15px' }}>{capacidade}</Typography>
                    </Box>
                </Box>
            </Box >

            <Box sx={{ width: isNonMobile ? '20%' : '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ height: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'end' }}><StarRating rating={4} /></Box>
                <Box sx={{ display: ' flex', textAlign: 'end', flexDirection: 'column', gap: '1rem' }}>
                    <Box>
                        <Typography sx={{ fontSize: '18px' }}>{tempoCapacidade}</Typography>
                        {diffDays && (
                            <Typography sx={{ fontWeight: 'bold', fontSize: '30px', fontFamily: 'Arial' }}>R$ {valor * diffDays}</Typography>
                        )}
                    </Box>

                    <Button onClick={handleButtonClick} disabled={!diffDays} sx={{ backgroundColor: isSelected ? "#BFD3F1" : blueColor, color: 'white', height: '40px', '&:hover': { color: blueColor, border: `1px solid ${blueColor}` } }}>{isSelected ? "Escolhido" : "Escolho esse!"}</Button>
                    {!diffDays && (
                        <Typography sx={{ color: 'red' }}>Selecione a origem e a data</Typography>
                    )}
                </Box>
            </Box>
        </Box >
    )
}

export default AccommodationCard;