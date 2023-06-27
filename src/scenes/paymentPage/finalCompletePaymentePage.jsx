import { Box, Button, Typography, useTheme } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import { Link } from 'react-router-dom';
import moment from 'moment';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoIcon from '@mui/icons-material/Info';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PeopleIcon from '@mui/icons-material/People';

const FinalCompletePaymentePage = () => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;

    const paymentInformations = useSelector((state) => state.paymentInformations);
    const { cartInformations } = paymentInformations;

    const imagemHospedagemStyle = {
        backgroundImage: `url(https://deviagem-server.onrender.com/assets/${cartInformations.selectedCard.cards.imageQuarto})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        borderRadius: '10px',
        width: "50%",
        height: '20vh',
    };

    const imagemVooStyle = {
        backgroundImage: `url(https://deviagem-server.onrender.com/assets/${cartInformations.packages.imagem})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        borderRadius: '10px',
        width: "50%",
        height: '20vh'
    };

    return (
        <Box sx={{
            width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: "center", backgroundColor: '#DCE0E6'
        }}>
            <Navbar />

            <Box sx={{ borderRadius: '10px', width: '65%', padding: '30px', backgroundColor: 'white', height: '100%', minHeight: '90vh', margin: '10px', boxShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                <Typography sx={{ fontWeight: 'bold', color: blueColor, fontSize: '40px' }}>Seu pagamento foi efetuado com sucesso!</Typography>
                <Typography sx={{ color: blueColor, fontSize: '20px' }}>Um email foi enviado para você contendo todas as informações.</Typography>

                <Box sx={{ width: '100%', height: 'auto', border: `2px solid ${blueColor}`, borderRadius: '10px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', padding: '20px', gap: '2rem' }}>
                    <Typography sx={{ fontWeight: 'bold', color: blueColor, fontSize: '25px', width: '100%', textAlign: 'center' }}>Sobre sua reserva</Typography>
                    <hr style={{ marginTop: '-20px', width: '100%' }} />

                    <Box sx={{ display: 'flex', height: '20vh', marginTop: '-20px', justifyContent: 'space-between' }}>

                        <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: '10px', justifyContent: 'space-evenly', width: '50%' }}>
                            <Box sx={{ width: '100%', height: '55px', display: 'flex', color: blueColor, gap: '0.5rem', alignItems: 'center', justifyContent: 'end' }}>
                                <Typography sx={{ fontSize: '16px' }}>{cartInformations.packages.hospedagem.nomeLocal},</Typography>
                                <Typography sx={{ fontSize: '16px' }}>{cartInformations.packages.hospedagem.localizacao}</Typography>
                                <LocationOnIcon />
                            </Box>

                            <Box sx={{ width: '100%', height: '55px', display: 'flex', color: blueColor, gap: '0.5rem', alignItems: 'center', justifyContent: 'end' }}>
                                <Typography sx={{ fontSize: '16px' }}>{cartInformations.packages.hospedagem.tipoQuarto}</Typography>
                                <BedroomParentIcon />
                            </Box>

                            <Box sx={{ width: '100%', height: '55px', display: 'flex', color: blueColor, gap: '0.5rem', alignItems: 'center', justifyContent: 'end' }}>
                                <Typography sx={{ fontSize: '16px' }}>{cartInformations.packages.hospedagem.informacaoGeral}</Typography>
                                <InfoIcon />
                            </Box>

                            <Box sx={{ width: '100%', height: '55px', display: 'flex', color: blueColor, gap: '1rem', alignItems: 'center', justifyContent: 'end' }}>
                                <Box>
                                    <Typography sx={{ fontSize: '16px' }}>Check-in</Typography>
                                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>até {moment(cartInformations.estado.dias[cartInformations.selectedDate].dataIda + ' ' + cartInformations.estado.dias[cartInformations.selectedDate].horaIda, 'DD [de] MMMM [às] HH:mm').add(6, 'hours').format('DD [de] MMMM [às] HH:mm')}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '16px' }}>Check-out</Typography>
                                    <Typography sx={{ fontSize: '16px', fontWeight: "bold" }}>até {moment(cartInformations.estado.dias[cartInformations.selectedDate].dataVolta + ' ' + cartInformations.estado.dias[cartInformations.selectedDate].horaVolta, 'DD [de] MMMM [às] HH:mm').subtract(1, 'hours').format('DD [de] MMMM [às] HH:mm')}</Typography>
                                </Box>
                                <CalendarMonthIcon sx={{ color: blueColor }} />
                            </Box>

                        </Box>

                        <Box sx={imagemHospedagemStyle} />
                    </Box>

                    <Box sx={{ display: 'flex', height: '20vh', justifyContent: 'space-between' }}>
                        <Box sx={imagemVooStyle} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', marginLeft: '10px', width: '50%' }}>
                            <Box sx={{ width: '100%', height: '55px', display: 'flex', color: blueColor, gap: '0.5rem', alignItems: 'center' }}>
                                <LocationOnIcon />
                                <Typography sx={{ fontSize: '16px' }}>{cartInformations.packages.destino}</Typography>
                            </Box>

                            <Box sx={{ width: '100%', height: '55px', display: 'flex', color: blueColor, gap: '0.5rem', alignItems: 'center' }}>
                                <PeopleIcon />
                                <Typography sx={{ fontSize: '16px' }}>{cartInformations.packages.pessoas} Pessoas </Typography>
                            </Box>

                            <Box sx={{ width: '100%', height: '55px', display: 'flex', color: blueColor, gap: '0.5rem', alignItems: 'center' }}>
                                <LocalAtmIcon />
                                <Typography sx={{ fontSize: '16px' }}>R$ {cartInformations.packages.valorPassagem}</Typography>
                            </Box>

                            <Box sx={{ width: '100%', height: '55px', display: 'flex', color: blueColor, gap: '1rem', alignItems: 'center' }}>
                                <CalendarMonthIcon sx={{ color: blueColor }} />
                                <Box>
                                    <Typography sx={{ fontSize: '16px' }}>Data ida</Typography>
                                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{cartInformations.estado.dias[cartInformations.selectedDate].dataIda}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '16px' }}>Data volta</Typography>
                                    <Typography sx={{ fontSize: '16px', fontWeight: "bold" }}>{cartInformations.estado.dias[cartInformations.selectedDate].dataVolta}</Typography>
                                </Box>
                            </Box>

                        </Box>
                    </Box>

                </Box>

                <Link to="/home">
                    <Button sx={{ width: '100%', height: '50px', backgroundColor: blueColor, textAlign: 'center', marginTop: '20px', color: 'white', border: `1px solid ${blueColor}`, '&:hover': { color: blueColor } }}>Voltar para o menu</Button>
                </Link>
            </Box>
        </Box >
    )
}

export default FinalCompletePaymentePage;