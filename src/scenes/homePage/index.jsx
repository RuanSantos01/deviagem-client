import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Navbar from 'scenes/navbar';
import * as yup from "yup";
import { Formik, useFormik } from 'formik';
import ClassPick from 'components/ClassPick';

// IMAGENS
import bannerHome2 from 'assets/background-home2.png';
import bannerPlanejamento from 'assets/background-planejamento.png';
import bannerRoteiros2 from 'assets/background-roteiros2.png';

// import { autocomplete } from 'air-port-codes-node';
import Carousel from 'widgets/Carousel';

// DATEPICKER
import DateRangeCalendar from 'components/DateRangeCalendar';

// ICONS
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import WorkIcon from '@mui/icons-material/Work';

// AIRPORT
import { useDispatch } from 'react-redux';
import { setSearch } from 'state';
import { useNavigate } from 'react-router-dom';

const imagemStyle = {
  backgroundImage: `url(${bannerHome2})`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  width: "100%",
  height: "21vh"
};

const initialValues = {
  de: '',
  para: '',
  ida: '',
  volta: '',
  classe: ''
}
const validationValues = yup.object().shape({
  de: yup.string(),
  para: yup.string(),
  ida: yup.date(),
  volta: yup.date(),
  classe: yup.string()
});

const HomePage = () => {
  const theme = useTheme();
  const blueColor = theme.palette.background.blue;
  const isNonMobile = useMediaQuery("(min-width:1200px)");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const imagemPlanejamento = {
    backgroundImage: `url(${bannerPlanejamento})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: isNonMobile ? '45%' : '90%',
    height: '300px',
    borderRadius: '40px'
  };

  const imagemRoteiros = {
    backgroundImage: `url(${bannerRoteiros2})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    width: isNonMobile ? '45%' : '90%',
    height: '300px',
    borderRadius: '40px'
  };

  // CALENDAR
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // DE PARA 
  const [states, setStates] = useState([])
  async function fetchStates() {
    const response = await fetch('https://deviagem-server.onrender.com/states/states', {
      method: 'GET',
    });
    const data = await response.json();
    setStates(data.estados);
  }


  const formik = useFormik({
    initialValues: {
      de: '',
      para: '',
      ida: '',
      volta: '',
      classe: {
        numAdults: [1],
        numChildren: [0],
        numRooms: 1
      }
    },
    onSubmit: values => {
      if (
        formik.values.de === '' |
        formik.values.para === '' |
        formik.values.ida === '' |
        formik.values.volta === '') {
        alert('Preencha todos os campos')
      } else {
        dispatch(setSearch({ search: values }))
        navigate('/resultfilter')
      }
    }
  });

  const handleStartDate = (newStartDate) => {
    setStartDate(newStartDate)
    formik.setFieldValue('ida', startDate)
  }
  const handleEndDate = (newEndDate) => {
    setEndDate(newEndDate)
    formik.setFieldValue('volta', endDate)
  }

  const handleSubmitClass = (values) => {
    formik.setFieldValue('classe', values)
  }

  useEffect(() => {
    fetchStates();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <Box sx={{ width: '100vw', overflowX: 'hidden' }}>
      <Navbar />
      <Box sx={{
        backgroundColor: blueColor,
        width: "100%",
        height: "auto",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={imagemStyle}></div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationValues}
        >
          {({ values }) => (
            <form onSubmit={formik.handleSubmit}>
              {isNonMobile ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: 'center',
                    gap: "1rem",
                    justifyContent: "space-evenly"
                  }}>


                  <FormControl variant="filled" sx={{
                    position: 'relative',
                    display: 'flex',
                    top: '-35px',
                    alignItems: 'center',
                    color: 'black',
                    fontSize: '1rem',
                  }}>
                    <InputLabel sx={{
                      color: blueColor, fontWeight: 'bold', display: 'flex',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}> <FlightTakeoffIcon sx={{ color: 'black' }} />Origem</InputLabel>
                    <Select
                      value={formik.values.de}
                      onChange={(e) => formik.setFieldValue('de', e.target.value)}
                      sx={{ backgroundColor: "white", borderRadius: "4px", fontWeight: 600, width: '200px', '&:hover': { backgroundColor: 'white' } }}
                      SelectDisplayProps={{
                        style: {
                          backgroundColor: 'white',
                          borderRadius: '4px'
                        }
                      }}
                    >
                      {states && states.map((estado, i) => (
                        <MenuItem key={i} value={estado.nome}>{estado.nome}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>


                  <FormControl variant="filled" sx={{
                    position: 'relative',
                    display: 'flex',
                    top: '-35px',
                    alignItems: 'center',
                    color: 'black',
                    fontSize: '1rem',
                  }}>
                    <InputLabel sx={{
                      color: blueColor, fontWeight: 'bold', display: 'flex',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}> <FlightLandIcon sx={{ color: 'black' }} />Destino</InputLabel>
                    <Select
                      value={formik.values.para}
                      onChange={(e) => formik.setFieldValue('para', e.target.value)}
                      sx={{ backgroundColor: "white", borderRadius: "4px", fontWeight: 600, width: '200px', '&:hover': { backgroundColor: 'white' } }}
                      SelectDisplayProps={{
                        style: {
                          backgroundColor: 'white',
                          borderRadius: '4px'
                        }
                      }}
                    >
                      {states && states.map((estado, i) => (
                        <MenuItem key={i} value={estado.nome}>{estado.nome}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <DateRangeCalendar startDate={handleStartDate} endDate={handleEndDate} filter={true} />

                  <ClassPick onApply={handleSubmitClass} />

                  <Button
                    type="submit"
                    sx={{
                      p: "1rem",
                      width: '200px',
                      position: 'relative', top: '-35px',
                      heigth: "85px",
                      backgroundColor: '#567EBB',
                      color: "white",
                      fontWeight: "bold",
                      "&:hover": { color: blueColor, backgroundColor: 'white' },
                      boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.4)"
                    }}
                  >Buscar
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: "1rem",
                    justifyContent: "space-evenly"
                  }}>

                  <FormControl variant="filled" sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'black',
                    width: '100%',
                    fontSize: '1rem',
                  }}>
                    <InputLabel sx={{
                      color: blueColor, fontWeight: 'bold', display: 'flex',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}> <FlightTakeoffIcon sx={{ color: 'black' }} />Origem</InputLabel>
                    <Select
                      value={formik.values.de}
                      onChange={(e) => formik.setFieldValue('de', e.target.value)}
                      sx={{ backgroundColor: "white", borderRadius: "4px", fontWeight: 600, width: '100%', '&:hover': { backgroundColor: 'white' } }}
                      SelectDisplayProps={{
                        style: {
                          backgroundColor: 'white',
                          borderRadius: '4px'
                        }
                      }}
                    >
                      {states && states.map((estado, i) => (
                        <MenuItem key={i} value={estado.nome}>{estado.nome}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl variant="filled" sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'black',
                    width: '100%',
                    fontSize: '1rem',
                  }}>
                    <InputLabel sx={{
                      color: blueColor, fontWeight: 'bold', display: 'flex',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}> <FlightLandIcon sx={{ color: 'black' }} />Destino</InputLabel>
                    <Select
                      value={formik.values.para}
                      onChange={(e) => formik.setFieldValue('para', e.target.value)}
                      sx={{ backgroundColor: "white", borderRadius: "4px", fontWeight: 600, width: '100%', '&:hover': { backgroundColor: 'white' } }}
                      SelectDisplayProps={{
                        style: {
                          backgroundColor: 'white',
                          borderRadius: '4px'
                        }
                      }}
                    >
                      {states && states.map((estado, i) => (
                        <MenuItem key={i} value={estado.nome}>{estado.nome}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <DateRangeCalendar startDate={handleStartDate} endDate={handleEndDate} filter={true} />

                  <ClassPick onApply={handleSubmitClass} />

                  <Button
                    type="submit"
                    fullWidth
                    sx={{
                      p: "1rem",
                      position: 'relative',
                      heigth: "85px",
                      backgroundColor: '#567EBB',
                      color: "white",
                      fontWeight: "bold",
                      "&:hover": { color: blueColor, backgroundColor: 'white' },
                      boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.4)"
                    }}
                  >Buscar
                  </Button>
                </Box>
              )}
            </form>
          )}
        </Formik>


        {isNonMobile ? (
          <Box sx={{
            backgroundColor: 'white',
            width: '80%',
            height: 'auto',
            marginBottom: '100px',
            padding: '50px',
            borderRadius: '40px'
          }}>
            <Typography></Typography>
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>

              <Button onClick={() => navigate('/packages')} sx={{ '&:hover': { boxShadow: "4px 4px 2px rgba(0, 0, 0, 0.3)" } }} style={imagemPlanejamento}></Button>
              <Button sx={{ '&:hover': { boxShadow: "4px 4px 2px rgba(0, 0, 0, 0.3)" } }} style={imagemRoteiros}></Button>
            </Box>

          </Box>
        ) : (

          <Box sx={{
            backgroundColor: 'white',
            width: '100%',
            height: 'auto',
            marginBottom: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '50px',
            gap: '1rem'
          }}>

            <Button onClick={() => navigate('/packages')} sx={{ '&:hover': { boxShadow: "4px 4px 2px rgba(0, 0, 0, 0.3)" } }} style={imagemPlanejamento}></Button>
            <Button sx={{ '&:hover': { boxShadow: "4px 4px 2px rgba(0, 0, 0, 0.3)" } }} style={imagemRoteiros}></Button>
          </Box>
        )}


        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '7rem', marginBottom: '100px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: isNonMobile ? 'row' : 'column', width: isNonMobile ? '80rem' : '100%', color: 'white', gap: '0.5rem' }}>
            {isNonMobile ? (
              <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Typography sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.6rem', fontSize: '20px' }}><WorkIcon />Pacotes populares</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '30px' }}>
                  Aqui estão algumas opções de pacotes de viagem que podem tornar suas próximas férias ainda mais incríveis.
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', fontSize: '25px' }}><WorkIcon />Pacotes</Typography>
            )}

            <Carousel />
          </Box>


          <Box sx={{ display: 'flex', flexDirection: isNonMobile ? 'row' : 'column-reverse', justifyContent: 'space-between', width: isNonMobile ? '80rem' : '100%', color: 'white', gap: '0.5rem' }}>
            <Carousel />

            {isNonMobile ? (
              <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1.5rem' }}>
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '20px' }}><LocalAirportIcon />Roteiros famosos</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '30px', textAlign: 'right' }}>
                  Confira agora nossas incríveis ofertas! Temos preços arrasadores para os melhores destinos nacionais e internacionais. Não perca mais tempo e reserve sua viagem hoje mesmo!
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', fontSize: '25px' }}><LocalAirportIcon />Passagens aéreas</Typography>
            )}


          </Box>

        </Box>

      </Box>
    </Box >
  )
}

export default HomePage;