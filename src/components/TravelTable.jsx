import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import FlightIcon from '@mui/icons-material/Flight';
import moment from 'moment';

const TravelTable = (props) => {
    const { originLocationCode, destinationLocationCode, departureDate, returnDate, adults, render, handleSelectTrip } = props

    const [travels, setTravels] = useState();
    const fetchTravels = async () => {
        const travels = await fetch('http://localhost:3001/states/getTravels', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ originLocationCode, destinationLocationCode, departureDate, returnDate, adults })
        })

        const travelsReponse = await travels.json();
        if (travels.ok && travelsReponse) {
            setTravels(travelsReponse)
        }
    }

    useEffect(() => {
        fetchTravels()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [render])

    const isNonMobile = useMediaQuery("(min-width:650px)");

    const theme = useTheme();
    const blueColor = theme.palette.background.blue;

    const formatTime = (duration) => {
        const regex = /PT(\d+)H(\d+)M/;
        const match = duration.match(regex);

        if (match) {
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const formattedDuration = `${hours}h ${minutes}m`;
            return formattedDuration;
        } else {
            console.log("Duração inválida");
        }
    }

    const [travel, setTrip] = useState();
    const handleSelect = (trip) => {
        setTrip(trip)
        handleSelectTrip(trip)
    }

    return (
        <Box sx={{ width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            {travels ? (
                <Box sx={{ width: '100%', border: `1px solid ${blueColor}`, borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '10px' }}>
                    {travels.map((trip) => (
                        <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black', paddingBottom: '10px', flexDirection: isNonMobile ? 'row' : 'column ' }}>

                            <Box sx={{ width: isNonMobile ? '80%' : '100%', borderRight: isNonMobile ? `1px solid ${blueColor}` : '', height: 'auto' }}>
                                {/* IDA */}
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ width: '100%', display: 'flex', gap: isNonMobile ? '3rem' : '0', padding: '5px', height: '2.6rem' }}>
                                        <Box sx={{ width: '25%', display: 'flex', alignItens: 'center' }}>
                                            <Typography sx={{ display: 'flex', gap: '0.3rem', alignItems: 'center', fontWeight: 'bold' }}><FlightIcon sx={{ transform: 'rotate(90deg)' }} />IDA</Typography>
                                        </Box>

                                        <Box sx={{ width: '50%', display: 'flex' }}>
                                            <Box sx={{ width: isNonMobile ? '20%' : '30%', display: 'flex', alignItems: 'center' }}>
                                                <Typography sx={{ fontWeight: 'bold' }}>{trip.itineraries[0].segments[0].departure.iataCode}</Typography>
                                            </Box>
                                            <Box sx={{ width: isNonMobile ? '60%' : '40%' }}>

                                            </Box>
                                            <Box sx={{ width: isNonMobile ? '20%' : '30%', display: 'flex', alignItems: 'center' }}>
                                                <Typography sx={{ fontWeight: 'bold', textAlign: 'end', width: '100%' }}>{trip.itineraries[0].segments[0].arrival.iataCode}</Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography sx={{ fontWeight: 'bold', textAlign: 'center' }}>Duração</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ width: '100%', backgroundColor: '#C4C4C4', display: 'flex', gap: isNonMobile ? '3rem' : '0', alignItems: 'center', padding: '5px', height: '2.6rem' }}>
                                        <Box sx={{ width: '25%' }}>
                                            <Typography>{moment(trip.itineraries[0].segments[0].departure.at).format('ddd. DD MMM. YYYY')}</Typography>
                                        </Box>

                                        <Box sx={{ width: '50%', display: 'flex' }}>
                                            <Box sx={{ width: isNonMobile ? '20%' : '30%', display: 'flex', alignItems: 'center' }}>
                                                <Typography sx={{ width: '100%' }}>{moment(trip.itineraries[0].segments[0].departure.at).format('HH:mm')}</Typography>
                                            </Box>
                                            <Box sx={{ width: isNonMobile ? '60%' : '40%' }}>
                                                <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>Direto</Typography>
                                                <hr style={{ width: '100%', border: `1px solid ${blueColor}` }} />
                                            </Box>
                                            <Box sx={{ width: isNonMobile ? '20%' : '30%', display: 'flex', alignItems: 'center' }}>
                                                <Typography sx={{ textAlign: 'end', width: '100%' }}>{moment(trip.itineraries[0].segments[0].arrival.at).format('HH:mm')}</Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ width: '25%', textAlign: 'center' }}>
                                            {formatTime(trip.itineraries[0].segments[0].duration)}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* VOLTA */}
                                <Box>
                                    <Box sx={{ width: '100%', display: 'flex', gap: isNonMobile ? '3rem' : '0', padding: '5px', height: '2.6rem' }}>
                                        <Box sx={{ width: '25%', display: 'flex', alignItens: 'center' }}>
                                            <Typography sx={{ display: 'flex', gap: '0.3rem', alignItems: 'center', fontWeight: 'bold' }}><FlightIcon sx={{ transform: 'rotate(270deg)' }} />VOLTA</Typography>
                                        </Box>

                                        <Box sx={{ width: '50%', display: 'flex' }}>
                                            <Box sx={{ width: isNonMobile ? '20%' : '30%', display: 'flex', alignItems: 'center' }}>
                                                <Typography sx={{ fontWeight: 'bold' }}>{trip.itineraries[1].segments[0].departure.iataCode}</Typography>
                                            </Box>
                                            <Box sx={{ width: isNonMobile ? '60%' : '40%' }}>

                                            </Box>
                                            <Box sx={{ width: isNonMobile ? '20%' : '30%', display: 'flex', alignItems: 'center' }}>
                                                <Typography sx={{ fontWeight: 'bold', textAlign: 'end', width: '100%' }}>{trip.itineraries[1].segments[0].arrival.iataCode}</Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ width: '25%', display: 'flex', alignItems: "center", justifyContent: 'center' }}>
                                            <Typography sx={{ fontWeight: 'bold', textAlign: 'center' }}>Duração</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ width: '100%', backgroundColor: '#C4C4C4', display: 'flex', gap: isNonMobile ? '3rem' : '0', alignItems: 'center', padding: '5px', height: '2.6rem' }}>
                                        <Box sx={{ width: '25%' }}>
                                            <Typography>{moment(trip.itineraries[1].segments[0].departure.at).format('ddd. DD MMM. YYYY')}</Typography>
                                        </Box>

                                        <Box sx={{ width: '50%', display: 'flex' }}>
                                            <Box sx={{ width: isNonMobile ? '20%' : '30%', display: 'flex', alignItems: 'center' }}>
                                                <Typography sx={{ width: '100%' }}>{moment(trip.itineraries[1].segments[0].departure.at).format('HH:mm')}</Typography>
                                            </Box>
                                            <Box sx={{ width: isNonMobile ? '60%' : '40%' }}>
                                                <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>Direto</Typography>
                                                <hr style={{ width: '100%', border: `1px solid ${blueColor}` }} />
                                            </Box>
                                            <Box sx={{ width: isNonMobile ? '20%' : '30%', display: 'flex', alignItems: 'center' }}>
                                                <Typography sx={{ textAlign: 'end', width: '100%' }}>{moment(trip.itineraries[1].segments[0].arrival.at).format('HH:mm')}</Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ width: '25%', textAlign: 'center' }}>
                                            {formatTime(trip.itineraries[1].segments[0].duration)}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ width: isNonMobile ? '20%' : '100%', display: 'flex', flexDirection: 'column', paddingLeft: isNonMobile ? '10px' : '0px', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'end' }}>Preço por adulto</Typography>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'end', fontFamily: 'Arial' }}><span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>R$</span> {(trip.price.total / adults).toFixed(2)}</Typography>
                                </Box>

                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{adults} Adulto(s)</Typography>
                                    <Typography>R$ {trip.price.total}</Typography>
                                </Box>

                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Impostos, taxas e encargos</Typography>
                                    <Typography>R$0,0</Typography>
                                </Box>

                                <Button
                                    disabled={trip && travel ? trip.id === travel.id : false}
                                    onClick={() => handleSelect(trip)}
                                    sx={{ backgroundColor: blueColor, border: `1px solid ${blueColor}`, color: 'white', '&:hover': { color: blueColor } }}>{trip && travel && trip.id === travel.id ? "Selecionado" : "Selecionar"}</Button>
                            </Box>

                        </Box>
                    ))}
                </Box>
            ) : (
                <CircularProgress sx={{ color: blueColor }} />
            )}
        </Box>
    )
}

export default TravelTable