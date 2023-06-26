import { Box, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Navbar from 'scenes/navbar';
import AccommodationCard from 'widgets/AccommodationCard';
import AccommodationFilter from 'widgets/AccommodationFilter';
import BudgetFilter from 'widgets/BudgetFilter';
import PopularFilter from 'widgets/PopularFilter';

const AccommodationPage = () => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const [originalCards, setOriginalCards] = useState([]);
    const [nothing, setNothing] = useState(false);
    const [cards, setCards] = useState([]);

    const handleBudgetFilter = (e) => {
        let range = {};
        if (e === "1") {
            range.min = 0;
            range.max = 200;
        } else if (e === "2") {
            range.min = 200;
            range.max = 400;
        } else if (e === "3") {
            range.min = 400;
            range.max = 600;
        } else if (e === "4") {
            range.min = 600;
            range.max = 900;
        } else if (e === "5") {
            range.min = 900;
            range.max = 2000;
        } else {
            range.min = 0;
            range.max = 2000;
        }

        if (originalCards.length === 0) {
            setOriginalCards([...cards]);
        }

        const filteredCards = originalCards.filter(
            (card) => card.valor >= range.min && card.valor <= range.max
        );

        if (filteredCards.length === 0) {
            setNothing(true)
        } else {
            setNothing(false)
        }

        setCards([...filteredCards]);
    }

    const handleAccommodationFilter = (e) => {
        if (originalCards.length === 0) {
            setOriginalCards([...cards]);
        }

        const filteredCards = originalCards.filter(
            (card) => card.localizacao.toLowerCase().includes(e.destino.toLowerCase())
        );

        if (filteredCards.length === 0) {
            setNothing(true)
        } else {
            setNothing(false)
        }

        setCards([...filteredCards]);
    }

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('http://localhost:3001/accommodations', {
                method: 'GET',
            });
            const data = await response.json();
            setCards(data.Accommodations);
        }
        fetchData();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box sx={{ backgroundColor: '#DCE0E6' }}>
            <Navbar />

            <Box sx={{
                width: "100%",
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: '1rem',
                height: 'auto',
                marginTop: '15px'
            }}>
                <Box sx={{ width: '20%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <AccommodationFilter handleAccommodationFilter={handleAccommodationFilter} />
                    <BudgetFilter handleBudgetFilter={handleBudgetFilter} />
                    <PopularFilter />
                </Box>

                <Box sx={{ width: '60%', height: '100%', backgroundColor: blueColor, padding: '30px', display: 'flex', flexDirection: 'column', borderRadius: '10px', marginBottom: '100px' }}>
                    <Typography sx={{ fontSize: '50px', fontWeight: 'bold', color: 'white' }}>Encontre a sua próxima estadia</Typography>
                    <Typography sx={{ fontSize: '20px', color: 'white', marginBottom: '20px' }}>Pesquise por hotéis, pousadas e casas!</Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {nothing && (
                            <Box sx={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', fontSize: '20px', fontWeight: 'bold' }}>Não possuímos hospedagens com os filtros informados</Box>
                        )}
                        {cards && cards.length > 0 ? (
                            cards.map((card) => (
                                <AccommodationCard cards={card} />
                            ))
                        ) : (
                            <Typography sx={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>Carregando...</Typography>
                        )}


                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default AccommodationPage;