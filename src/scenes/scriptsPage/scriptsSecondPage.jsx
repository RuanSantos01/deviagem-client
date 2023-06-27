import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { useLocation } from 'react-router-dom';
import Navbar from 'scenes/navbar'

const tableStyle = {
    width: '80%',
    borderCollapse: 'collapse',
};

const thStyle = {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ccc',
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
};

const tdStyle = {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ccc',
};

const evenRowStyle = {
    backgroundColor: '#f9f9f9',
};

const ScriptsSecondPage = () => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:650px)");

    const { state } = useLocation();
    const roteiro = state.roteiro;

    const imageBanner = {
        backgroundImage: `url(http://localhost:3001/assets/${roteiro.imagem})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '500px',
    };

    return (
        <Box sx={{ width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'column', backgroundColor: '#DCE0E6', height: '100%', minHeight: '100vh' }}>
            <Navbar />

            <Box sx={{ width: '100%', backgroundColor: blueColor, height: '200px', margin: '20px 0px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 3px 2px rgba(0,0,0,0.3)' }}>
                <Box sx={{ width: '70%' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: isNonMobile ? '40px' : '25px', }}>Roteiro para {roteiro.destino}!</Typography>
                </Box>
            </Box>

            <Box sx={{ width: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'white' }}>
                <Box sx={imageBanner}></Box>

                <Typography sx={{ mt: '20px', p: '20px', textAlign: 'initial', fontSize: '2.3rem', color: blueColor, fontWeight: 'bold' }}>Um pouquinho sobre a cidade</Typography>
                <Typography sx={{ mt: '20px', p: '20px', textAlign: 'justify', fontSize: '1.4rem', whiteSpace: 'pre-line' }}>{roteiro.descricaoDestino}</Typography>

                <Typography sx={{ mt: '20px', p: '20px', textAlign: 'initial', fontSize: '2.3rem', color: blueColor, fontWeight: 'bold' }}>Roteiro para uma viagem super emocionante</Typography>

                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: '100px' }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Dia</th>
                                <th style={thStyle}>Manhã</th>
                                <th style={thStyle}>Tarde</th>
                                <th style={thStyle}>Noite</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roteiro.roteiro.map((item, index) => (
                                <tr key={index} style={index % 2 === 0 ? evenRowStyle : null}>
                                    <td style={tdStyle}>{item.dia}</td>
                                    <td style={tdStyle}>{item.manha}</td>
                                    <td style={tdStyle}>{item.tarde}</td>
                                    <td style={tdStyle}>{item.noite}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>


            </Box>

        </Box>
    )
}

export default ScriptsSecondPage