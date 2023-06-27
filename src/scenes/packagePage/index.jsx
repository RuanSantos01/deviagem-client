import { Box, Button, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import CardPackage from "components/CardPackage";
import { useState } from "react";
import { useEffect } from "react";
import Navbar from "scenes/navbar";

import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

const PackagePage = () => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:650px)");

    const [packages, setPackages] = useState([]);

    const [order, setOrder] = useState(1);

    const [tipoFiltro, setTipoFiltro] = useState(0);
    const [destiny, setDestiny] = useState('');

    async function fetchData() {
        const response = await fetch('https://deviagem-server.onrender.com/packages', {
            method: 'GET',
        });
        const data = await response.json();
        setPackages(data.packages);
    }

    useEffect(() => {
        fetchData();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        handleFilter();
    }, [order, destiny]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleDestino = (value) => {
        setDestiny(value.target.value)
        setTipoFiltro(1);
    }

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
                    <Typography sx={{ fontWeight: 'bold', fontSize: isNonMobile ? '40px' : '35px', }}>Pacotes para facilitar sua viagem!</Typography>
                    {isNonMobile && (
                        <Typography sx={{ fontSize: '17px', textAlign: 'justify' }}>Planeje sua próxima aventura, escolha seu destino e se prepare para aproveitar tudo o que temos a oferecer. Com a nossa ampla variedade de opções, você pode encontrar o lugar perfeito para desfrutar de paisagens deslumbrantes, culturas incríveis e experiências inesquecíveis. Não espere mais, comece a planejar sua viagem agora e deixe-nos ajudá-lo a tornar seus sonhos realidade!</Typography>
                    )}
                </Box>
            </Box>

            <form style={{ width: '70%', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', gap: '10px', flexDirection: isNonMobile ? 'row' : 'column' }}>
                <TextField
                    sx={{ width: '100%' }}
                    label='Destino'
                    value={destiny}
                    name="destino"
                    variant="filled"
                    onChange={(d) => handleDestino(d)}
                    InputProps={{
                        style: { backgroundColor: "white", borderRadius: "4px", fontWeight: 600 },
                        placeholder: 'Cidade ou estado',
                        startAdornment: <InputAdornment sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            paddingRight: '10px'
                        }}><SearchIcon sx={{ color: 'black' }} />
                        </InputAdornment>
                    }}
                    InputLabelProps={{
                        style: { color: blueColor, fontWeight: "bold", fontSize: "1rem", marginLeft: '30px' }
                    }}
                />

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

export default PackagePage;