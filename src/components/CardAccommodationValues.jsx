import { useTheme } from '@emotion/react';
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import BedIcon from '@mui/icons-material/Bed';
import VerifiedIcon from '@mui/icons-material/Verified';

const CardAccommodationValues = (props) => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const { quarto } = props;

    return (
        <Box sx={{ width: '100%', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ padding: '24px' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '24px', color: blueColor }}>{quarto.tipoQuarto}</Typography>
                <Typography sx={{ fontSize: '18px' }}>{quarto.capacidade}</Typography>
            </Box>

            <Box style={{ display: 'flex' }} >

                <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '20px', margin: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', width: '100%', padding: '10px' }}>
                    <Typography>{quarto.adicional}</Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BedIcon />Standard</Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><VerifiedIcon />Tarifa Reembolsável</Typography>
                </Box>

                <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '20px', margin: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', width: '100%', padding: '20px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography><strong style={{ fontSize: '20px', color: blueColor }}>R$ {quarto.valor}</strong> / Diária</Typography>
                            <Typography>Total 7 diárias <strong style={{ color: blueColor }}>R$ {quarto.valor * 7}</strong></Typography>
                        </Box>

                        <Button type="submit" sx={{ border: `1px solid ${blueColor}`, borderRadius: '20px', color: blueColor, width: '100px', fontWeight: 'bold' }}>Selecionar esse</Button>

                    </Box>
                    <hr style={{ width: '100%' }} />
                    <Typography sx={{ display: 'flex', justifyContent: 'center' }}>Taxas inclusas |<strong style={{ color: blueColor }}>Em até 12x</strong></Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default CardAccommodationValues;