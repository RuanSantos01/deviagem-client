import { Box, Button, FormControl, ImageList, ImageListItem, InputLabel, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';

import PersonIcon from '@mui/icons-material/Person';
import DoneIcon from '@mui/icons-material/Done';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import HotelIcon from '@mui/icons-material/Hotel';
import AccommodationCard from 'widgets/AccommodationCard';
import { useState } from 'react';
import moment from 'moment';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setCart, setPaymentInformation } from 'state';
import TravelTable from 'components/TravelTable';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function srcset(image, size, rows = 1, cols = 1) {
    return {
        src: `https://deviagem-server.onrender.com/assets/${image.img}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `https://deviagem-server.onrender.com/assets/${image.img}?w=${size * cols}&h=${size * rows
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}

const PackageCartPage = () => {
    const isNonMobile = useMediaQuery("(min-width:650px)");
    const packages = useSelector((state) => state.package);

    const theme = useTheme();
    const blueColor = theme.palette.background.blue;

    const [selectedCard, setSelectedCart] = useState(null);
    const handleSelection = (e) => {
        setSelectedCart(e)
        setTrip({
            ...trip,
            valorTotal: parseFloat(trip.valor) + parseFloat(e.cards.valor * trip.diffDays),
            selectedCard: e
        })
    }

    const [distancia, setDistancia] = useState([]);
    async function fetchDistancias() {
        const response = await fetch(`https://deviagem-server.onrender.com/states/l/${packages.destino}`, {
            method: 'GET'
        });
        const data = await response.json();
        if (!data) {
            return;
        }

        const listaA = data.filter(estado => estado.nome.toLowerCase() !== packages.destino.toLowerCase())

        setDistancia(listaA);
    }

    const [estados, setEstados] = useState([])
    async function fetchStates() {
        const response = await fetch('https://deviagem-server.onrender.com/states/states', {
            method: 'GET',
        });
        const data = await response.json();
        const listaA = data.estados.filter(estado => estado.nome.toLowerCase() !== packages.destino.toLowerCase())
        setEstados(listaA);
    }

    const [estado, setEstado] = useState();

    useEffect(() => {
        fetchDistancias();
        fetchStates();
        mapingPackageImages();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (estado) {
            setSelectedCart()
        }
    }, [estado]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleChangeState = (e) => {
        const estadoSelecionado = distancia.find(es => es.nome === e.target.value);
        if (estadoSelecionado) {
            setEstado(estadoSelecionado);
            fetchIataCodes(estadoSelecionado.nome);
        }
    }


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const setRowCols = (item, index) => {
        const newIndex = index % 8;

        if (newIndex === 0) {
            item.rows = 2;
            item.cols = 2;
        } else if (newIndex === 1 || newIndex === 2) {
            item.rows = 1;
            item.cols = 1;
        } else if (newIndex === 3 || newIndex === 4) {
            item.rows = 1;
            item.cols = 2;
        } else if (newIndex === 5) {
            item.rows = 2;
            item.cols = 2;
        } else if (newIndex === 6 || newIndex === 7) {
            item.rows = 1;
            item.cols = 2;
        }

        return item;
    }

    const [packageImages, setPackageImages] = useState();
    const mapingPackageImages = () => {
        const mapping = packages.imagens.map((item) => ({ img: item }));
        setPackageImages(mapping.map((item, index) => setRowCols(item, index)))
    }

    const [iataCodeOrigem, setIataCodeOrigem] = useState();
    const [iataCodeDestino, setIataCodeDestino] = useState();

    const fetchIataCodes = async (origem) => {
        const reqBody = {
            origem,
            destino: packages.destino
        }

        const response = await fetch('https://deviagem-server.onrender.com/states/getIATAcodes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
        })

        const IATAcodes = await response.json();

        if (response.ok && IATAcodes) {
            setIataCodeOrigem(IATAcodes[0].IATA)
            setIataCodeDestino(IATAcodes[1].IATA)
        }
    }

    const [dataIncio, setDataInicio] = useState();
    const handleDataInicio = (dateCru) => {
        const date = new Date(dateCru);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        setDataInicio(`${year}-${month}-${day}`);
    }

    const [dataFim, setDataFim] = useState();
    const handleDataFim = (dateCru) => {
        const date = new Date(dateCru);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        setDataFim(`${year}-${month}-${day}`);
    }

    const [render, setRender] = useState(false);
    const handleSearchTrip = () => {
        setRender(true);
    }

    useEffect(() => {
        if (render) {
            return
        }
    }, [render])

    const [trip, setTrip] = useState();
    const handleSelectTrip = (trip) => {
        const dataIda = moment(trip.itineraries[0].segments[0].departure.at);
        const dataVolta = moment(trip.itineraries[1].segments[0].departure.at);
        const diffDays = moment(dataVolta).diff(moment(dataIda), 'days');
        setTrip({
            dataIdaCompleta: dataIda,
            dataIda: dataIda.format('DD [de] MMMM'),
            horaIda: dataIda.format('HH:mm'),
            dataVoltaCompleta: dataVolta,
            dataVolta: dataVolta.format('DD [de] MMMM'),
            horaVolta: dataVolta.format('HH:mm'),
            diffDays,
            selectedCard,
            valor: trip.price.total
        });
    }

    const handleButtonClick = () => {
        dispatch(setPaymentInformation({ paymentInformations: null }))
        dispatch(setCart({
            cart: {
                packages,
                estado,
                selectedDate: { dataIda: trip.dataIdaCompleta, dataVolta: trip.dataVoltaCompleta, diffDays: trip.diffDays },
                selectedCard,
                valorPassagem: parseFloat(trip.valor),
                valorFinal: parseFloat(trip.valorTotal)
            }
        }));
        navigate('/packages/cart/checkout')
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#E6ECF5' }}>
            <Navbar />
            <Box sx={{ width: isNonMobile ? '80%' : '100%', marginTop: '30px', marginBottom: '30px', display: 'flex', height: '100%', minHeight: '90vh', justifyContent: 'space-between', flexDirection: isNonMobile ? 'row' : 'column' }}>


                <Box sx={{ width: isNonMobile ? '70%' : '100%', marginTop: '15px', backgroundColor: 'white', borderRadius: isNonMobile ? '20px' : '4px', padding: '20px', boxShadow: isNonMobile ? '2px 2px 2px rgba(0,0,0,0.5)' : '0px 0px 6px rgba(0,0,0,0.5)', color: blueColor, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: isNonMobile ? '35px' : '27px' }}>Pacote para {packages.destino}</Typography>

                    <ImageList sx={{ width: '100%', height: 300 }} variant="quilted" cols={4} rowHeight={250}>
                        {packageImages && packageImages.map((item) => (
                            <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
                                <img
                                    {...srcset(item, 121, item.rows, item.cols)}
                                    alt={item.img}
                                    loading="lazy"
                                />
                            </ImageListItem>

                        ))}
                    </ImageList>


                    <Box sx={{ display: 'flex', gap: '0.5rem', border: `1px solid ${blueColor}`, width: '100%', borderRadius: '10px', padding: '10px' }}>
                        <Typography sx={{ fontSize: isNonMobile ? '18px' : '13px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><PersonIcon />Viagem para {packages.pessoas} pessoas</Typography>
                    </Box>


                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 'bold', fontSize: isNonMobile ? '20px' : '17px' }}><DoneIcon />Personalize seu pacote</Typography>

                    <Box sx={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <Box sx={{ width: '100%' }}>
                            <Typography>Primeiro me diga da onde partirá</Typography>
                            <FormControl fullWidth variant="filled" disabled={render}>
                                <InputLabel
                                    sx={{ color: blueColor, fontWeight: 'bold' }}
                                >Origem</InputLabel>
                                <Select
                                    value={estado}
                                    onChange={(e) => handleChangeState(e)}
                                    sx={{ backgroundColor: 'white' }}
                                >
                                    {estados.map((estado, i) => (
                                        <MenuItem key={i} value={estado.nome}>{estado.nome}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between' }}>
                            <Typography>Agora me diga o período que deseja viajar</Typography>
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'space-between' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        disabled={render}
                                        onChange={handleDataInicio}
                                        label={<span style={{ color: blueColor, fontWeight: "bold", fontSize: "1rem" }}>Data de Ida</span>}
                                        format="DD/MM/YYYY"
                                        sx={{ width: isNonMobile ? '48%' : '100%' }}
                                    />
                                </LocalizationProvider>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        disabled={render}
                                        onChange={handleDataFim}
                                        label={<span style={{ color: blueColor, fontWeight: "bold", fontSize: "1rem" }}>Data de Volta</span>}
                                        format="DD/MM/YYYY"
                                        sx={{ width: isNonMobile ? '48%' : '100%' }}
                                    />
                                </LocalizationProvider>
                            </Box>
                        </Box>

                        {render ? (
                            <Box sx={{ width: '100%' }}>
                                <Typography>Selecione sua passagem para continuar</Typography>
                                <TravelTable originLocationCode={iataCodeOrigem} destinationLocationCode={iataCodeDestino} departureDate={dataIncio} returnDate={dataFim} adults={packages.pessoas} render={render} handleSelectTrip={handleSelectTrip} />
                            </Box>
                        ) : (
                            <Button onClick={handleSearchTrip} sx={{ fontWeight: 'bold', width: '100%', backgroundColor: blueColor, border: `1px solid ${blueColor}`, height: '50px', color: 'white', '&:hover': { color: blueColor } }}>Buscar viagens</Button>
                        )}

                    </Box>


                    {trip && (
                        <Box sx={{ display: 'flex', gap: '0.5rem', width: '100%', borderRadius: '10px', padding: '15px', flexDirection: 'column' }}>
                            <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '18px' }}><HotelIcon />Hospedagem <strong>{trip ? `- ${trip.diffDays} diária(s)` : ''}</strong></Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {packages.hospedagem.quartos.map((h) => (
                                    <AccommodationCard
                                        key={h.id}
                                        cards={h}
                                        diffDays={trip.diffDays}
                                        handleSelection={handleSelection}
                                        isSelected={h.id === selectedCard?.cards.id}
                                    >
                                    </AccommodationCard>
                                ))}
                            </Box>
                        </Box>
                    )}

                </Box>

                <Box sx={{ width: isNonMobile ? '28%' : '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Box sx={{ height: 'auto', marginTop: '15px', backgroundColor: 'white', borderRadius: isNonMobile ? '20px' : '4px', padding: '20px', boxShadow: isNonMobile ? '2px 2px 2px rgba(0,0,0,0.5)' : '0px 0px 6px rgba(0,0,0,0.5)', color: blueColor, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                        <Typography sx={{ fontWeight: 'bold', fontSize: isNonMobile ? '35px' : '25px' }}>Informações sobre o pacote...</Typography>

                        {trip ? (
                            <Box sx={{ display: 'flex', gap: '0.5rem', width: '100%', borderRadius: '10px', padding: '15px', flexDirection: 'column', border: `1px solid ${blueColor}` }}>
                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: isNonMobile ? '18px' : '13px' }}><AirplaneTicketIcon /> <strong>Voo</strong> operado por<strong>aviadora interna</strong></Typography>
                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: isNonMobile ? '18px' : '17px' }}> <strong>Ida</strong>{trip.dataIda} às {trip.horaIda}</Typography>
                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: isNonMobile ? '18px' : '17px' }}> <strong>Volta</strong> {trip.dataVolta} às {trip.horaVolta}</Typography>
                            </Box>
                        ) : (
                            <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '18px' }}>Selecione de onde partirá para informações do Vôo</Typography>
                        )}

                        {trip && selectedCard && (
                            <Box sx={{ display: 'flex', gap: '0.5rem', width: '100%', borderRadius: '10px', padding: '15px', flexDirection: 'column', border: `1px solid ${blueColor}` }}>
                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: isNonMobile ? '18px' : '13px' }}><HotelIcon /> <strong>Hospedagem</strong></Typography>
                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: isNonMobile ? '18px' : '17px' }}> <strong>Check-in</strong> até {moment(trip.dataIda + ' ' + trip.horaIda, 'DD [de] MMMM [às] HH:mm').add(6, 'hours').format('DD [de] MMMM [às] HH:mm')}</Typography>
                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: isNonMobile ? '18px' : '17px' }}> <strong>Check-out</strong> até {moment(trip.dataVolta + ' ' + trip.horaVolta, 'DD [de] MMMM [às] HH:mm').subtract(1, 'hours').format('DD [de] MMMM [às] HH:mm')}</Typography>
                            </Box>
                        )}

                    </Box>

                    {trip && (
                        <Box sx={{ height: 'auto', marginTop: '15px', backgroundColor: 'white', borderRadius: isNonMobile ? '20px' : '4px', padding: '20px', boxShadow: isNonMobile ? '2px 2px 2px rgba(0,0,0,0.5)' : '0px 0px 6px rgba(0,0,0,0.5)', color: blueColor, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '35px' }}>Valores</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Typography sx={{ textDecoration: 'line-through', fontStyle: 'italic', fontSize: '17px', fontWeight: 'bold', color: 'grey' }}>R$ {(trip.valor * 1.1).toFixed(2)}</Typography>
                                <Typography sx={{ fontSize: '30px', color: '#FF4500', fontWeight: 'bold' }}>R$ {trip.valorTotal ? trip.valorTotal : trip.valor}</Typography>
                            </Box>
                            <Typography sx={{ fontSize: '17px', fontWeight: 'bold' }}>Este valor será dividido para {packages.pessoas} pessoas</Typography>

                            <hr style={{ width: '100%' }} />

                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontSize: '18px' }}>Diária(s)</Typography>
                                <Typography sx={{ fontSize: '18px' }}>{trip.diffDays}</Typography>
                            </Box>

                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontSize: '18px' }}>Passagem</Typography>
                                <Typography sx={{ fontSize: '18px' }}>R$ {trip.valor}</Typography>
                            </Box>

                            {selectedCard && (
                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontSize: '18px' }}>Hospedagem</Typography>
                                    <Typography sx={{ fontSize: '18px' }}>R$ {selectedCard.cards.valor * selectedCard.diffDays}</Typography>
                                </Box>
                            )}

                            {estado && selectedCard && (
                                <Button onClick={() => handleButtonClick()} sx={{ border: `1px solid ${blueColor}`, backgroundColor: blueColor, color: 'white', height: '50px', '&:hover': { color: blueColor } }}>Prosseguir com a compra</Button>
                            )}

                        </Box>
                    )}

                </Box>



            </Box>

        </Box>
    )
}

export default PackageCartPage;