import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography, useMediaQuery, useTheme } from "@mui/material";
import CardPackage from "components/CardPackage";
import { useState } from "react";
import { useEffect } from "react";
import Navbar from "scenes/navbar";

import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from "react-redux";

const SearchPage = () => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:1200px)");
    const search = useSelector((state) => state.search);

    const [packages, setPackages] = useState([]);

    const [order, setOrder] = useState(1);

    const [tipoFiltro, setTipoFiltro] = useState(0);
    const [destiny, setDestiny] = useState('');

    async function fetchData() {
        const response = await fetch('http://localhost:3001/packages', {
            method: 'GET',
        });
        const data = await response.json();
        const pacotesDoDestino = data.packages.filter((pack) => pack.destino.toLowerCase().includes(search.para.toLowerCase()));
        const pacotes = pacotesDoDestino.filter((pack) => new Date(search.ida) >= new Date(pack.dataInicio) && new Date(search.volta) <= new Date(pack.dataFim));
        setPackages(pacotes);
    }

    useEffect(() => {
        fetchData();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        handleFilter();
    }, [order, destiny]) // eslint-disable-line react-hooks/exhaustive-deps


    const handleOrder = (value) => {
        setOrder(value.target.value);
        setTipoFiltro(2);
    }

    const handleFilter = () => {
        if (tipoFiltro === 2) {
            if (order === 2) {
                setPackages([...packages].sort((a, b) => a.valorPassagem - b.valorPassagem));
            } else if (order === 3) {
                setPackages([...packages].sort((a, b) => b.valorPassagem - a.valorPassagem));
            } else {
                fetchData();
            }
        } else if (tipoFiltro === 1) {
            if (destiny.length === 0) {
                fetchData();
            } else {
                setPackages(packages.filter((pack) => pack.destino.toLowerCase().includes(destiny.toLowerCase())))
            }
        }
    }

    const resetForm = () => {
        fetchData();
        setDestiny('');
        setOrder(1)
    }

    return (
        <Box sx={{ width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'column', backgroundColor: '#DCE0E6', height: '100%', minHeight: '100vh' }}>
            <Navbar />

            <Box sx={{ width: '100%', backgroundColor: blueColor, height: '200px', margin: '20px 0px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 3px 2px rgba(0,0,0,0.3)' }}>
                <Box sx={{ width: '70%' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: isNonMobile ? '40px' : '35px', }}>Preparados para viajar ?</Typography>
                    {isNonMobile && (
                        <Typography sx={{ fontSize: '17px', textAlign: 'justify' }}>Prepare-se para a sua próxima aventura! Descubra o destino dos seus sonhos e esteja pronto para aproveitar tudo o que temos a oferecer. Com uma ampla variedade de opções disponíveis, você encontrará o lugar perfeito para desfrutar de paisagens deslumbrantes, mergulhar em culturas incríveis e vivenciar experiências inesquecíveis. Não perca mais tempo, comece a planejar sua viagem agora mesmo e conte conosco para tornar seus sonhos realidade! Estamos aqui para ajudar você a criar memórias duradouras e momentos extraordinários. Seja bem-vindo ao mundo das possibilidades!</Typography>
                    )}
                </Box>
            </Box>

            <form style={{ width: '70%', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', gap: '10px', flexDirection: isNonMobile ? 'row' : 'column' }}>

                <FormControl fullWidth variant="filled">
                    <InputLabel
                        sx={{ color: blueColor, fontWeight: 'bold' }}
                    >Ordenar por</InputLabel>
                    <Select
                        label="Ordenar por"
                        value={order}
                        onChange={(e) => handleOrder(e)}
                        sx={{ backgroundColor: 'white' }}
                    >
                        <MenuItem value={1}>Ordenação padrão</MenuItem>
                        <MenuItem value={2}>Ordenar por menor preço</MenuItem>
                        <MenuItem value={3}>Ordenar por maior preço</MenuItem>
                    </Select>
                </FormControl>

                <Button onClick={() => resetForm()} sx={{ backgroundColor: 'red', color: 'white' }}><DeleteIcon /></Button>
            </form>

            <Box sx={{ display: 'flex', width: '70%', marginBottom: '20px' }}>

                <Grid container spacing={2} >
                    {packages && packages.map((pack, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CardPackage package={pack} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box >
    )
}

export default SearchPage;