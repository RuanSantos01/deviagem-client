import { Box, Button, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Card from './Card';

export default function Carousel() {
    const isNonMobile = useMediaQuery("(min-width:650px)");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [packages, setPackages] = useState([]);

    const handleNext = () => {
        setCurrentIndex(currentIndex === packages.length - 1 ? 0 : currentIndex + 1);
    };

    const handlePrev = () => {
        setCurrentIndex(currentIndex === 0 ? packages.length - 1 : currentIndex - 1);
    };


    useEffect(() => {
        async function fetchData() {
            const response = await fetch('http://localhost:3001/packages', {
                method: 'GET',
            });
            const data = await response.json();
            setPackages(data.packages);
        }
        fetchData();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '1.4rem' }}>
            <Button
                disabled={currentIndex === 0}
                onClick={handlePrev}
                sx={{
                    fontSize: '70px',
                    color: 'white'
                }}>&#129168;
            </Button>

            {isNonMobile ? (
                <>
                    {packages.slice(currentIndex, currentIndex + 3).map((item, index) => (
                        <Card key={index} destino={item.destino} item={item} imagem={item.imagem} cem={item.cem} valor={item.valorPassagem}></Card>
                    ))}
                </>

            ) : (
                <>
                    {packages.slice(currentIndex, currentIndex + 1).map((item, index) => (
                        <Card key={index} destino={item.destino} item={item} imagem={item.imagem} cem={item.cem} valor={item.valorPassagem}></Card>
                    ))}
                </>
            )}


            <Button
                disabled={isNonMobile ? currentIndex === packages.length - 3 : currentIndex === packages.length - 1}
                onClick={handleNext}
                sx={{
                    fontSize: '70px',
                    color: 'white'
                }}>&#129170;
            </Button>
        </Box>
    );
};