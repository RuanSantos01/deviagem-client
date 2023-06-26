import { useTheme } from "@emotion/react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import ImageGalleryElastic from "components/ImageGalleryElastic";
import MyMap from "components/Map";
import { useLocation } from "react-router-dom";
import Navbar from "scenes/navbar";
import StarRating from "widgets/StarRating";

const ReserveAccommodation = () => {
    const { state } = useLocation();
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const card = state.hospedagem;
    const { geoLocalizacao, images } = card;
    const url = `https://www.google.com/maps?q=${geoLocalizacao[0]},${geoLocalizacao[1]}`
    const isNonMobile = useMediaQuery("(min-width:650px)");

    return (

        <Box sx={{ backgroundColor: '#DCE0E6' }}>
            <Navbar />

            <Box sx={{
                width: "100%",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: "column",
                gap: '1rem',
                height: 'auto',
                marginTop: '15px',
                marginBottom: '20px',
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)'
            }}>

                <Box sx={{ width: '80%', height: isNonMobile ? '200px' : 'auto', display: 'flex', flexDirection: isNonMobile ? 'row' : 'column', justifyContent: 'space-between', margin: '10px', paddingBottom: '15px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: isNonMobile ? '' : '1rem' }}>
                        <Box>
                            <Typography sx={{ display: 'flex', gap: '1rem', fontWeight: 'bold', fontSize: isNonMobile ? '30px' : '20px', color: blueColor, flexDirection: isNonMobile ? 'row' : 'column' }}>{card.nomeLocal} <StarRating rating={4} /></Typography>
                            <Typography sx={{ fontWeight: 'bold', color: blueColor, fontSize: isNonMobile ? '20px' : '15px' }}>{card.localizacao}</Typography>
                        </Box>
                        {isNonMobile && (
                            <Typography sx={{ fontWeight: 'bold', color: blueColor, fontSize: '20px' }}>{card.localizacaoCompleta}</Typography>
                        )}
                    </Box>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        <MyMap latitude={geoLocalizacao[0]} longitude={geoLocalizacao[1]} nome={card.nomeLocal} />
                    </a>
                    {!isNonMobile && (
                        <Typography sx={{ fontWeight: 'bold', color: blueColor, fontSize: isNonMobile ? '20px' : '10px' }}>{card.localizacaoCompleta}</Typography>
                    )}
                </Box>

                <Box sx={{ backgroundColor: 'white', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '15px' }}>
                    <Box sx={{ width: '80%', marginBottom: '20px' }}>
                        <ImageGalleryElastic images={images} />
                    </Box>
                    <Typography sx={{ width: '80%', color: blueColor, fontSize: isNonMobile ? '20px' : '15px', textAlign: 'justify', marginBottom: '20px' }}>{card.descricao}</Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginBottom: '25px', flexDirection: isNonMobile ? 'row' : 'column', gap: isNonMobile ? '' : '1rem' }}>
                        {card.informacoesAdicionais.map((item) => (
                            <Box sx={{ width: 'auto', padding: '10px', border: `2px solid ${blueColor}`, borderRadius: '10px' }}>
                                <Typography sx={{ fontWeight: 'bold', color: blueColor }}>
                                    {item}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>


            </Box>

            <Box sx={{
                width: "100%",
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: "column",
                gap: '1rem',
                height: 'auto',
                marginBottom: '20px',
                boxShadow: '0 -2px 4px 0 rgba(0, 0, 0, 0.5)'
            }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '30px', marginTop: '15px' }}>Comentários de clientes</Typography>
                <Box sx={{ width: isNonMobile ? '80%' : '90%', display: 'flex', justifyContent: 'space-between', padding: '20px', flexWrap: 'wrap', gap: isNonMobile ? '' : '1rem' }}>
                    <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: isNonMobile ? '20%' : '45%', padding: '15px' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Fabiana</Typography>
                        <Typography>"Localização, facilidade como estacionamento, quarto em si e o café da manhã."</Typography>
                    </Box>
                    <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: isNonMobile ? '20%' : '45%', padding: '15px' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Sandro</Typography>
                        <Typography>"Localização muito boa Hotel moderno e aconchegante Equipe qualificada e um ótimo café da manhã."</Typography>
                    </Box>
                    <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: isNonMobile ? '20%' : '45%', padding: '15px' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Daniela</Typography>
                        <Typography>"Quarto moderno aconchegante e confortável com otimo cafe da manha"</Typography>
                    </Box>
                    <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: isNonMobile ? '20%' : '45%', padding: '15px' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Sergio</Typography>
                        <Typography>"Dos funcionário da recepção e do restaurante, todos atenciosos, simpáticos e prestativos."</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
export default ReserveAccommodation;