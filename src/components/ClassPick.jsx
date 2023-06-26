import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'

// ICONS
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ClassPick = (props) => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:1200px)");
    const refOne = useRef(null);
    const [open, setOpen] = useState('');

    const [numRooms, setNumRooms] = useState(1);
    const [numAdults, setNumAdults] = useState([1]);
    const [numChildren, setNumChildren] = useState([0]);

    const handleNumRoomsChange = (valor) => {
        const newNumRooms = valor;
        setNumRooms(newNumRooms);
        setNumAdults(Array(parseInt(newNumRooms)).fill(1));
        setNumChildren(Array(parseInt(newNumRooms)).fill(0));
    };

    const handleNumAdultsChange = (index, value) => {
        const newNumAdults = [...numAdults];
        newNumAdults[index] = Number(value);
        setNumAdults(newNumAdults);
    };

    const handleNumChildrenChange = (index, value) => {
        const newNumChildren = [...numChildren];
        newNumChildren[index] = Number(value);
        setNumChildren(newNumChildren);
    };

    const handleClassPick = () => {
        const objFinal = {
            numRooms,
            numAdults,
            numChildren
        }
        props.onApply(objFinal)
        setOpen(false);
    }

    useEffect(() => {
        document.addEventListener("keydown", hideOnEscape, true)
        document.addEventListener("click", hideOnClickOutside, true)
    }, [])

    const hideOnEscape = (e) => {
        if (e.key === "Escape") {
            setOpen(false)
        }
    }

    const hideOnClickOutside = (e) => {
        if (refOne.current && !refOne.current.contains(e.target)) {
            setOpen(false)
        }
    }

    const somaAdultos = numAdults.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const somaCriancas = numChildren.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const renderRooms = () => {
        const inputsAdicionais = []
        for (let i = 0; i < numRooms; i++) {
            inputsAdicionais.push(
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                    <hr style={{ width: '100%', margin: 0 }} />
                    <Typography sx={{ fontWeight: 'bold', marginBottom: '10px', marginTop: '20px' }}>Quarto {i + 1}</Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sc={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>Adultos</Typography>
                            <Typography>16 anos ou mais</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>

                            <Button disabled={numAdults[i] <= 1} onClick={(e) => handleNumAdultsChange(i, numAdults[i])}>
                                <RemoveIcon sx={{ color: blueColor }} />
                            </Button>
                            <input
                                type="number"
                                style={{ width: '30px', border: 0, padding: 0, marginLeft: '10px', textAlign: 'center', fontWeight: 'bold' }}
                                readOnly
                                min="1"
                                max="5"
                                value={numAdults[i]}
                            />
                            <Button disabled={numAdults[i] >= 5} onClick={() => handleNumAdultsChange(i, Number(numAdults[i] + 1))}>
                                <AddIcon sx={{ color: blueColor }} />
                            </Button>

                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sc={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>Crianças</Typography>
                            <Typography>Até 15 anos</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>


                            <Button disabled={numChildren[i] <= 1} onClick={() => handleNumChildrenChange(i, numChildren[i] - 1)} >
                                <RemoveIcon sx={{ color: blueColor }} />
                            </Button>
                            <input
                                type="number"
                                style={{ width: '30px', border: 0, padding: 0, marginLeft: '10px', textAlign: 'center', fontWeight: 'bold' }}
                                readOnly
                                min="1"
                                max="5"
                                value={numChildren[i]}
                            />
                            <Button disabled={numChildren[i] >= 3} onClick={() => handleNumChildrenChange(i, numChildren[i] + 1)}>
                                <AddIcon sx={{ color: blueColor }} />
                            </Button>


                        </Box>
                    </Box>
                </Box>
            )
        }
        return inputsAdicionais;
    }

    return (
        <Box sx={{
            position: 'relative',
            display: 'flex',
            top: isNonMobile ? '-35px' : '',
            alignItems: 'center',
            color: 'black',
            fontSize: '1rem',
            width: isNonMobile ? 'auto' : '100%'
        }}>
            <TextField
                fullWidth
                label="Viajantes e classe de voo"
                value={`${numRooms} quartos - ${somaAdultos} adultos, ${somaCriancas} crianças`}
                name="classe"
                variant="filled"
                onClick={() => setOpen(open => !open)}
                InputProps={{
                    style: { backgroundColor: "white", borderRadius: "4px" }
                }}
                InputLabelProps={{
                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    width: isNonMobile ? '200%' : '100%',
                    left: isNonMobile ? '50%' : '50%',
                    transform: 'translateX(-50%)',
                    top: '55px',
                    zIndex: '999'
                }}
                ref={refOne}>
                {open && (
                    <Box
                        sx={{
                            width: '100%',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            padding: '15px 6%',
                            boxShadow: "4px 4px 2px rgba(0, 0, 0, 0.3)"
                        }}
                    >
                        <Typography sx={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>{`${numRooms} quartos - ${somaAdultos} adultos, ${somaCriancas} crianças`}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sc={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography sx={{ fontWeight: 'bold' }}>Quartos</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button disabled={numRooms <= 1} onClick={() => handleNumRoomsChange(numRooms - 1)}>
                                    <RemoveIcon sx={{ color: blueColor }} />
                                </Button>
                                <input
                                    type="number"
                                    style={{ width: '30px', border: 0, padding: 0, marginLeft: '10px', textAlign: 'center', fontWeight: 'bold' }}
                                    readOnly
                                    min="1"
                                    max="5"
                                    value={numRooms}
                                />
                                <Button disabled={numRooms >= 5} onClick={() => handleNumRoomsChange(numRooms + 1)}>
                                    <AddIcon sx={{ color: blueColor }} />
                                </Button>
                            </Box>
                        </Box>

                        {renderRooms()}

                        <Button onClick={handleClassPick} sx={{ backgroundColor: blueColor, color: 'white', '&:hover': { color: blueColor, border: `1px solid ${blueColor}` } }}>Aplicar</Button>
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default ClassPick

