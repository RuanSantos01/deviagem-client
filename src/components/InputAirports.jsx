import { Formik, useFormik } from 'formik';
import { autocomplete } from 'air-port-codes-node';
import { useEffect, useRef, useState } from 'react';
import { Box, InputAdornment, useMediaQuery, useTheme } from '@mui/material';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import { TextField } from 'formik-material-ui';


const MyForm = () => {
    const apca = autocomplete({
        key: '04af77382e',
        secret: 'c87049e666f922c',
        limit: 15
    });
    const refOne = useRef(null);
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:650px)");

    // TO
    const [termSelectedTo, setTermSelectedTo] = useState("");
    const [suggestionsTo, setSuggestionsTo] = useState([]);
    const [searchTermTo, setSearchTermTo] = useState("");
    const [openTo, setOpenTo] = useState(false);

    const handleAirportInputChangeTo = async (event) => {
        const term = event.target.value;
        setSearchTermTo(term);

        if (term.length >= 3) {
            setOpenTo(true)
            apca.request(term);
            apca.onSuccess = (data) => {
                setSuggestionsTo(data.airports)
            }
            apca.onError = (data) => {
                console.log('onError', data.message);
            };

        } else {
            setSuggestionsTo([]);
        }
    };

    const handleTermSelectedTo = (airport) => {
        setTermSelectedTo(`${airport.iata} - ${airport.name}`)
        Formik.setFieldValue('para', `${airport.iata} - ${airport.name}`)
        setOpenTo(false)
    };

    const hideOnClickOutsideTo = (e) => {
        if (refOne.current && !refOne.current.contains(e.target)) {
            setOpenTo(false)
        }
    };

    useEffect(() => {
        document.addEventListener("click", hideOnClickOutsideTo, true)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const formik = useFormik({
        initialValues: {
            para: ''
        },
        onSubmit: values => {
            console.log(values);
        }
    });


    return (
        <form onSubmit={formik.handleSubmit}>
            <Box sx={{
                position: 'relative',
                display: 'flex',
                top: '-35px',
                alignItems: 'center',
                color: 'black',
                fontSize: '1rem',
            }}>
                <TextField
                    label={isNonMobile ? 'Para' : ''}
                    value={termSelectedTo ? termSelectedTo : searchTermTo}
                    type="De"
                    variant="filled"
                    onChange={handleAirportInputChangeTo}
                    InputProps={{
                        style: { backgroundColor: "white", borderRadius: "4px", fontWeight: 600 },
                        placeholder: 'País, Cidade ou aeroporto',
                        startAdornment: isNonMobile ? (
                            <InputAdornment sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                paddingRight: '10px'
                            }}><FlightLandIcon sx={{ color: 'black' }} /></InputAdornment>
                        ) : (<></>)
                    }}
                    InputLabelProps={{
                        style: { color: blueColor, fontWeight: "bold", fontSize: "1rem", marginLeft: '30px' }
                    }}
                >
                    {searchTermTo.length >= 3 && openTo && (
                        <Box sx={{
                            position: 'absolute',
                            width: '150%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            top: '40px',
                            zIndex: '999',
                        }}>
                            <ul style={{
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                listStyle: 'none',
                                padding: '1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                {suggestionsTo.map((airport) => (
                                    <li
                                        key={airport.icao}
                                        onClick={() => handleTermSelectedTo(airport)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <LocalAirportIcon sx={{ color: 'black' }} />
                                        {airport.iata} - {airport.name}
                                    </li>
                                ))}
                            </ul>
                        </Box>
                    )}
                </TextField>


            </Box>
            <button type="submit">Submit</button>
        </form>
    );
};

export default MyForm;