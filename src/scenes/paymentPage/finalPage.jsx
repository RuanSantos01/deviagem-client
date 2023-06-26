import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
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
import PersonIcon from '@mui/icons-material/Person';

const FinalPage = () => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:1100px)");

    const cart = useSelector((state) => state.cart);
    const paymentInformations = useSelector((state) => state.paymentInformations);
    const { codigo, formValues, cartInformations } = paymentInformations;

    const imagemHospedagemStyle = {
        backgroundImage: `url(http://localhost:3001/assets/${cart.selectedCard.cards.imageQuarto})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        borderRadius: '10px',
        width: isNonMobile ? "50%" : '100%',
        height: '20vh',
    };

    const imagemVooStyle = {
        backgroundImage: `url(http://localhost:3001/assets/${cartInformations.packages.imagem})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        borderRadius: '10px',
        width: isNonMobile ? "50%" : '100%',
        height: '20vh'
    };

    return (
        <Box sx={{
            width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: "center", backgroundColor: '#DCE0E6'
        }}>
            <Navbar />

            <Box sx={{ borderRadius: '10px', width: isNonMobile ? '65%' : '100%', padding: '30px', backgroundColor: 'white', height: '100%', minHeight: '90vh', margin: '10px', boxShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                {paymentInformations.listaCpfPendente.length > 1 ? (
                    <Typography sx={{ fontWeight: 'bold', color: blueColor, fontSize: isNonMobile ? '35px' : '24px' }}>Apenas todos os integrantes finalizarem seu pagamento, a reserva será efetuada com sucesso!</Typography>
                ) : (
                    <Typography sx={{ fontWeight: 'bold', color: blueColor, fontSize: isNonMobile ? '40px' : '24px' }}>Sua reserva foi efetuada com sucesso.</Typography>
                )}

                {formValues.qtdPagantes > 1 && (
                    <Box>
                        <hr style={{ width: '100%' }} />
                        <Typography sx={{ fontWeight: 'bold', color: blueColor, fontSize: '20px', fontFamily: 'Arial' }}>Código para os próximos pagantes: {codigo}</Typography>
                        <Typography sx={{ color: blueColor, fontSize: isNonMobile ? '17px' : '15px' }}>Para utilizar esse código basta colocá-lo na parte superior do site</Typography>
                    </Box>
                )}

                <Box sx={{ width: '100%', height: 'auto', border: `2px solid ${blueColor}`, borderRadius: '10px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', padding: '20px', gap: '2rem' }}>
                    <Typography sx={{ fontWeight: 'bold', color: blueColor, fontSize: '25px', width: '100%', textAlign: 'center' }}>Sobre sua reserva</Typography>
                    <hr style={{ marginTop: '-20px', width: '100%' }} />

                    <Box sx={{ display: 'flex', flexDirection: isNonMobile ? 'row' : 'column', height: isNonMobile ? '20vh' : '100%', marginTop: '-20px', justifyContent: 'space-between' }}>

                        {!isNonMobile && (
                            <Box sx={imagemHospedagemStyle} />
                        )}

                        <Box sx={{ display: 'flex', height: isNonMobile ? '100%' : '300px', flexDirection: 'column', marginRight: '10px', justifyContent: 'space-evenly', width: isNonMobile ? '50%' : '100%' }}>
                            <Box sx={{ width: '100%', height: '55px', display: 'flex', color: blueColor, gap: '0.5rem', alignItems: 'center', justifyContent: isNonMobile ? 'end' : 'start' }}>
                                {!isNonMobile && (
                                    <LocationOnIcon />
                                )}
                                <Typography sx={{ fontSize: '16px' }}>{cart.packages.hospedagem.nomeLocal},</Typography>
                                <Typography sx={{ fontSize: '16px' }}>{cart.packages.hospedagem.localizacao}</Typography>
                                {isNonMobile && (
                                    <LocationOnIcon />
                                )}
                            </Box>

                            <Box sx={{ width: '100%', height: '55px', display: 'flex', color: blueColor, gap: '0.5rem', alignItems: 'center', justifyContent: isNonMobile ? 'end' : 'start' }}>
                                {!isNonMobile && (<BedroomParentIcon />)}
                                <Typography sx={{ fontSize: '16px' }}>{cart.packages.hospedagem.tipoQuarto}</Typography>
                                {isNonMobile && (<BedroomParentIcon />)}

                            </Box>

                            <Box sx={{ width: '100%', height: '55px', display: 'flex', color: blueColor, gap: '0.5rem', alignItems: 'center', justifyContent: isNonMobile ? 'end' : 'start' }}>
                                {!isNonMobile && (<InfoIcon />)}
                                <Typography sx={{ fontSize: '16px' }}>{cart.packages.hospedagem.informacaoGeral}</Typography>
                                {isNonMobile && (<InfoIcon />)}
                            </Box>

                            {isNonMobile ? (
                                <Box sx={{ width: '100%', height: '55px', display: 'flex', color: blueColor, gap: '1rem', alignItems: 'center', justifyContent: 'end' }}>
                                    <Box>
                                        <Typography sx={{ fontSize: '16px' }}>Check-in</Typography>
                                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>até {moment(cart.estado.dias[cart.selectedDate].dataIda + ' ' + cart.estado.dias[cart.selectedDate].horaIda, 'DD [de] MMMM [às] HH:mm').add(6, 'hours').format('DD [de] MMMM [às] HH:mm')}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '16px' }}>Check-out</Typography>
                                        <Typography sx={{ fontSize: '16px', fontWeight: "bold" }}>até {moment(cart.estado.dias[cart.selectedDate].dataVolta + ' ' + cart.estado.dias[cart.selectedDate].horaVolta, 'DD [de] MMMM [às] HH:mm').subtract(1, 'hours').format('DD [de] MMMM [às] HH:mm')}</Typography>
                                    </Box>
                                    <CalendarMonthIcon sx={{ color: blueColor }} />
                                </Box>
                            ) : (
                                <Box sx={{ width: '100%', flexWrap: "wrap", height: 'auto', display: 'flex', color: blueColor, gap: '1rem', alignItems: 'center', justifyContent: isNonMobile ? 'end' : 'start' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CalendarMonthIcon sx={{ color: blueColor }} />
                                        <Box>
                                            <Typography sx={{ fontSize: '16px' }}>Check-in</Typography>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>até {moment(cart.estado.dias[cart.selectedDate].dataIda + ' ' + cart.estado.dias[cart.selectedDate].horaIda, 'DD [de] MMMM [às] HH:mm').add(6, 'hours').format('DD [de] MMMM [às] HH:mm')}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CalendarMonthIcon sx={{ color: blueColor }} />
                                        <Box>
                                            <Typography sx={{ fontSize: '16px' }}>Check-out</Typography>
                                            <Typography sx={{ fontSize: '16px', fontWeight: "bold" }}>até {moment(cart.estado.dias[cart.selectedDate].dataVolta + ' ' + cart.estado.dias[cart.selectedDate].horaVolta, 'DD [de] MMMM [às] HH:mm').subtract(1, 'hours').format('DD [de] MMMM [às] HH:mm')}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}



                        </Box>

                        {isNonMobile && (
                            <Box sx={imagemHospedagemStyle} />
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: isNonMobile ? 'row' : 'column', height: isNonMobile ? '20vh' : '100%', justifyContent: 'space-between' }}>

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

                            {isNonMobile ? (
                                <Box sx={{ width: '100%', height: '55px', display: 'flex', color: blueColor, gap: '1rem', alignItems: 'center' }}>
                                    <CalendarMonthIcon sx={{ color: blueColor }} />
                                    <Box>
                                        <Typography sx={{ fontSize: '16px' }}>Data ida</Typography>
                                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{cart.estado.dias[cart.selectedDate].dataIda}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '16px' }}>Data volta</Typography>
                                        <Typography sx={{ fontSize: '16px', fontWeight: "bold" }}>{cart.estado.dias[cart.selectedDate].dataVolta}</Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ width: '100%', height: 'auto', display: 'flex', flexWrap: 'wrap', color: blueColor, gap: '1rem', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <CalendarMonthIcon sx={{ color: blueColor }} />
                                        <Box>
                                            <Typography sx={{ fontSize: '16px' }}>Data ida</Typography>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{cart.estado.dias[cart.selectedDate].dataIda}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <CalendarMonthIcon sx={{ color: blueColor }} />
                                        <Box>
                                            <Typography sx={{ fontSize: '16px' }}>Data volta</Typography>
                                            <Typography sx={{ fontSize: '16px', fontWeight: "bold" }}>{cart.estado.dias[cart.selectedDate].dataVolta}</Typography>
                                        </Box>

                                    </Box>
                                </Box>
                            )}

                        </Box>

                    </Box>

                </Box>

                {paymentInformations.listaCpfPendente.length >= 1 && (
                    <Box sx={{ width: '100%', height: 'auto', border: `2px solid ${blueColor}`, padding: '10px', marginTop: '10px', borderRadius: '10px' }}>
                        <Typography sx={{ color: blueColor, fontSize: '1rem', fontWeight: 'bold' }}>CPF(s) informado(s) que ainda não realizaram o pagamento: </Typography>
                        <Box sx={{ display: 'flex', gap: '0.6rem', flexDirection: 'column' }}>
                            {paymentInformations.listaCpfPendente.map((item) => (
                                <Typography sx={{ display: 'flex', gap: '0.25rem', color: blueColor, alignItems: 'center' }}><PersonIcon />{item.cpf} - {item.nome}</Typography>
                            ))}
                        </Box>
                    </Box>
                )}

                <Link to="/home">
                    <Button sx={{ width: '100%', height: '50px', backgroundColor: blueColor, textAlign: 'center', marginTop: '20px', color: 'white', border: `1px solid ${blueColor}`, '&:hover': { color: blueColor } }}>Voltar para o menu</Button>
                </Link>
            </Box>
        </Box >
    )
}

export default FinalPage;